'use server';

import { cookies } from 'next/headers';
import { getApiUrl } from './api-url';

const SESSION_COOKIE = 'vendure-auth-token';

// Responses are not code-generated; each caller reads only the fields it queried
// (this matches the untyped `json.data` the helpers used before).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GqlResponse = { data?: any; errors?: Array<{ message: string }> };

// Calls the Vendure Shop API with the shopper's cart session.
// Vendure issues the session token in the `vendure-auth-token` *response header* (bearer
// mode); we keep it in an httpOnly cookie on the storefront domain and send it back as
// `Authorization: Bearer`. Without this every call would start a new anonymous order.
async function vendureFetch(query: string, variables: Record<string, unknown> = {}) {
    const json = await vendureFetchRaw(query, variables);
    return json.data;
}

// Returns the full GraphQL response ({ data, errors }) so callers can surface server messages.
async function vendureFetchRaw(query: string, variables: Record<string, unknown> = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    const res = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store', // Cart data should never be cached
    });

    const issued = res.headers.get(SESSION_COOKIE);
    if (issued && issued !== token) {
        try {
            cookieStore.set(SESSION_COOKIE, issued, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30,
            });
        } catch {
            // Server Components cannot set cookies; only Server Actions can. Safe to ignore on reads.
        }
    }

    return res.json() as Promise<GqlResponse>;
}

export async function getActiveOrder() {
    const query = `
        query {
            activeOrder {
                id code state totalWithTax
                lines {
                    id quantity linePriceWithTax
                    productVariant { id name sku price priceWithTax }
                    featuredAsset { preview }
                }
            }
        }
    `;
    const data = await vendureFetch(query);
    return data?.activeOrder || null;
}

export async function addToCart(productVariantId: string, quantity: number = 1) {
    const query = `
        mutation AddItem($productVariantId: ID!, $quantity: Int!) {
            addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
                ... on Order {
                    id code state totalWithTax
                }
                ... on ErrorResult {
                    errorCode message
                }
            }
        }
    `;
    const data = await vendureFetch(query, { productVariantId, quantity });
    return data?.addItemToOrder;
}

// Look up a Vendure ProductVariant by product slug
export async function findVariantBySlug(slug: string): Promise<{ id: string; price: number } | null> {
  const query = `
    query GetProductBySlug($slug: String!) {
      product(slug: $slug) {
        id
        name
        variants {
          id
          sku
          price
          priceWithTax
        }
      }
    }
  `;
  try {
    const data = await vendureFetch(query, { slug });
    const variants = data?.product?.variants;
    if (variants && variants.length > 0) {
      const v = variants[0];
      return { 
        id: String(v.id), 
        price: v.priceWithTax || v.price || 0 
      };
    }
  } catch (e) {
    console.error('Error fetching variant for slug:', slug, e);
  }
  return null;
}

export const findVariantBySku = findVariantBySlug;

type CheckoutResult<T> = ({ ok: true } & T) | { ok: false; message: string };

// Make the Vendure order contain exactly the browser cart. Safe to call repeatedly:
// a retry (double click, second attempt after closing the popup) never duplicates lines.
export async function syncCartToVendure(
  items: Array<{ slug: string; quantity: number }>
): Promise<CheckoutResult<{ orderId: string; orderCode: string; totalWithTax: number }>> {
  const current = await getActiveOrder();
  if (current?.state === 'ArrangingPayment') {
    // Going back to AddingItems also releases the stock hold so the cart can be edited.
    await vendureFetch(
      `mutation { transitionOrderToState(state: "AddingItems") { ... on Order { id } ... on OrderStateTransitionError { message } } }`
    );
  }
  if (current?.lines?.length) {
    await vendureFetch(
      `mutation { removeAllOrderLines { ... on Order { id } ... on ErrorResult { message } } }`
    );
  }
  for (const item of items) {
    const variant = await findVariantBySlug(item.slug);
    if (!variant) {
      return { ok: false, message: `"${item.slug}" is no longer listed. Please remove it from your cart.` };
    }
    const added = await addToCart(variant.id, item.quantity);
    if (added?.errorCode) {
      return {
        ok: false,
        message:
          added.errorCode === 'INSUFFICIENT_STOCK_ERROR'
            ? 'One of the devices in your cart has just been reserved by another customer.'
            : added.message,
      };
    }
  }
  const order = await getActiveOrder();
  if (!order?.id) {
    return { ok: false, message: 'Could not create your order. Please try again.' };
  }
  return { ok: true, orderId: order.id, orderCode: order.code, totalWithTax: order.totalWithTax };
}

// Everything up to the payment step, as one server action. On success the order is in
// ArrangingPayment and the devices are reserved for this customer.
export async function prepareCheckout(input: {
  items: Array<{ slug: string; quantity: number }>;
  customer: { firstName: string; lastName: string; emailAddress: string; phoneNumber: string };
  address: { fullName: string; streetLine1: string; city: string; province: string; countryCode: string };
}): Promise<CheckoutResult<{ orderCode: string; totalWithTax: number }>> {
  const synced = await syncCartToVendure(input.items);
  if (!synced.ok) return synced;

  const customer = await vendureFetch(
    `mutation SetCustomer($input: CreateCustomerInput!) {
      setCustomerForOrder(input: $input) { ... on Order { id } ... on ErrorResult { errorCode message } }
    }`,
    { input: input.customer }
  );
  const customerResult = customer?.setCustomerForOrder;
  if (!customerResult?.id && customerResult?.errorCode !== 'ALREADY_LOGGED_IN_ERROR') {
    return { ok: false, message: customerResult?.message || 'Could not save your contact details.' };
  }
  if (!(await setOrderShippingAddress(input.address))) {
    return { ok: false, message: 'Could not save your delivery address.' };
  }
  if (!(await setOrderShippingMethod())) {
    return { ok: false, message: 'Delivery is not available for this order. Please contact us on WhatsApp.' };
  }
  const moved = await transitionOrderToArrangingPayment();
  if (!moved.ok) {
    return {
      ok: false,
      message: /insufficient stock|no longer available|reserved/i.test(moved.message)
        ? 'One of the devices in your cart has just been reserved by another customer.'
        : moved.message,
    };
  }
  const order = await getActiveOrder();
  return { ok: true, orderCode: order.code, totalWithTax: order.totalWithTax };
}

// Set customer details on the active order
export async function setCustomerForOrder(input: {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
}): Promise<boolean> {
  const query = `
    mutation SetCustomer($input: CreateCustomerInput!) {
      setCustomerForOrder(input: $input) {
        ... on Order { id }
        ... on ErrorResult { errorCode message }
      }
    }
  `;
  const data = await vendureFetch(query, { input });
  return !!data?.setCustomerForOrder?.id;
}

// Set shipping address on the active order  
export async function setOrderShippingAddress(input: {
  fullName: string;
  streetLine1: string;
  city: string;
  province: string;
  countryCode: string;
}): Promise<boolean> {
  const query = `
    mutation SetAddress($input: CreateAddressInput!) {
      setOrderShippingAddress(input: $input) {
        ... on Order { id }
        ... on ErrorResult { errorCode message }
      }
    }
  `;
  const data = await vendureFetch(query, { input });
  return !!data?.setOrderShippingAddress?.id;
}

// Get eligible shipping methods for the active order
export async function getEligibleShippingMethods(): Promise<Array<{ id: string; name: string; price: number }>> {
  const query = `
    query EligibleShipping {
      eligibleShippingMethods { id name price priceWithTax }
    }
  `;
  const data = await vendureFetch(query);
  return data?.eligibleShippingMethods || [];
}

// Set shipping method on the active order
export async function setOrderShippingMethod(): Promise<boolean> {
  const methods = await getEligibleShippingMethods();
  const shippingId = methods && methods.length > 0 ? methods[0].id : '1';
  
  const query = `
    mutation SetShipping($id: [ID!]!) {
      setOrderShippingMethod(shippingMethodId: $id) {
        ... on Order { id state }
        ... on ErrorResult { errorCode message }
      }
    }
  `;
  const data = await vendureFetch(query, { id: [shippingId] });
  return !!data?.setOrderShippingMethod?.id;
}

// Transition order to ArrangingPayment state (this is where the stock hold is taken)
export async function transitionOrderToArrangingPayment(): Promise<{ ok: true } | { ok: false; message: string }> {
  const active = await getActiveOrder();
  if (active?.state === 'ArrangingPayment') {
    return { ok: true };
  }
  const data = await vendureFetch(
    `mutation Transition($state: String!) {
      transitionOrderToState(state: $state) {
        ... on Order { id state }
        ... on OrderStateTransitionError { errorCode message transitionError }
      }
    }`,
    { state: 'ArrangingPayment' }
  );
  const res = data?.transitionOrderToState;
  if (res?.state === 'ArrangingPayment') return { ok: true };
  return { ok: false, message: res?.transitionError || res?.message || 'Could not start checkout' };
}

// Ask the server to start a Paystack payment. The amount is the Vendure order total,
// not anything computed in the browser.
export async function startPaystackPayment(): Promise<
  CheckoutResult<{ reference: string; accessCode: string; amount: number; orderCode: string }>
> {
  const json = await vendureFetchRaw(
    `mutation { initPaystackTransaction { reference accessCode amount orderCode } }`
  );
  const init = json.data?.initPaystackTransaction;
  if (!init) {
    return { ok: false, message: json.errors?.[0]?.message || 'Could not start the payment' };
  }
  return { ok: true, ...init };
}

export interface PaymentConfirmation {
  status: 'settled' | 'pending' | 'processing' | 'declined' | 'needs_review' | 'unknown' | 'initialized';
  orderCode?: string;
  orderState?: string;
  message?: string;
}

// Ask the server to confirm a reference with Paystack. Idempotent; the webhook does the same.
export async function confirmPaystackPayment(reference: string): Promise<PaymentConfirmation> {
  const json = await vendureFetchRaw(
    `mutation Verify($reference: String!) {
      verifyPaystackPayment(reference: $reference) { status orderCode orderState message }
    }`,
    { reference }
  );
  return json.data?.verifyPaystackPayment ?? { status: 'pending', message: json.errors?.[0]?.message };
}

// WhatsApp concierge: place the order as "pay on delivery". The devices stay reserved
// and staff settle the payment in the admin once the money is collected.
export async function placePayOnDeliveryOrder(): Promise<CheckoutResult<{ orderCode: string; state: string }>> {
  const data = await vendureFetch(
    `mutation {
      addPaymentToOrder(input: { method: "cash-on-delivery", metadata: { channel: "whatsapp" } }) {
        ... on Order { code state }
        ... on ErrorResult { errorCode message }
      }
    }`
  );
  const res = data?.addPaymentToOrder;
  if (res?.state === 'PaymentAuthorized') {
    return { ok: true, orderCode: res.code, state: res.state };
  }
  return { ok: false, message: res?.message || 'Could not place your order' };
}
