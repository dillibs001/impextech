'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api';

// Helper to pass cookies to Vendure to maintain the Cart session
async function vendureFetch(query: string, variables: Record<string, unknown> = {}) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('vendure-auth-token');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (sessionCookie) {
        headers['Cookie'] = `vendure-auth-token=${sessionCookie.value}`;
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store' // Cart data should never be cached
    });

    // Capture the cookie Vendure sends back to maintain the session
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader && setCookieHeader.includes('vendure-auth-token')) {
        const tokenMatch = setCookieHeader.match(/vendure-auth-token=([^;]+)/);
        if (tokenMatch) {
            try {
                cookieStore.set('vendure-auth-token', tokenMatch[1], { path: '/', httpOnly: true });
            } catch {
                // In Server Components / read operations, Next.js disallows setting cookies; ignore safely
            }
        }
    }

    const json = await res.json();
    return json.data;
}

export async function getActiveOrder() {
    const query = `
        query {
            activeOrder {
                id code totalWithTax
                lines {
                    id quantity linePriceWithTax
                    productVariant { name }
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
                    id code totalWithTax
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

// Look up a Vendure ProductVariant by its SKU (which matches our catalog slug)
export async function findVariantBySku(sku: string): Promise<{ id: string; price: number } | null> {
  const query = `
    query FindVariant($sku: String!) {
      search(input: { term: $sku, take: 1 }) {
        items { productVariantId sku price { ... on SinglePrice { value } } }
      }
    }
  `;
  const data = await vendureFetch(query, { sku });
  const item = data?.search?.items?.[0];
  if (item && item.sku === sku) {
    return { id: item.productVariantId, price: item.price?.value || 0 };
  }
  return null;
}

// Sync the entire localStorage cart to Vendure at checkout time
export async function syncCartToVendure(items: Array<{ slug: string; quantity: number }>): Promise<{
  orderId: string;
  orderCode: string;
  totalWithTax: number;
} | null> {
  let orderData = null;
  for (const item of items) {
    const variant = await findVariantBySku(item.slug);
    if (variant) {
      orderData = await addToCart(variant.id, item.quantity);
      if (orderData?.errorCode) {
        console.error('Error adding to cart:', orderData.message);
      }
    }
  }
  
  const order = await getActiveOrder();
  if (order) {
    return {
      orderId: order.id,
      orderCode: order.code,
      totalWithTax: order.totalWithTax
    };
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
  if (!methods || methods.length === 0) return false;
  
  const query = `
    mutation SetShipping($id: [ID!]!) {
      setOrderShippingMethod(shippingMethodId: $id) {
        ... on Order { id state }
        ... on ErrorResult { errorCode message }
      }
    }
  `;
  // use the first method available
  const data = await vendureFetch(query, { id: [methods[0].id] });
  return !!data?.setOrderShippingMethod?.id;
}

// Transition order to ArrangingPayment state
export async function transitionOrderToArrangingPayment(): Promise<boolean> {
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
