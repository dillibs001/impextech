export interface Review {
  id: string;
  productSlug: string;
  reviewerName: string;      // "Adebayo T.", "Chidinma O."
  reviewerCity: string;      // "Lagos", "Abuja", "Port Harcourt"
  rating: number;            // 1-5
  title: string;
  body: string;
  purchaseDate: string;      // ISO date string
  isVerifiedBuyer: boolean;
  helpful: number;           // number of "helpful" votes
  deviceConditionActual: 'Pristine' | 'Excellent' | 'Good'; // as-received condition
}

export const SEED_REVIEWS: Review[] = [
  // 1. iPhone 15 Pro Max 256GB (Natural Titanium)
  {
    id: 'rev-ip15pm-1',
    productSlug: 'iphone-15-pro-max-256gb-natural-titanium',
    reviewerName: 'Adebayo T.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Absolute mint condition, worth every Naira',
    body: 'I was skeptical about buying a pre-owned 15 Pro Max online in Lagos, but impextech proved me wrong. Battery health came in at exactly 99% as advertised. Saved over ₦350,000 compared to brand new retail price. The Canada unit has pristine titanium edges without a single scratch. Dispatched to Victoria Island within 3 hours.',
    purchaseDate: '2026-09-14T10:30:00Z',
    isVerifiedBuyer: true,
    helpful: 24,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-ip15pm-2',
    productSlug: 'iphone-15-pro-max-256gb-natural-titanium',
    reviewerName: 'Chidinma O.',
    reviewerCity: 'Abuja',
    rating: 5,
    title: 'Verified clean IMEI and 99% battery life',
    body: 'They sent a WhatsApp inspection video showing the serial and battery health before shipping to Abuja via GIG Logistics. Delivered in 2 days. The camera quality is phenomenal, and the Natural Titanium color is stunning. Highly recommend impextech for genuine Canada electronics.',
    purchaseDate: '2026-08-22T14:15:00Z',
    isVerifiedBuyer: true,
    helpful: 16,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-ip15pm-3',
    productSlug: 'iphone-15-pro-max-256gb-natural-titanium',
    reviewerName: 'Emeka N.',
    reviewerCity: 'Port Harcourt',
    rating: 4,
    title: 'Flawless phone, delivery took an extra day',
    body: 'The iPhone 15 Pro Max is indistinguishable from brand new. Clean global IMEI, unlocked on MTN 5G immediately. Paying ₦1,250,000 instead of ₦1,600,000 retail is immense value. Port Harcourt delivery took 48 hours instead of 24 hours, but the device condition made up for it.',
    purchaseDate: '2026-07-30T09:00:00Z',
    isVerifiedBuyer: true,
    helpful: 9,
    deviceConditionActual: 'Pristine',
  },

  // 2. iPhone 14 Pro 128GB (Space Black)
  {
    id: 'rev-ip14p-1',
    productSlug: 'iphone-14-pro-128gb-space-black',
    reviewerName: 'Olumide F.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Dynamic Island works like a charm — 95% battery',
    body: 'Bought this for ₦840,000 and it looks straight out of an Apple Store. The Canada import quality is noticeable — zero refurbishment marks or third-party screen replacements. impextech customer support on WhatsApp was top notch.',
    purchaseDate: '2026-09-02T11:20:00Z',
    isVerifiedBuyer: true,
    helpful: 19,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-ip14p-2',
    productSlug: 'iphone-14-pro-128gb-space-black',
    reviewerName: 'Zainab B.',
    reviewerCity: 'Kano',
    rating: 5,
    title: 'Solid battery life and crisp cameras',
    body: 'My first time ordering electronics from an online platform to Kano. Phone arrived safely with protective packaging. Battery health reads 95%, cameras and Face ID are in pristine condition. The ₦260,000 savings versus retail price was a great bargain.',
    purchaseDate: '2026-08-10T16:45:00Z',
    isVerifiedBuyer: true,
    helpful: 11,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-ip14p-3',
    productSlug: 'iphone-14-pro-128gb-space-black',
    reviewerName: 'Femi A.',
    reviewerCity: 'Ibadan',
    rating: 4,
    title: 'Excellent condition, true value for money',
    body: 'Microscopic hairline mark on the stainless steel rail that you can only see under direct spotlight, but the screen and back glass are 100% spotless. Battery lasts all day on 4G. impextech is now my go-to vendor for gadgets in Nigeria.',
    purchaseDate: '2026-07-18T13:10:00Z',
    isVerifiedBuyer: true,
    helpful: 7,
    deviceConditionActual: 'Excellent',
  },

  // 3. MacBook Pro M3 14" 512GB (Space Black)
  {
    id: 'rev-mbpm3-1',
    productSlug: 'macbook-pro-m3-14-inch-512gb-space-black',
    reviewerName: 'Babajide D.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Corporate off-lease beast from Toronto! Only 34 cycle count',
    body: 'I run Docker containers and heavy Flutter builds daily. Getting this M3 Pro MacBook for ₦1,750,000 instead of ₦2,400,000 retail is the best financial decision I made this year. Cycle count was only 34 when I checked CoconutBattery. True Canada corporate grade.',
    purchaseDate: '2026-09-28T15:00:00Z',
    isVerifiedBuyer: true,
    helpful: 31,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-mbpm3-2',
    productSlug: 'macbook-pro-m3-14-inch-512gb-space-black',
    reviewerName: 'Ngozi E.',
    reviewerCity: 'Abuja',
    rating: 5,
    title: 'Space Black finish is spotless, keyboard is Canadian ANSI',
    body: 'Packaging was secure with heavy bubble wrap. MagSafe charger and high-wattage brick were included. Liquid Retina XDR screen has zero dead pixels or keyboard marks. Clean serial number checked on Apple coverage website without issues.',
    purchaseDate: '2026-08-05T12:00:00Z',
    isVerifiedBuyer: true,
    helpful: 14,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-mbpm3-3',
    productSlug: 'macbook-pro-m3-14-inch-512gb-space-black',
    reviewerName: 'Tariq M.',
    reviewerCity: 'Port Harcourt',
    rating: 5,
    title: '10-core CPU performance with 16-hour battery',
    body: 'The battery life on this MacBook Pro is unreal for software engineering. impextech sent a video proof of diagnostics and serial number before dispatching. Delivered to GRA Port Harcourt in pristine condition. Worth every single Naira.',
    purchaseDate: '2026-07-12T08:30:00Z',
    isVerifiedBuyer: true,
    helpful: 8,
    deviceConditionActual: 'Pristine',
  },

  // 4. AirPods Pro 2nd Gen USB-C
  {
    id: 'rev-app2-1',
    productSlug: 'airpods-pro-2nd-gen-usb-c',
    reviewerName: 'Damilola S.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Active Noise Cancellation is genuine Apple standard',
    body: 'Be careful of counterfeit AirPods in computer village. I bought these from impextech because of their Canada verified sourcing. Serial number matches on box and case, Adaptive Audio and USB-C charging work flawlessly. 10/10.',
    purchaseDate: '2026-10-01T17:20:00Z',
    isVerifiedBuyer: true,
    helpful: 22,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-app2-2',
    productSlug: 'airpods-pro-2nd-gen-usb-c',
    reviewerName: 'Blessing U.',
    reviewerCity: 'Enugu',
    rating: 5,
    title: 'Case and buds arrived sanitized and immaculate',
    body: 'Included all original silicone ear tips in different sizes. The sound isolation during generator noise at night is a lifesaver for studying. Excellent customer care from impextech team.',
    purchaseDate: '2026-09-18T10:15:00Z',
    isVerifiedBuyer: true,
    helpful: 13,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-app2-3',
    productSlug: 'airpods-pro-2nd-gen-usb-c',
    reviewerName: 'Kelechi W.',
    reviewerCity: 'Abuja',
    rating: 4,
    title: 'Superb sound, battery life is solid 6 hours per bud',
    body: 'Tiny scuff on the gloss of the charging case, which is expected with pre-owned AirPods, but the pods themselves are spotless and sound incredible. USB-C convenience is awesome. Great value for pre-owned Canada stock.',
    purchaseDate: '2026-08-29T14:40:00Z',
    isVerifiedBuyer: true,
    helpful: 6,
    deviceConditionActual: 'Excellent',
  },

  // 5. Samsung Galaxy S24 Ultra 512GB (Titanium Black)
  {
    id: 'rev-s24u-1',
    productSlug: 'samsung-galaxy-s24-ultra-512gb-titanium-black',
    reviewerName: 'Ibrahim K.',
    reviewerCity: 'Abuja',
    rating: 5,
    title: 'Snapdragon processor, 200MP camera is mindblowing',
    body: 'Direct Canada import with Snapdragon processor (much better battery efficiency). S-Pen functions smoothly, anti-reflective display is pristine with 0 scratches. impextech confirmed 96% battery health and clean IMEI on all Nigerian SIMs.',
    purchaseDate: '2026-09-20T11:00:00Z',
    isVerifiedBuyer: true,
    helpful: 27,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-s24u-2',
    productSlug: 'samsung-galaxy-s24-ultra-512gb-titanium-black',
    reviewerName: 'Chioma A.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Saved over ₦300,000 on 512GB storage model',
    body: 'Needed large storage for 4K video recording. The price was ₦820,000 compared to ₦1,150,000 in open market stores. Received prompt delivery in Lekki Phase 1 with physical warranty invoice. impextech has won my trust.',
    purchaseDate: '2026-08-15T16:30:00Z',
    isVerifiedBuyer: true,
    helpful: 18,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-s24u-3',
    productSlug: 'samsung-galaxy-s24-ultra-512gb-titanium-black',
    reviewerName: 'Osas I.',
    reviewerCity: 'Port Harcourt',
    rating: 4,
    title: 'Screen is brilliant, battery lasts nearly two days',
    body: 'High end flagship at an honest pre-owned price. The titanium frame feels sturdy and premium. Battery health is at 96% as stated. Smooth ordering process via WhatsApp.',
    purchaseDate: '2026-07-25T13:50:00Z',
    isVerifiedBuyer: true,
    helpful: 10,
    deviceConditionActual: 'Excellent',
  },

  // 6. MacBook Air M2 256GB (Midnight)
  {
    id: 'rev-mbam2-1',
    productSlug: 'macbook-air-m2-256gb-midnight',
    reviewerName: 'Somtochukwu E.',
    reviewerCity: 'Lagos',
    rating: 5,
    title: 'Midnight color with only 18 battery cycles! Incredible',
    body: 'Midnight color is famous for showing fingerprints, but this Canada unit arrived spotless with zero scratches. CoconutBattery showed only 18 charge cycles and 98% battery health. Paid ₦980,000 instead of ₦1,350,000 new.',
    purchaseDate: '2026-10-05T09:15:00Z',
    isVerifiedBuyer: true,
    helpful: 25,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-mbam2-2',
    productSlug: 'macbook-air-m2-256gb-midnight',
    reviewerName: 'Fatima Y.',
    reviewerCity: 'Abuja',
    rating: 5,
    title: 'Silent, featherlight, and battery stays alive for 15 hours',
    body: 'Using it for remote product management work. The Liquid Retina display and 1080p camera are crisp for Zoom calls. Canada off-lease quality is vastly superior to random refurbished devices.',
    purchaseDate: '2026-09-12T14:00:00Z',
    isVerifiedBuyer: true,
    helpful: 15,
    deviceConditionActual: 'Pristine',
  },
  {
    id: 'rev-mbam2-3',
    productSlug: 'macbook-air-m2-256gb-midnight',
    reviewerName: 'Victor M.',
    reviewerCity: 'Ibadan',
    rating: 4,
    title: 'Great laptop, MagSafe cable included',
    body: 'Very pleased with the speed of the M2 chip and silent fanless design. Came with matching midnight MagSafe braided cable and clean power adapter. Arrived in Ibadan in pristine protective packaging.',
    purchaseDate: '2026-08-01T11:45:00Z',
    isVerifiedBuyer: true,
    helpful: 8,
    deviceConditionActual: 'Excellent',
  },
];

const SLUG_ALIASES: Record<string, string[]> = {
  'iphone-15-pro-max-256gb-natural-titanium': [],
  'iphone-14-pro-128gb-space-black': [],
  'macbook-pro-m3-14-inch-512gb-space-black': ['macbook-pro-14-m2-pro-16gb-512gb-space-gray'],
  'macbook-pro-14-m2-pro-16gb-512gb-space-gray': ['macbook-pro-m3-14-inch-512gb-space-black'],
  'airpods-pro-2nd-gen-usb-c': ['airpods-pro-2nd-gen-usbc', 'airpods-pro-2-usbc'],
  'airpods-pro-2nd-gen-usbc': ['airpods-pro-2nd-gen-usb-c', 'airpods-pro-2-usbc'],
  'airpods-pro-2-usbc': ['airpods-pro-2nd-gen-usb-c', 'airpods-pro-2nd-gen-usbc'],
  'samsung-galaxy-s24-ultra-512gb-titanium-black': ['samsung-galaxy-s23-ultra-256gb-phantom-black'],
  'samsung-galaxy-s23-ultra-256gb-phantom-black': ['samsung-galaxy-s24-ultra-512gb-titanium-black'],
  'macbook-air-m2-256gb-midnight': ['macbook-air-13-m2-8gb-256gb-midnight'],
  'macbook-air-13-m2-8gb-256gb-midnight': ['macbook-air-m2-256gb-midnight'],
};

export function getReviewsBySlug(slug: string): Review[] {
  const aliases = SLUG_ALIASES[slug] || [];
  const targetSlugs = [slug, ...aliases];
  return SEED_REVIEWS.filter((r) => targetSlugs.includes(r.productSlug));
}

export function calculateAverageRating(reviews: Review[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function calculateRatingBreakdown(reviews: Review[]): Record<1 | 2 | 3 | 4 | 5, number> {
  const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  if (!reviews) return breakdown;
  reviews.forEach((review) => {
    const r = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[r] = (breakdown[r] || 0) + 1;
  });
  return breakdown;
}

export function getAverageRating(slug: string): number {
  const reviews = getReviewsBySlug(slug);
  return calculateAverageRating(reviews);
}

export function getRatingBreakdown(slug: string): Record<1 | 2 | 3 | 4 | 5, number> {
  const reviews = getReviewsBySlug(slug);
  return calculateRatingBreakdown(reviews);
}
