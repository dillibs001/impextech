import { CATALOG_PRODUCTS, CatalogProduct } from './catalog';

export interface ProductSearchItem {
    productId: string;
    slug: string;
    productName: string;
    description: string;
    priceWithTax: {
        min?: number;
        max?: number;
        value?: number;
    };
    productAsset?: {
        preview: string;
    } | null;
}

interface VendureAsset {
    preview?: string;
}

interface VendureVariant {
    id: string | number;
    name?: string;
    sku?: string;
    price?: number;
    priceWithTax?: number;
    stockLevel?: string;
    customFields?: {
        batteryHealth?: number;
        imeiStatus?: string;
        inspectionVideoUrl?: string;
        sourcePriceCAD?: number;
    };
}

interface VendureProduct {
    id: string | number;
    name: string;
    slug: string;
    description?: string;
    featuredAsset?: VendureAsset;
    assets?: VendureAsset[];
    customFields?: {
        condition?: 'Pristine' | 'Excellent' | 'Good';
        sourceCountry?: string;
    };
    variants: VendureVariant[];
}

export async function queryVendure<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api';
    
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 30 } // ISR: refresh every 30 seconds
    });

    const json = await res.json();
    if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error('Failed to fetch from Vendure API');
    }
    return json.data as T;
}

function detectCategory(name: string): CatalogProduct['category'] {
    const lower = name.toLowerCase();
    if (lower.includes('iphone') || lower.includes('galaxy') || lower.includes('pixel') || lower.includes('phone')) return 'Phones';
    if (lower.includes('macbook') || lower.includes('xps') || lower.includes('laptop')) return 'Laptops';
    if (lower.includes('airpod') || lower.includes('wh-1000') || lower.includes('headphone') || lower.includes('sound')) return 'Headphones';
    if (lower.includes('watch')) return 'Smartwatches';
    if (lower.includes('alpha') || lower.includes('eos') || lower.includes('camera') || lower.includes('lens')) return 'Cameras';
    return 'Accessories';
}

export async function getVendureProducts(): Promise<CatalogProduct[]> {
    const query = `
        query GetProducts {
            products(options: { take: 50 }) {
                items {
                    id
                    name
                    slug
                    description
                    featuredAsset { preview }
                    assets { preview }
                    customFields {
                        condition
                        sourceCountry
                    }
                    variants {
                        id
                        name
                        sku
                        price
                        priceWithTax
                        customFields {
                            batteryHealth
                            imeiStatus
                        }
                    }
                }
            }
        }
    `;

    try {
        const data = await queryVendure<{ products: { items: VendureProduct[] } }>(query);
        const items = data?.products?.items;
        if (items && items.length > 0) {
            return items.map((item) => {
                const variant = item.variants?.[0];
                const rawPrice = variant?.priceWithTax || variant?.price || 0;
                // Vendure minor units (kobo -> Naira)
                const priceNgn = rawPrice > 1000 ? Math.round(rawPrice / 100) : rawPrice;
                
                const staticMatch = CATALOG_PRODUCTS.find(p => p.slug === item.slug);

                return {
                    id: String(item.id),
                    slug: item.slug,
                    name: item.name.replace(/^Pre-owned\s+/i, ''),
                    category: staticMatch?.category || detectCategory(item.name),
                    condition: item.customFields?.condition || staticMatch?.condition || 'Pristine',
                    batteryHealth: variant?.customFields?.batteryHealth ?? staticMatch?.batteryHealth ?? 95,
                    priceNgn: priceNgn > 0 ? priceNgn : (staticMatch?.priceNgn || 500000),
                    retailNgn: staticMatch?.retailNgn || Math.round((priceNgn || 500000) * 1.3),
                    preview: item.featuredAsset?.preview || staticMatch?.preview || (item.assets?.[0]?.preview ?? ''),
                    images: staticMatch?.images || (item.assets && item.assets.length > 0 ? item.assets.map(a => a.preview ?? '') : [staticMatch?.preview || '']),
                    description: item.description || staticMatch?.description || '',
                    imeiStatus: variant?.customFields?.imeiStatus || staticMatch?.imeiStatus || 'Clean & Verified',
                };
            });
        }
    } catch (err) {
        console.warn('Could not fetch live products from Vendure Shop API, using fallback:', err);
    }

    return CATALOG_PRODUCTS;
}

export async function getVendureProductBySlug(slug: string): Promise<CatalogProduct | null> {
    const query = `
        query GetProductBySlug($slug: String!) {
            product(slug: $slug) {
                id
                name
                slug
                description
                featuredAsset { preview }
                assets { preview }
                customFields {
                    condition
                    sourceCountry
                }
                variants {
                    id
                    name
                    sku
                    price
                    priceWithTax
                    customFields {
                        batteryHealth
                        imeiStatus
                    }
                }
            }
        }
    `;

    try {
        const data = await queryVendure<{ product: VendureProduct | null }>(query, { slug });
        const item = data?.product;
        if (item) {
            const variant = item.variants?.[0];
            const rawPrice = variant?.priceWithTax || variant?.price || 0;
            const priceNgn = rawPrice > 1000 ? Math.round(rawPrice / 100) : rawPrice;
            const staticMatch = CATALOG_PRODUCTS.find(p => p.slug === item.slug);

            return {
                id: String(item.id),
                slug: item.slug,
                name: item.name.replace(/^Pre-owned\s+/i, ''),
                category: staticMatch?.category || detectCategory(item.name),
                condition: item.customFields?.condition || staticMatch?.condition || 'Pristine',
                batteryHealth: variant?.customFields?.batteryHealth ?? staticMatch?.batteryHealth ?? 95,
                priceNgn: priceNgn > 0 ? priceNgn : (staticMatch?.priceNgn || 500000),
                retailNgn: staticMatch?.retailNgn || Math.round((priceNgn || 500000) * 1.3),
                preview: item.featuredAsset?.preview || staticMatch?.preview || (item.assets?.[0]?.preview ?? ''),
                images: staticMatch?.images || (item.assets && item.assets.length > 0 ? item.assets.map(a => a.preview ?? '') : [staticMatch?.preview || '']),
                description: item.description || staticMatch?.description || '',
                imeiStatus: variant?.customFields?.imeiStatus || staticMatch?.imeiStatus || 'Clean & Verified',
            };
        }
    } catch (err) {
        console.warn('Could not fetch live product by slug, using fallback:', err);
    }

    return CATALOG_PRODUCTS.find(p => p.slug === slug) || null;
}
