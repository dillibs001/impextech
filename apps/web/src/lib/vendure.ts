export async function queryVendure(query: string, variables: any = {}) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/shop-api';
    
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 60 } // Revalidate cache every 60 seconds (ISR)
    });

    const json = await res.json();
    if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error('Failed to fetch from Vendure API');
    }
    return json.data;
}

export const GET_PRODUCTS_QUERY = `
  query GetProducts {
    search(input: { groupByProduct: true, take: 24 }) {
      items {
        productId
        slug
        productName
        description
        priceWithTax {
          ... on PriceRange { min max }
          ... on SinglePrice { value }
        }
        productAsset { preview }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG_QUERY = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      description
      customFields { condition sourceCountry }
      assets { preview }
      variants {
        id
        name
        priceWithTax
        stockLevel
        customFields { batteryHealth imeiStatus inspectionVideoUrl }
      }
    }
  }
`;
