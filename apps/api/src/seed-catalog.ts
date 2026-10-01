import axios from 'axios';
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { CATALOG_PRODUCTS } from './catalog-data';

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

const GET_SHIPPING_METHODS = `
  query GetShippingMethods {
    shippingMethods {
      items { id code }
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

interface TaxCategoryItem {
  id: string;
  name: string;
}

interface PaymentMethodItem {
  id: string;
  code: string;
}

interface ProductItem {
  id: string;
  slug: string;
}

async function isServerRunning(): Promise<boolean> {
  try {
    const res = await axios.post(
      ADMIN_API,
      { query: '{ __typename }' },
      { timeout: 1500 }
    );
    return res.status === 200;
  } catch {
    return false;
  }
}

async function seed() {
  console.log('Starting seed process...');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appInstance: { close: () => Promise<void> } | null = null;

  try {
    const running = await isServerRunning();
    if (!running) {
      console.log('Vendure server not currently active on port 3001. Starting in-process instance...');
      const app = await bootstrap(config);
      appInstance = app;
      console.log('In-process Vendure instance successfully bootstrapped.');
    }

    const authRes = await axios.post(ADMIN_API, {
      query: AUTH_MUTATION,
      variables: {
        input: { native: { username: 'superadmin', password: 'superadmin' } }
      }
    });

    const authData = authRes.data?.data?.authenticate;
    if (authData?.__typename === 'InvalidCredentialsError') {
      throw new Error(`Auth failed: ${authData.message}`);
    }

    const token = authRes.headers['vendure-auth-token'];
    const cookie = authRes.headers['set-cookie'];

    const client = axios.create({
      baseURL: ADMIN_API,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      }
    });

    const request = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
      const res = await client.post('', { query, variables });
      if (res.data.errors) {
        throw new Error(JSON.stringify(res.data.errors));
      }
      return res.data.data as T;
    };

    // 1. Tax Category
    const taxCategories = await request<{ taxCategories: { items: TaxCategoryItem[] } }>(GET_TAX_CATEGORIES);
    let taxCategoryId = taxCategories.taxCategories.items.find(tc => tc.name === 'Standard')?.id;
    if (!taxCategoryId) {
      const tcRes = await request<{ createTaxCategory: { id: string } }>(CREATE_TAX_CATEGORY, {
        input: { name: 'Standard', isDefault: true }
      });
      taxCategoryId = tcRes.createTaxCategory.id;
      console.log('Created Standard Tax Category');
    }

    // 2. Shipping Method
    const smData = await request<{ shippingMethods: { items: Array<{ id: string; code: string }> } }>(GET_SHIPPING_METHODS);
    if (!smData.shippingMethods.items.some(sm => sm.code === 'standard-shipping')) {
      try {
        await request(CREATE_SHIPPING_METHOD, {
          input: {
            code: 'standard-shipping',
            fulfillmentHandler: 'manual-fulfillment',
            translations: [{ languageCode: 'en', name: 'Standard Shipping', description: 'Insured nationwide courier delivery' }],
            checker: { code: 'default-shipping-eligibility-checker', arguments: [{ name: 'orderTotal', value: '0' }] },
            calculator: {
              code: 'default-shipping-calculator',
              arguments: [
                { name: 'rate', value: '500000' },
                { name: 'includesTax', value: 'auto' },
                { name: 'taxRate', value: '0' }
              ]
            }
          }
        });
        console.log('Created Standard Shipping Method');
      } catch (smErr) {
        console.log('Notice on shipping method:', smErr instanceof Error ? smErr.message : smErr);
      }
    }

    // 3. Payment Method (Paystack)
    const pmData = await request<{ paymentMethods: { items: PaymentMethodItem[] } }>(GET_PAYMENT_METHODS);
    if (!pmData.paymentMethods.items.some(pm => pm.code === 'paystack')) {
      await request(CREATE_PAYMENT_METHOD, {
        input: {
          code: 'paystack',
          enabled: true,
          translations: [{ languageCode: 'en', name: 'Paystack', description: 'Pay securely via Paystack' }],
          handler: {
            code: 'paystack',
            arguments: [{ name: 'secretKey', value: process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder' }]
          }
        }
      });
      console.log('Created Paystack Payment Method');
    }

    // 4. Products
    const existingProds = await request<{ products: { items: ProductItem[] } }>(GET_PRODUCTS);
    const existingSlugs = existingProds.products.items.map(p => p.slug);

    console.log('Seeding products...');
    const summary: Array<{ name: string; sku: string; variantId: string }> = [];

    for (const item of CATALOG_PRODUCTS) {
      if (existingSlugs.includes(item.slug)) {
        console.log(`Skipping ${item.slug}, already exists.`);
        continue;
      }

      const prodRes = await request<{ createProduct: { id: string } }>(CREATE_PRODUCT, {
        input: {
          translations: [{ languageCode: 'en', name: 'Pre-owned ' + item.name, slug: item.slug, description: item.description }],
          customFields: { condition: item.condition, sourceCountry: 'Canada' }
        }
      });

      const productId = prodRes.createProduct.id;

      const varRes = await request<{ createProductVariants: Array<{ id: string }> }>(CREATE_PRODUCT_VARIANTS, {
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

    if (summary.length > 0) {
      console.table(summary);
    }
    console.log('Seed process completed successfully.');
  } catch (err: unknown) {
    console.error('Error seeding:', err);
  } finally {
    if (appInstance) {
      console.log('Closing in-process Vendure instance...');
      await appInstance.close();
      console.log('In-process Vendure instance closed.');
    }
  }
}

seed().then(() => {
  process.exit(0);
});
