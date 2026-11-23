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

// Sync the entire localStorage cart to Vendure at checkout time
export async function syncCartToVendure(items: Array<{ slug: string; quantity: number }>): Promise<{
  orderId: string;
  orderCode: string;
  totalWithTax: number;
} | null> {
  try {
    for (const item of items) {
      const variant = await findVariantBySlug(item.slug);
      if (variant) {
        const orderData = await addToCart(variant.id, item.quantity);
        if (orderData?.errorCode) {
          console.error('Error adding to cart:', orderData.message);
        }
      } else {
        console.warn('Could not find variant for slug:', item.slug);
      }
    }
    
    const order = await getActiveOrder();
    if (order?.id) {
      return {
        orderId: order.id,
        orderCode: order.code,
        totalWithTax: order.totalWithTax
      };
    }
  } catch (err) {
    console.error('Error syncing cart to Vendure:', err);
  }
  return null;
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

// Transition order to ArrangingPayment state
export async function transitionOrderToArrangingPayment(): Promise<boolean> {
  const active = await getActiveOrder();
  if (active?.state === 'ArrangingPayment') {
    return true;
  }

  const query = `
    mutation Transition($state: String!) {
      transitionOrderToState(state: $state) {
        ... on Order { id state }
        ... on OrderStateTransitionError { errorCode message transitionError }
      }
    }
  `;
  const data = await vendureFetch(query, { state: 'ArrangingPayment' });
  return data?.transitionOrderToState?.state === 'ArrangingPayment';
}

// Add payment to the order
export async function addPaymentToOrder(reference: string): Promise<{
  state: string;
  code: string;
} | null> {
  const query = `
    mutation AddPayment($input: PaymentInput!) {
      addPaymentToOrder(input: $input) {
        ... on Order { id code state }
        ... on ErrorResult { errorCode message }
      }
    }
  `;
  const data = await vendureFetch(query, { 
    input: { method: 'paystack', metadata: { reference } }
  });
  
  const res = data?.addPaymentToOrder;
  if (res?.id) {
    return { state: res.state, code: res.code };
  }
  return null;
}
