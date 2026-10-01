'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/shop-api';

// Helper to pass cookies to Vendure to maintain the Cart session
async function vendureFetch(query: string, variables: any = {}) {
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
