# AUAPW LLC - Auto Parts Website Documentation

Welcome to the complete documentation index for the AUAPW LLC auto parts e-commerce platform.

## Quick Navigation

### For Users
- **[Features Index](./FEATURES.md)** - Complete list of all website features
- **[API Documentation](./API.md)** - REST API endpoints and integration guide
- **[Support](../README.md#support)** - Getting help via Intercom messenger

### For Developers
- **[API Documentation](./API.md)** - Full endpoint reference with examples
- **[Features Index](./FEATURES.md)** - Technical components and data sources
- **[Installation](../README.md#installation)** - Setup instructions

---

## What We've Built

### 🎯 Core Features

#### 1. **Intercom Messenger Integration**
Secure, enterprise-grade customer support system with JWT authentication.

- ✅ Automatic initialization on all pages
- ✅ Secure JWT tokens for authenticated users
- ✅ Anonymous visitor support
- ✅ Persistent conversation history
- ✅ App ID: `pldz9zi1`

**More Info:** [API Documentation → Intercom Messenger](./API.md#intercom-messenger)

#### 2. **Parts Search & Discovery**
Advanced filtering system for automotive parts across 50+ brands.

- ✅ Smart model filtering (auto-normalized)
- ✅ Category-based browsing
- ✅ Year-based search
- ✅ Real-time product grids

**More Info:** [Features Index → Parts Search](./FEATURES.md#2-parts-search-system)

#### 3. **Professional Product Images**
High-quality, consistent product photography.

- ✅ 101+ engine photos (all brands)
- ✅ Type-specific transmission photos
- ✅ Locked 4:3 aspect ratio (no layout shift)
- ✅ 100% product coverage

**More Info:** [Features Index → Product Images](./FEATURES.md#3-product-images)

#### 4. **Modern Homepage**
Bright, engaging landing page with multiple sections.

- ✅ Hero slider with featured images
- ✅ 8-product featured grid
- ✅ "How We Deliver Quality" showcase gallery
- ✅ Brand values section
- ✅ Category explorer

**More Info:** [Features Index → Homepage](./FEATURES.md#4-homepage-enhancements)

#### 5. **Brightened Design System**
Professional metallic silver industrial aesthetic, optimized for visibility.

- ✅ Lighter color palette
- ✅ Enhanced image brightness
- ✅ Semantic design tokens
- ✅ Responsive flexbox layout

**More Info:** [Features Index → Design System](./FEATURES.md#5-design-system)

---

## API Reference

### Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/intercom-token` | POST | Generate JWT token for Intercom |
| `GET /api/product-image/[brand]/[sku]` | GET | Fetch product photographs |
| `GET /brands/[brand]` | GET | Browse brand products with filters |
| `GET /parts/engines` | GET | Browse all engines |
| `GET /parts/transmissions` | GET | Browse all transmissions |

**Full API Details:** [API Documentation](./API.md)

---

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create .env.development.local with:
INTERCOM_API_SECRET=es2OvSafq_aUEZD3j4r1xuBCVTrtuhe5iR3NddTuZfs

# Start development server
pnpm dev

# Visit application
open http://localhost:3000
```

### Accessing Features

**Intercom Messenger:**
- Appears automatically in bottom-right corner
- Click to start a conversation
- Secure for authenticated users, cookie-based for visitors

**Parts Search:**
- Navigate to `/brands/ford` (or any brand)
- Use dropdowns to filter by model and category
- Try searching by year (e.g., "2015")

**Homepage:**
- Visit `/` for the landing page
- Scroll to see all sections
- Click products to view details

---

## Component Architecture

### Layout Structure
```
app/layout.tsx (Root)
├── ThemeProvider
├── AuthProvider
├── MobileThemeFab
└── IntercomProvider ← Customer Support
    └── Intercom Messenger
```

### Homepage Sections
```
app/page.tsx
├── HeroSection (Featured images)
├── FeaturedProductsSection (8 products)
├── BrandValuesSection (Why Choose Us)
├── ShowcaseGallerySection (Delivery Quality)
└── CategoriesSection (Engine/Transmission)
```

---

## Key Technologies

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Messaging:** Intercom (JWT-authenticated)
- **Authentication:** JWT via `/api/intercom-token`
- **Data:** JSON-based product catalog
- **Images:** Professional photographs (4:3 locked ratio)

---

## Recent Updates

### Latest Changes
1. **Brightened entire website** - Lighter colors for better visibility
2. **Replaced Parts Assistant** - Now using Intercom for all support
3. **Fixed parts search** - Model filtering now works correctly
4. **Added showcase gallery** - "How We Deliver Quality" section
5. **Expanded featured products** - 8 products instead of 4
6. **Secure JWT authentication** - Server-side token generation for Intercom

**Full Details:** [Features Index](./FEATURES.md#recently-completed)

---

## Troubleshooting

### Intercom Not Showing?
1. Check browser console for errors
2. Verify `INTERCOM_API_SECRET` in `.env.development.local`
3. Restart dev server
4. Clear browser cache

### Parts Search Not Working?
1. Use exact model names from dropdown
2. For year search, use 4-digit format (e.g., "2015")
3. Check brand slug in URL (e.g., `/brands/ford`)

### Images Not Loading?
1. Verify product image files exist
2. Check network tab for 404 errors
3. Ensure aspect ratio is 4:3 (no layout shift)

**Need Help?** Use Intercom messenger (bottom-right corner) or see [API Documentation](./API.md#error-handling)

---

## Support & Contact

### Primary Support Channel
**Intercom Messenger** - Available on all pages
- Click the bubble in the bottom-right corner
- Secure conversations for logged-in users
- Anonymous support for visitors

### Other Resources
- **GitHub Issues:** Report bugs or request features
- **Email:** contact@auapw.com
- **Documentation:** Browse these guides

---

## Development

### Project Structure
```
/vercel/share/v0-project/
├── app/                          # Next.js app routes
│   ├── layout.tsx               # Root layout with Intercom
│   ├── page.tsx                 # Homepage
│   ├── brands/                  # Brand catalog pages
│   ├── parts/                   # Category pages
│   └── api/                     # API endpoints
│       └── intercom-token/      # JWT generation
├── components/                  # React components
│   ├── intercom-provider.tsx   # Intercom integration
│   └── home/                    # Homepage sections
├── lib/                         # Utilities and helpers
│   ├── brand-catalog.ts        # Search logic
│   └── data.ts                 # Configuration
├── public/                      # Static assets
│   ├── images/                 # Homepage images
│   └── product-images/         # Product photos
├── data/                        # Product data
│   └── brands/                 # Brand JSON files
└── docs/                        # Documentation (you are here)
    ├── README.md               # This file
    ├── API.md                  # API reference
    └── FEATURES.md             # Features index
```

---

## Next Steps

1. **Explore the API** - Check [API Documentation](./API.md)
2. **Review Features** - See [Features Index](./FEATURES.md)
3. **Test Locally** - Run `pnpm dev` and visit http://localhost:3000
4. **Deploy** - Push to Vercel or your hosting platform
5. **Monitor** - Use Intercom for customer feedback

---

## Version Info

- **Last Updated:** July 2026
- **Status:** Production Ready
- **Next.js:** v16
- **React:** v19
- **Tailwind:** v4

---

**For detailed technical information, see [API Documentation](./API.md) and [Features Index](./FEATURES.md).**
