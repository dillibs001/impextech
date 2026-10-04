# impextech

> **Full-Stack Headless E-Commerce Platform for Verified Pre-Owned Electronics.**  
> Built with Next.js 16, Vendure v3.7 (NestJS), PostgreSQL, Docker, and Paystack.

---

## 📌 Overview

**impextech** is a full-stack e-commerce platform designed for buying certified pre-owned and open-box consumer electronics in Nigeria (smartphones, laptops, smartwatches, cameras, and accessories). 

To address common pain points in secondary electronics markets—such as hidden repair histories, inaccurate battery health disclosures, and cross-border currency friction—the platform is engineered with transparency-first platform features:

- 🔋 **Documented Battery Health**: Structured metadata field tracking verified battery health percentages (0%–100%).
- 🛡️ **Factory-Unlocked & IMEI Tracking**: Specifications display carrier unlocked status and clean IMEI verification.
- 🎥 **Inspection Video Modal**: Integrated modal player allowing customers to inspect physical device cosmetics and screen responsiveness before ordering.
- 💳 **Dual Checkout Options**: Automated digital payments via **Paystack** (Cards, Bank Transfer, USSD) or 1-click **WhatsApp Concierge** reservation.
- 🇳🇬 **Strict Naira (`₦`) Pricing Engine**: Minor-unit currency math (kobo) ensuring 100% accurate Nigerian Naira transactions with zero USD leakage.
- 🤖 **AI Sales Concierge**: Context-aware Google Gemini assistant advising shoppers on device specifications and product matching.

---

## 🛠️ What I Built

- **Full-Stack TypeScript Architecture**: Designed a monorepo pairing a **Next.js 16 (App Router + Turbopack)** storefront with a **Vendure v3.7 (NestJS + TypeORM)** headless commerce backend.
- **Containerized Multi-Service Deployment**: Configured Docker Compose orchestrating isolated multi-stage builds (`postgres:15-alpine`, `api`, `web`) with standalone output and container-network bridging for SSR.
- **Custom Vendure Plugins**:
  - Authored a native **Paystack Payment Plugin** featuring server-to-server transaction verification, anti-tampering amount matching, and HMAC SHA-512 webhook signature validation.
  - Implemented a **Request Board Plugin** allowing users to submit custom gadget procurement requests directly to the database.
- **Storefront State & User Experience**: Built interactive search with debouncing, URL-synchronized category filtering (`/products?category=...&q=...`), slide-out cart drawer, and user auth context.
- **Automated Database Seeding**: Developed an idempotent TypeScript seeding routine that auto-provisions Nigerian tax zones, channels, flat-rate shipping methods, payment methods, and initial device inventory.
- **Automated Test Coverage**: Implemented automated unit and security test suites verifying Paystack signature integrity, kobo minor-unit arithmetic, and customer auth validation.

---

## 📸 Screenshots

| Storefront Catalog | Product Detail & Inspection |
|:---:|:---:|
| ![Storefront Catalog](docs/screenshots/catalog.png)<br/>*Category filtering, search, and device condition tags* | ![Product Detail](docs/screenshots/product-detail.png)<br/>*Battery health metrics and inspection video modal* |

| Checkout & Paystack Modal | Vendure Admin Dashboard |
|:---:|:---:|
| ![Checkout Flow](docs/screenshots/checkout.png)<br/>*Dual payment: Paystack inline & WhatsApp reservation* | ![Vendure Admin](docs/screenshots/admin-dashboard.png)<br/>*Orders, custom fields, and inventory management* |

> *Tip: Drop your exported screenshots into `docs/screenshots/` to display live previews directly in GitHub.*

---

## 🏗️ Architecture

```mermaid
graph TD
    Client["User Browser (Desktop & Mobile)"]
    Admin["Store Admin / Operations"]

    subgraph "Docker Network (impextech-network)"
        Web["Frontend: apps/web (Next.js 16 Standalone)<br/>Port: 3000"]
        API["Backend: apps/api (Vendure v3.7 / NestJS)<br/>Port: 3001"]
        DB[("Database: PostgreSQL 15 Alpine<br/>Port: 5432")]
    end

    Client -->|HTTP / Shop API| Web
    Client -->|Paystack Popup & Direct API| API
    Admin -->|Admin UI /admin| API
    Web -->|Internal SSR / GraphQL| API
    API -->|TypeORM Connection| DB
    API -->|Paystack S2S Webhook & Verify| Paystack["Paystack Gateway"]
    Web -->|AI Sales Inquiries| Gemini["Google Gemini API"]
```

---

## 📂 Repository Structure

This monorepo is organized using **pnpm workspaces**:

```
impextech/
├── apps/
│   ├── web/                         # Next.js 16 (App Router, Turbopack, Tailwind CSS)
│   │   ├── src/
│   │   │   ├── app/                 # Storefront routes (catalog, product detail, checkout, auth, orders)
│   │   │   ├── components/          # UI components (Header, ProductGrid, CartDrawer, SearchBar, Auth, VideoModal)
│   │   │   ├── context/             # React Contexts (CartContext, AuthContext)
│   │   │   ├── lib/                 # Core utilities (vendure.ts, cart.ts, auth.ts, api-url.ts, catalog.ts)
│   │   │   └── types/               # TypeScript declarations (paystack.d.ts, etc.)
│   │   ├── Dockerfile               # Multi-stage production container for Next.js standalone
│   │   └── .env.local.example       # Frontend environment template
│   │
│   └── api/                         # Vendure Headless Commerce Engine (NestJS + TypeORM)
│       ├── src/
│       │   ├── plugins/
│       │   │   ├── paystack/        # Paystack payment method handler & HMAC SHA-512 webhook controller
│       │   │   └── request-board/   # Custom device procurement plugin
│       │   ├── catalog-data.ts      # Structured product catalog data
│       │   ├── seed-catalog.ts      # Automated idempotent catalog seeder
│       │   ├── vendure-config.ts    # Vendure configuration (PostgreSQL, custom fields, scheduler, email)
│       │   └── index.ts             # Server entrypoint
│       ├── test/                    # Unit & security test suites (paystack.spec.ts)
│       ├── Dockerfile               # Multi-stage production container for Vendure API
│       └── .env.example             # Backend environment template
│
├── docker-compose.yml               # Multi-container orchestration (postgres, api, web)
├── pnpm-workspace.yaml              # Monorepo workspace definition
├── package.json                     # Workspace scripts
└── README.md
```

---

## 🚀 Quickstart with Docker (Recommended)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [OrbStack](https://orbstack.dev/)
- Node.js 20+ & `pnpm` (v9+)

### 2. Configure Environment Files

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/shop-api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
GEMINI_API_KEY=your_gemini_api_key_here # Optional
```

Create `apps/api/.env`:
```env
APP_ENV=development
PORT=3001
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=your_secure_admin_password
COOKIE_SECRET=your_cookie_secret_here
FRONTEND_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
```

### 3. Build & Launch Containers
```bash
docker compose up --build -d
```

### 4. Seed the Database
Auto-provisions the Nigerian Tax Zone, Standard Shipping Method, Paystack Payment Method, and initial product catalog:
```bash
docker compose exec api node dist/seed-catalog.js
```

### 5. Access Services

| Service | URL | Notes |
|---|---|---|
| **Storefront** | [http://localhost:3000](http://localhost:3000) | Public customer web application |
| **Shop GraphQL API** | [http://localhost:3001/shop-api](http://localhost:3001/shop-api) | Storefront GraphQL endpoint |
| **Admin GraphQL API** | [http://localhost:3001/admin-api](http://localhost:3001/admin-api) | Operations GraphQL endpoint |
| **Vendure Admin UI** | [http://localhost:3001/admin](http://localhost:3001/admin) | Login via `SUPERADMIN_USERNAME` / `SUPERADMIN_PASSWORD` |
| **Dev Email Mailbox** | [http://localhost:3001/mailbox](http://localhost:3001/mailbox) | In-memory dev mailbox for testing receipts |
| **API Health Check** | [http://localhost:3001/health](http://localhost:3001/health) | Returns `{"status":"ok"}` |

---

## 💻 Local Development (Without Docker)

To run the application directly on your local machine:

```bash
# 1. Install monorepo dependencies
pnpm install

# 2. Start Next.js and Vendure concurrently
pnpm dev

# 3. Seed the local SQLite database
pnpm --filter @impextech/api seed
```

- `apps/web` will run at `http://localhost:3000`
- `apps/api` will run at `http://localhost:3001` (using local SQLite database)

---

## 🧪 Testing & Quality Assurance

The codebase includes automated test suites covering payment calculations, security handshakes, currency formatting, and authentication policies:

```bash
# Run backend Paystack security & math specs
pnpm --filter @impextech/api test

# Run frontend catalog formatting & auth specs
./node_modules/.bin/ts-node apps/web/test/auth.spec.ts
./node_modules/.bin/ts-node apps/web/test/catalog.spec.ts

# Run TypeScript compilation checks across all workspaces
pnpm --filter @impextech/api build
pnpm --filter @impextech/web exec tsc --noEmit
```

### Validated Rules:
- **Kobo Conversion Rule**: Exact minor unit computation (`₦1,250,000` = `125,000,000` kobo) preventing truncation or rounding issues with Paystack.
- **Paystack Webhook HMAC SHA-512**: Verifies valid signatures and rejects tampered transaction payloads.
- **Strict Naira Currency Formatting**: Asserts zero foreign currency symbols (`$`) appear across catalog items.
- **Customer Auth Policies**: Enforces email formatting, Nigerian phone number normalization (`+234`), and password complexity.

---

## 🔑 Environment Variables Reference

### Frontend (`apps/web/.env.local`)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public Vendure Shop API endpoint (Browser) | `http://localhost:3001/shop-api` |
| `INTERNAL_API_URL` | Internal Docker Vendure endpoint (SSR runtime) | `http://api:3001/shop-api` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack Public Key | `pk_test_...` or `pk_live_...` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini AI key for Sales Chat | `AIzaSy...` |

### Backend (`apps/api/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | API listen port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `DB_SYNCHRONIZE` | Auto-sync TypeORM schema on boot | `true` |
| `COOKIE_SECRET` | Session cookie encryption secret | `your_cookie_secret_here` |
| `SUPERADMIN_USERNAME` | Administrator identifier | `superadmin` |
| `SUPERADMIN_PASSWORD` | Administrator password | `your_secure_admin_password` |
| `PAYSTACK_SECRET_KEY` | Paystack Secret Key for S2S verification | `sk_test_...` or `sk_live_...` |
| `SMTP_HOST` | *(Optional)* Production SMTP Host | `smtp.resend.com` |
| `SMTP_PORT` | *(Optional)* Production SMTP Port | `587` |
| `SMTP_USER` | *(Optional)* Production SMTP Username | `resend` |
| `SMTP_PASS` | *(Optional)* Production SMTP Password | `your_smtp_key` |
| `EMAIL_FROM` | Outgoing email sender string | `"impextech" <orders@impextech.ng>` |

---

## 🎨 Design System Notes

- **Typography & Brand**: Strictly lowercase **`impextech`** in all headers, navigation, and logos.
- **Color Palette**:
  - Logo Ash (Backgrounds/Cards): `#2B2E35`, `#1E2127`
  - Crimson Accent (Badges/CTAs): `#DC2626`
  - Subtle Borders: `#3E4452`
- **Currency Standard**: Exclusively formatted in Nigerian Naira (**`₦`** / NGN).

---

## 📄 License

Proprietary — Developed for **impextech**. All rights reserved.
