import axios from 'axios';
import { catalog } from '../../web/src/lib/catalog';

const ADMIN_API = 'http://localhost:3001/admin-api';

const AUTH_MUTATION = `
  mutation Authenticate($input: AuthenticationInput!) {
    authenticate(input: $input) {
      ... on CurrentUser { id identifier }
      ... on InvalidCredentialsError { errorCode message }
    }
  }
`;

const CREATE_TAX_CATEGORY = `
  mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
    createTaxCategory(input: $input) {
      id name
    }
  }
`;

const CREATE_SHIPPING_METHOD = `
  mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
    createShippingMethod(input: $input) {
      id name
    }
  }
`;

const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id slug
    }
  }
`;

const CREATE_PRODUCT_VARIANTS = `
  mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) {
      id sku price
    }
  }
`;

const GET_PAYMENT_METHODS = `
  query GetPaymentMethods {
    paymentMethods {
      items { id code }
    }
  }
`;

const CREATE_PAYMENT_METHOD = `
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
    createPaymentMethod(input: $input) {
      id code
    }
  }
`;

const GET_TAX_CATEGORIES = `
  query GetTaxCategories {
    taxCategories {
      items { id name }
    }
  }
`;

const GET_PRODUCTS = `
  query GetProducts {
    products {
      items { id slug }
    }
  }
`;

async function seed() {
  console.log('Starting seed process...');

  try {
    const authRes = await axios.post(ADMIN_API, {
      query: AUTH_MUTATION,
      variables: {
        input: { native: { username: 'superadmin', password: 'superadmin' } }
      }
    });

    const authData = authRes.data.data.authenticate;
    if (authData.__typename === 'InvalidCredentialsError') {
      throw new Error(`Auth failed: ${authData.message}`);
    }

    // Auth token can be in header or cookie. Vendure returns 'vendure-auth-token' header usually.
    const token = authRes.headers['vendure-auth-token'];
    const cookie = authRes.headers['set-cookie'];
    
    const client = axios.create({
      baseURL: ADMIN_API,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      }
    });

    const request = async (query: string, variables?: any) => {
      const res = await client.post('', { query, variables });
      if (res.data.errors) {
        throw new Error(JSON.stringify(res.data.errors));
      }
      return res.data.data;
    };

    // 1. Tax Category
    let taxCategories = await request(GET_TAX_CATEGORIES);
    let taxCategoryId = taxCategories.taxCategories.items.find((tc: any) => tc.name === 'Standard')?.id;
    if (!taxCategoryId) {
      const tcRes = await request(CREATE_TAX_CATEGORY, {
        input: { name: 'Standard', isDefault: true }
      });
      taxCategoryId = tcRes.createTaxCategory.id;
      console.log('Created Standard Tax Category');
    }

    // 2. Shipping Method
    try {
      await request(CREATE_SHIPPING_METHOD, {
        input: {
          code: 'standard-shipping',
          translations: [{ languageCode: 'en', name: 'Standard Shipping', description: 'Standard Shipping' }],
          checker: { code: 'default-shipping-eligibility-checker', arguments: [{ name: 'orderTotal', value: '0' }] },
          calculator: { code: 'default-shipping-calculator', arguments: [{ name: 'rate', value: '500000', type: 'int' }, { name: 'includesTax', value: 'auto', type: 'string' }, { name: 'taxRate', value: '0', type: 'int' }] }
        }
      });
      console.log('Created Standard Shipping Method');
    } catch (e) {
      // Might already exist or args might be wrong depending on plugins, ignore for now
    }

    // 3. Payment Method
    const pmData = await request(GET_PAYMENT_METHODS);
    if (!pmData.paymentMethods.items.some((pm: any) => pm.code === 'paystack')) {
      await request(CREATE_PAYMENT_METHOD, {
        input: {
          code: 'paystack',
          name: 'Paystack',
          handler: { code: 'paystack', arguments: [] }
        }
      });
      console.log('Created Paystack Payment Method');
    }

    // 4. Products
    const existingProds = await request(GET_PRODUCTS);
    const existingSlugs = existingProds.products.items.map((p: any) => p.slug);
    
    console.log('Seeding products...');
    const summary = [];

    for (const item of catalog) {
      if (existingSlugs.includes(item.slug)) {
        console.log(`Skipping ${item.slug}, already exists.`);
        continue;
      }

      const prodRes = await request(CREATE_PRODUCT, {
        input: {
          translations: [{ languageCode: 'en', name: 'Pre-owned ' + item.name, slug: item.slug, description: item.description }],
          customFields: { condition: item.condition, sourceCountry: 'Canada' }
        }
      });
      
      const productId = prodRes.createProduct.id;

      const varRes = await request(CREATE_PRODUCT_VARIANTS, {
        input: [{
          productId,
          sku: item.slug,
          price: item.priceNgn * 100, // to kobo
          taxCategoryId,
          stockOnHand: 1,
          translations: [{ languageCode: 'en', name: item.name }],
          customFields: { batteryHealth: item.batteryHealth, imeiStatus: item.imeiStatus }
        }]
      });

      const variantId = varRes.createProductVariants[0].id;
      summary.push({ name: item.name, sku: item.slug, variantId });
      console.log(`Created ${item.slug}`);
    }

    console.table(summary);
    console.log('Seed process completed successfully.');

  } catch (err) {
    console.error('Error seeding:', err);
  }
}

seed();
