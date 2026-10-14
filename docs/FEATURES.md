# Features Index

## Core Features

### 1. Intercom Messenger Integration
- **Component:** `IntercomProvider` (`components/intercom-provider.tsx`)
- **Status:** ✅ Active on all pages
- **Features:**
  - Secure JWT authentication for logged-in users
  - Anonymous visitor support
  - 1-day session duration
  - Persistent conversations
  - Bottom-right messenger bubble
- **API Endpoint:** `POST /api/intercom-token` (JWT generation)
- **Environment Variable:** `INTERCOM_API_SECRET`

### 2. Parts Search System
- **Pages:** `/brands/[brand]`, `/parts/engines`, `/parts/transmissions`
- **Features:**
  - Filter by car model (normalized matching)
  - Filter by part category
  - Year-based search
  - Real-time product grid
  - 50+ brands supported
- **Bug Fixed:** Model filter now works (normalized part-type suffixes)

### 3. Product Images
- **Engine Images:** Professional photos for all 50+ brands
- **Transmission Images:** Type-specific professional photos (CVT, Manual, Automatic)
- **Aspect Ratio:** Locked 4:3 (no CLS)
- **Coverage:** 100% of products
- **API Endpoint:** `GET /api/product-image/[brand]/[sku]`

### 4. Homepage Enhancements
- **Brightened Theme:** Lighter color scheme for better visibility
- **Hero Slider:** Featured engine/transmission images
- **Featured Products Grid:** 8 premium part cards
- **Showcase Gallery:** "How We Deliver Quality" bento section with warehouse, delivery, appointment, and assembly imagery
- **Brand Values Section:** Why Choose Us section
- **Category Explorer:** Engine/Transmission category sections

### 5. Design System
- **Color Scheme:** Metallic silver embossed industrial aesthetic (brightened)
- **Typography:** 2-font system (Roboto for headings and body)
- **Layout:** Flexbox-based responsive design
- **Theme:** Dark mode (brightened) with semantic design tokens

---

## Technical Components

### Components List

| Component | Location | Purpose |
|-----------|----------|---------|
| `IntercomProvider` | `components/intercom-provider.tsx` | Initializes Intercom messenger |
| `HeroSection` | `components/home/hero-section.tsx` | Hero slider with featured images |
| `FeaturedProductsSection` | `components/home/featured-products-section.tsx` | 8-product grid |
| `ShowcaseGallerySection` | `components/home/showcase-gallery-section.tsx` | Bento gallery section |
| `BrandValuesSection` | `components/home/brand-values-section.tsx` | Why Choose Us |
| `CategoriesSection` | `components/home/categories-section.tsx` | Engine/Transmission categories |
| `MobileThemeFab` | `components/mobile-theme-fab.tsx` | Mobile theme toggle |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/intercom-token` | POST | Generate JWT token for Intercom |
| `/api/product-image/[brand]/[sku]` | GET | Fetch product photographs |

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| Homepage | `/` | Main landing page |
| Brand Catalog | `/brands/[brand]` | Brand-specific products with filters |
| Engines Category | `/parts/engines` | All engines by category |
| Transmissions Category | `/parts/transmissions` | All transmissions by category |
| Product Detail | `/brands/[brand]/[product-slug]` | Individual product page |

---

## Database/Data

### Data Sources

| Data | Location | Coverage |
|------|----------|----------|
| Brand Products | `data/brands/*.json` | 50+ automotive brands |
| Car Models | `lib/data.ts` | Model-to-SKU mappings |
| Product Images | `public/product-images/` | Engines (101), Transmissions (3+ types) |

### Key Files

- `lib/brand-catalog.ts` - Core search and filtering logic
- `lib/data.ts` - Brand and model configuration
- `data/brands/ford.json`, etc. - Product inventory

---

## Recently Completed

1. ✅ **Fixed Parts Search** - Model filter now correctly normalizes part-type suffixes
2. ✅ **Added Brightened Theme** - Increased brightness across colors, backgrounds, and images
3. ✅ **Expanded Featured Products** - Added 4 new product cards (brakes, drivetrain, suspension, exhaust)
4. ✅ **Added Showcase Gallery** - New "How We Deliver Quality" bento section with professional imagery
5. ✅ **Intercom JWT Implementation** - Secure authentication with server-side token generation
6. ✅ **Replaced Parts Assistant** - Removed in-app AI assistant, now using Intercom for all support

---

## Environment Variables Required

```
INTERCOM_API_SECRET=es2OvSafq_aUEZD3j4r1xuBCVTrtuhe5iR3NddTuZfs
```

---

## Installation & Setup

```bash
# Install dependencies
pnpm install

# Add environment variables
# Create .env.development.local with INTERCOM_API_SECRET

# Run development server
pnpm dev

# Open browser
http://localhost:3000
```

---

## Support & Troubleshooting

### Common Issues

**JWT Token Generation Fails:**
- Check `INTERCOM_API_SECRET` is set in `.env.development.local`
- Restart dev server after adding environment variable
- Verify endpoint: `POST /api/intercom-token`

**Intercom Messenger Not Showing:**
- Ensure `IntercomProvider` is in root layout
- Check browser console for errors
- Verify app_id `pldz9zi1` is correct
- Wait for widget script to load (async)

**Product Search Returns No Results:**
- Model names are now auto-normalized (part-type suffixes stripped)
- Ensure model name matches dropdown selections
- Year search works on `year` field (4-digit numbers)

### Contact Support
Use Intercom messenger (bottom-right corner) on any page for instant support.
