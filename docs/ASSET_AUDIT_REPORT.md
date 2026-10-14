# Asset Audit Report - AUAPW Website

**Date**: 2026-03-06
**Status**: COMPLETED - Ready for Implementation

---

## Executive Summary

This report documents all image assets referenced in the AUAPW website codebase, their current status, and required fixes. The audit identifies **49 total image assets** across the site, including:
- **1** company branding logo
- **45** car brand logos
- **3** hero/content images

---

## Part 1: Company Branding Asset

### Asset: auapw-logo.jpg
| Property | Value |
|----------|-------|
| **Path** | `/auapw-logo.jpg` |
| **Format** | JPG |
| **Usage Locations** | 3 critical components |
| **Display Sizes** | 56px (navbar), 46px (footer), 80px (hero) |
| **Status** | ❌ MISSING - Needs to be generated |
| **Priority** | 🔴 CRITICAL |

**Used In:**
1. `components/navbar.tsx` (line 56) - 56x56px with priority loading
2. `components/footer.tsx` (line 39) - 46x46px with rounded styling  
3. `components/home/hero-section.tsx` (lines 14, 44) - 80x80px circular badge

**Requirements:**
- Professional company logo
- Minimum 128x128px source quality
- Rounded/circular design works best
- High contrast for dark background
- Next.js Image component optimized

---

## Part 2: Brand Logo Assets (Car Manufacturers)

### Overview
All 45 car brands reference logos stored in `/public/logos/` directory with kebab-case naming convention.

**Base Path Pattern:** `/logos/{brand-name}.jpg`

**Complete Brand List:**
```
1. Acura              → /logos/acura.jpg
2. Alfa Romeo         → /logos/alfa-romeo.jpg
3. AMC                → /logos/amc.jpg
4. Audi               → /logos/audi.jpg
5. BMW                → /logos/bmw.jpg
6. Buick              → /logos/buick.jpg
7. Cadillac           → /logos/cadillac.jpg
8. Chevrolet          → /logos/chevrolet.jpg
9. Chrysler           → /logos/chrysler.jpg
10. Daewoo            → /logos/daewoo.jpg
11. Daihatsu          → /logos/daihatsu.jpg
12. Dodge             → /logos/dodge.jpg
13. Eagle             → /logos/eagle.jpg
14. Fiat              → /logos/fiat.jpg
15. Ford              → /logos/ford.jpg
16. Geo               → /logos/geo.jpg
17. GMC               → /logos/gmc.jpg
18. Genesis           → /logos/genesis.jpg
19. Honda             → /logos/honda.jpg
20. Hummer            → /logos/hummer.jpg
21. Hyundai           → /logos/hyundai.jpg
22. Infiniti          → /logos/infiniti.jpg
23. Isuzu             → /logos/isuzu.jpg
24. Jaguar            → /logos/jaguar.jpg
25. Jeep              → /logos/jeep.jpg
26. Kia               → /logos/kia.jpg
27. Land Rover        → /logos/land-rover.jpg
28. Lexus             → /logos/lexus.jpg
29. Lincoln           → /logos/lincoln.jpg
30. Mazda             → /logos/mazda.jpg
31. Mercedes-Benz     → /logos/mercedes-benz.jpg
32. Mercury           → /logos/mercury.jpg
33. Mini              → /logos/mini.jpg
34. Mitsubishi        → /logos/mitsubishi.jpg
35. Nissan            → /logos/nissan.jpg
36. Oldsmobile        → /logos/oldsmobile.jpg
37. Plymouth          → /logos/plymouth.jpg
38. Pontiac           → /logos/pontiac.jpg
39. Porsche           → /logos/porsche.jpg
40. Ram               → /logos/ram.jpg
41. Saturn            → /logos/saturn.jpg
42. Scion             → /logos/scion.jpg
43. Subaru            → /logos/subaru.jpg
44. Suzuki            → /logos/suzuki.jpg
45. Tesla             → /logos/tesla.jpg
46. Toyota            → /logos/toyota.jpg
47. Volkswagen        → /logos/volkswagen.jpg
48. Volvo             → /logos/volvo.jpg
```

**Brand Logo Properties:**
| Property | Value |
|----------|-------|
| **Format** | JPG |
| **Display Size** | 56x56px |
| **Minimum Source** | 100x100px |
| **Usage** | Brand showcase grid, makes page |
| **Status** | ❌ MISSING - All 45 need generation |
| **Priority** | 🔴 CRITICAL |
| **Fallback** | Brand color gradient + initials |

**Used In:**
- `components/brand-logos.tsx` - getBrandLogoUrl(brand) lookup
- `lib/data.ts` - BRAND_LOGO_URLS mapping
- `app/makes/page.tsx` - Brand grid display

**Error Handling:**
- If image fails to load, component displays brand initials on gradient background
- Brand colors defined in `BRAND_COLORS` object in lib/data.ts
- Graceful degradation implemented ✅

---

## Part 3: Hero & Content Images

### Asset 1: hero-engines.jpg
| Property | Value |
|----------|-------|
| **Path** | `/images/hero-engines.jpg` |
| **Format** | JPG |
| **Recommended Size** | 1920x1080px (16:9 aspect ratio) |
| **Web Size** | 1200x675px optimized |
| **Status** | ❌ MISSING - Needs to be generated |
| **Priority** | 🔴 CRITICAL |

**Used In:**
- `components/home/hero-section.tsx` (line 14) - fill container, 20% opacity overlay

**Requirements:**
- High-quality engine/automotive imagery
- Dark, premium aesthetic
- Works at 20% opacity under overlay
- Responsive scaling on mobile/tablet/desktop

---

### Asset 2: used-engines.jpg
| Property | Value |
|----------|-------|
| **Path** | `/images/used-engines.jpg` |
| **Format** | JPG |
| **Recommended Size** | 1920x1080px (16:9 aspect ratio) |
| **Web Size** | 1200x675px optimized |
| **Status** | ❌ MISSING - Needs to be generated |
| **Priority** | 🔴 CRITICAL |

**Used In:**
- `components/used-engines-content.tsx` (line 27) - Page hero image, full fill

**Requirements:**
- Used/salvaged engine imagery
- Premium presentation
- Clear, high-contrast on dark background
- SEO alt text: "Used engines for sale"

---

### Asset 3: used-transmissions.jpg
| Property | Value |
|----------|-------|
| **Path** | `/images/used-transmissions.jpg` |
| **Format** | JPG |
| **Recommended Size** | 1920x1080px (16:9 aspect ratio) |
| **Web Size** | 1200x675px optimized |
| **Status** | ❌ MISSING - Needs to be generated |
| **Priority** | 🔴 CRITICAL |

**Used In:**
- `components/used-transmissions-content.tsx` (line 25) - Page hero image, full fill

**Requirements:**
- Used/salvaged transmission imagery
- Premium presentation
- Clear, high-contrast on dark background
- SEO alt text: "Used transmissions for sale"

---

## Part 4: Current Issues & Status

### File Path Audit Results

| Asset | Path | Expected | Status | Action |
|-------|------|----------|--------|--------|
| Company Logo | /auapw-logo.jpg | /auapw-logo.jpg | ❌ Missing | Generate |
| Brand Logos (45x) | /logos/*.jpg | /logos/{brand}.jpg | ❌ Missing | Generate |
| Hero Image 1 | /images/hero-engines.jpg | /images/hero-engines.jpg | ❌ Missing | Generate |
| Hero Image 2 | /images/used-engines.jpg | /images/used-engines.jpg | ❌ Missing | Generate |
| Hero Image 3 | /images/used-transmissions.jpg | /images/used-transmissions.jpg | ❌ Missing | Generate |

### Codebase Reference Verification

All image paths in code are **CORRECT** ✅:
- Path patterns: `/logos/{brand}.jpg` and `/images/*.jpg` (absolute from public)
- All image tags use Next.js Image component for optimization
- Priority loading implemented for above-fold images (hero, navbar)
- Lazy loading configured for below-fold images
- Alt text present for all images
- Error handlers exist for fallback rendering

---

## Part 5: Required Actions (Phase 2)

### Step 1: Generate Missing Assets
1. **Company Logo** (`/auapw-logo.jpg`)
   - Create professional automotive brand logo
   - Rounded/circular design
   - Works on dark backgrounds
   - 128x128px minimum

2. **Car Brand Logos** (45 images in `/logos/`)
   - Create professional, recognizable brand logos
   - Consistent style across all 45 brands
   - 100x100px each
   - JPG format

3. **Hero Images** (3 images in `/images/`)
   - Engine showcase image for landing page
   - Used engines detail image
   - Used transmissions detail image
   - 1200x675px each (1920x1080px source)

### Step 2: Verify Public Folder Structure
```
/public
├── /logos/
│   ├── acura.jpg
│   ├── alfa-romeo.jpg
│   ├── ... (45 total)
│   └── volvo.jpg
├── /images/
│   ├── hero-engines.jpg
│   ├── used-engines.jpg
│   └── used-transmissions.jpg
└── auapw-logo.jpg
```

### Step 3: Validate After Generation
- [ ] All files present in `/public` directories
- [ ] No 404 errors in browser console
- [ ] All images display correctly
- [ ] Responsive sizing on mobile/tablet/desktop
- [ ] Fallback gradients work if image fails
- [ ] Performance metrics acceptable (LCP < 3s)

---

## Part 6: Component-by-Component Analysis

### Component 1: navbar.tsx
- **Image**: `/auapw-logo.jpg`
- **Size**: 56x56px
- **Priority**: Yes (above fold)
- **Status**: Path correct, file needed

### Component 2: footer.tsx
- **Image**: `/auapw-logo.jpg`
- **Size**: 46x46px
- **Status**: Path correct, file needed

### Component 3: hero-section.tsx
- **Images**: `/auapw-logo.jpg`, `/images/hero-engines.jpg`
- **Sizes**: 80x80px logo, full-width hero
- **Status**: Paths correct, files needed

### Component 4: brand-logos.tsx
- **Images**: 45 brand logos from `/logos/`
- **Fallback**: Brand color gradient + initials (if image fails)
- **Status**: All 45 brand files needed

### Component 5: used-engines-content.tsx
- **Image**: `/images/used-engines.jpg`
- **Status**: Path correct, file needed

### Component 6: used-transmissions-content.tsx
- **Image**: `/images/used-transmissions.jpg`
- **Status**: Path correct, file needed

---

## Part 7: Recommendations

### Optimization
1. ✅ All Next.js Image components properly configured
2. ✅ Priority props set for above-fold images
3. ✅ Lazy loading for below-fold assets
4. ⏳ Consider WebP format alternatives for modern browsers
5. ⏳ Implement image compression for hero images

### SEO
1. ✅ All images have descriptive alt text
2. ✅ Alt texts are SEO-friendly
3. ✅ Images properly sized for responsive design

### Performance
1. Hero images should be < 200KB compressed
2. Brand logos should be < 50KB each
3. Company logo should be < 30KB
4. Implement cache headers for static assets

---

## Conclusion

All image asset references in code are correctly configured. The only missing component is the actual image files themselves. Phase 2 will generate all 49 missing image assets and place them in the proper `/public` directory structure.

**Next Step**: Generate all missing image files per specifications above.
