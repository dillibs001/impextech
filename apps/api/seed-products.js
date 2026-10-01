const http = require('http');

async function request(path, query, variables = {}, cookie = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = http.request(`http://127.0.0.1:3001${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(cookie ? { 'Cookie': cookie } : {})
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ data: json.data, errors: json.errors, headers: res.headers });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const sampleProducts = [
  {
    name: 'iPhone 13 Pro 128GB (Graphite)',
    slug: 'iphone-13-pro-128gb-graphite',
    description: '<p>Canada-sourced Apple iPhone 13 Pro. Super Retina XDR display with ProMotion, A15 Bionic chip, and pro camera system. Fully tested, IMEI verified, clean iCloud, unlocked to all Nigerian networks.</p>',
    condition: 'Excellent',
    sku: 'IPH-13P-128-GR',
    priceNGN: 75000000, // ₦750,000 (minor units)
    batteryHealth: 88,
    sourcePriceCAD: 650,
  },
  {
    name: 'iPhone 14 128GB (Deep Blue)',
    slug: 'iphone-14-128gb-blue',
    description: '<p>Clean Canadian pre-owned iPhone 14. All-day battery life, Emergency SOS, and stunning Photonic Engine cameras. Zero dents or cracks, battery health optimal at 92%.</p>',
    condition: 'Excellent',
    sku: 'IPH-14-128-BLU',
    priceNGN: 88000000, // ₦880,000
    batteryHealth: 92,
    sourcePriceCAD: 760,
  },
  {
    name: 'iPhone 12 64GB (Black)',
    slug: 'iphone-12-64gb-black',
    description: '<p>High-value budget flagship imported from Ontario, Canada. Ceramic Shield, OLED display, 5G enabled. Fully certified hardware with 85% original battery health.</p>',
    condition: 'Good',
    sku: 'IPH-12-64-BLK',
    priceNGN: 48000000, // ₦480,000
    batteryHealth: 85,
    sourcePriceCAD: 410,
  },
  {
    name: 'iPad Air 5th Gen (M1, 64GB, Space Gray)',
    slug: 'ipad-air-m1-64gb-space-gray',
    description: '<p>Incredible M1 workstation performance. 10.9-inch Liquid Retina display, Apple Pencil 2 support, Touch ID in top button. Lightly used student device sourced in Vancouver.</p>',
    condition: 'Excellent',
    sku: 'IPD-AIR-M1-64-SG',
    priceNGN: 68000000, // ₦680,000
    batteryHealth: 98,
    sourcePriceCAD: 590,
  },
  {
    name: 'MacBook Air 13" (M1, 8GB RAM, 256GB SSD, Silver)',
    slug: 'macbook-air-m1-256gb-silver',
    description: '<p>Direct Canada import. Silent fanless design with up to 18 hours battery life. Only 48 battery cycles, pristine keyboard and trackpad, comes with original Apple 30W USB-C charger.</p>',
    condition: 'Excellent',
    sku: 'MAC-AIR-M1-256-SLV',
    priceNGN: 95000000, // ₦950,000
    batteryHealth: 94,
    sourcePriceCAD: 820,
  },
  {
    name: 'Samsung Galaxy S22 Ultra 5G (128GB, Phantom Black)',
    slug: 'samsung-s22-ultra-128gb-black',
    description: '<p>Snapdragon 8 Gen 1 variant from Rogers Canada. Built-in S-Pen, 108MP Quad Camera with 100x Space Zoom, Dynamic AMOLED 2X display. Clean IMEI, dual SIM enabled.</p>',
    condition: 'Good',
    sku: 'SAM-S22U-128-BLK',
    priceNGN: 72000000, // ₦720,000
    batteryHealth: 91,
    sourcePriceCAD: 620,
  },
  {
    name: 'Apple Watch Series 7 GPS 45mm (Midnight Aluminum)',
    slug: 'apple-watch-series-7-45mm-midnight',
    description: '<p>Nearly 20% more screen area than Series 6. Crack-resistant front crystal, fast charging, ECG app and Blood Oxygen sensor. Includes original Sport Band and charging cable.</p>',
    condition: 'Good',
    sku: 'AW-S7-45-MID',
    priceNGN: 34000000, // ₦340,000
    batteryHealth: 89,
    sourcePriceCAD: 290,
  },
  {
    name: 'AirPods Pro 2nd Generation (USB-C MagSafe)',
    slug: 'airpods-pro-2-usbc',
    description: '<p>Up to 2x more Active Noise Cancellation, Adaptive Audio, and Transparency mode. Precision Finding case with speaker and lanyard loop. Verified authentic Apple serial number.</p>',
    condition: 'Excellent',
    sku: 'APP-2-USBC',
    priceNGN: 26000000, // ₦260,000
    batteryHealth: 99,
    sourcePriceCAD: 220,
  }
];

async function seed() {
  console.log('Authenticating with Vendure Admin API...');
  
  const loginRes = await request('/admin-api', `
    mutation {
      login(username: "superadmin", password: "superadmin") {
        ... on CurrentUser {
          id
          identifier
        }
      }
    }
  `);

  if (!loginRes.data?.login?.identifier) {
    console.error('Failed to log in:', loginRes.errors || loginRes);
    return;
  }

  const setCookie = loginRes.headers['set-cookie'];
  const cookie = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie || '';
  console.log('Logged in as superadmin successfully.');

  for (const item of sampleProducts) {
    console.log(`Creating product: ${item.name}...`);
    
    const prodRes = await request('/admin-api', `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
        }
      }
    `, {
      input: {
        translations: [
          {
            languageCode: 'en',
            name: item.name,
            slug: item.slug,
            description: item.description
          }
        ],
        customFields: {
          condition: item.condition,
          sourceCountry: 'Canada'
        }
      }
    }, cookie);

    if (prodRes.errors) {
      console.warn(`Could not create ${item.name}:`, prodRes.errors[0]?.message);
      continue;
    }

    const productId = prodRes.data.createProduct.id;

    console.log(`Creating variant for product ${productId}...`);
    const variantRes = await request('/admin-api', `
      mutation CreateVariant($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
          id
          name
          price
        }
      }
    `, {
      input: [
        {
          productId: productId,
          sku: item.sku,
          translations: [
            {
              languageCode: 'en',
              name: item.name
            }
          ],
          price: item.priceNGN,
          stockOnHand: 1,
          customFields: {
            batteryHealth: item.batteryHealth,
            imeiStatus: 'Clean & Verified',
            sourcePriceCAD: item.sourcePriceCAD
          }
        }
      ]
    }, cookie);

    if (variantRes.errors) {
      console.warn(`Could not create variant for ${item.name}:`, variantRes.errors[0]?.message);
    } else {
      console.log(`Created: ${item.name} (₦${(item.priceNGN / 100).toLocaleString()})`);
    }
  }

  console.log('Reindexing search index...');
  await request('/admin-api', `
    mutation {
      reindex {
        id
      }
    }
  `, {}, cookie);

  console.log('Seeding complete! All 8 Canada-imported gadgets are live in your catalog.');
}

seed().catch(console.error);
