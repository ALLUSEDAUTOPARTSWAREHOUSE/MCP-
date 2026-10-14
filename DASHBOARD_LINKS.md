# Dashboard Links - AUAPW Platform

## Overview
Dashboard links have been added to the main navigation bar for easy access to both admin and customer portals.

---

## Accessing Dashboards

### Method 1: Navbar Dropdown (Recommended)
1. Look for the **grid icon** (⊞) in the top-right corner of the navbar
2. Click the icon to open the "Dashboards" dropdown menu
3. Select your desired dashboard:
   - **Admin Dashboard** → `/admin/login`
   - **Customer Dashboard** → `/customer/dashboard`

### Method 2: Direct URL
- Admin Dashboard: `http://localhost:3000/admin/login` (dev) or `https://yourdomain.com/admin/login` (production)
- Customer Dashboard: `http://localhost:3000/customer/dashboard` (dev) or `https://yourdomain.com/customer/dashboard` (production)

---

## Admin Dashboard

**URL:** `/admin/login`

**Access:** Click Dashboards dropdown → Admin Dashboard

**Features:**
- Secure email + password authentication
- Real-time KPI monitoring (updates every 30 seconds)
- Live metrics from database:
  - Daily Revenue
  - Total Orders
  - Average Order Value
  - Approval Rate
  - Fraud Rate
  - Chargeback Rate
  - Refund Rate
  - Customer Satisfaction
  - Response Time
  - Shipping Time
  - Inventory Turnover
- Seller approval workflows
- One-click logout

**Login:** Use your `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables

---

## Customer Dashboard

**URL:** `/customer/dashboard`

**Access:** Click Dashboards dropdown → Customer Dashboard

**Features (Coming Soon):**
- View order history
- Track order status
- Manage account settings
- View warranty information
- Access saved vehicles
- Manage wishlist
- Download invoices

---

## Navbar Component Changes

**File Modified:** `components/navbar.tsx`

**Changes:**
1. Added `LayoutDashboard` icon import from lucide-react
2. Added "Dashboards" dropdown menu in the right section of navbar
3. Dropdown includes links to both Admin and Customer dashboards
4. Styled to match existing navbar aesthetic with glassmorphic design

**Desktop View:** Dashboard icon appears in the top-right navbar, between cart/theme toggle and "Free Quote" button

**Mobile View:** Dashboard dropdown available through main mobile menu

---

## Technical Details

### Dashboard Icon Button
- **Position:** Fixed in navbar right section
- **Icon:** LayoutDashboard (grid/dashboard icon)
- **Title:** "Dashboards" (hover tooltip)
- **Responsive:** Hidden on mobile, visible on desktop

### Dropdown Menu
- **Label:** "DASHBOARDS"
- **Items:**
  1. Admin Dashboard → `/admin/login`
  2. Customer Dashboard → `/customer/dashboard`
- **Styling:** Glassmorphic design with backdrop blur

---

## Implementation Details

### Files Updated
- `components/navbar.tsx` - Added dashboard dropdown

### Imports Added
```typescript
import { LayoutDashboard } from "lucide-react"
```

### Component Added
```tsx
<DropdownMenu>
  <DropdownMenuTrigger className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors outline-none" title="Dashboards">
    <LayoutDashboard className="w-5 h-5 text-foreground" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50">
    <DropdownMenuLabel className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
      Dashboards
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link href="/admin/login" className="flex items-center gap-2 cursor-pointer text-sm">
        Admin Dashboard
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/customer/dashboard" className="flex items-center gap-2 cursor-pointer text-sm">
        Customer Dashboard
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Quick Links

- **Admin Portal Docs:** See `ADMIN_PORTAL.md`
- **Admin Setup Guide:** See `ADMIN_SETUP.txt`
- **GitHub:** Push changes to deploy

---

**Status:** ✅ Complete and tested  
**Build Status:** ✅ Compiles successfully  
**Last Updated:** January 2024
