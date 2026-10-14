# User Profile & Dashboard System

Complete customer account management system with order tracking, search history, and product comparisons.

## Features

### 1. **Dashboard Overview** (`/dashboard`)
- Welcome message with quick stats
- Navigation to all customer features
- Quick account overview

### 2. **Profile Management** (`/dashboard/profile`)
- View and edit name, email, phone
- Manage billing and shipping address
- Member since date tracking
- Profile update API with authentication

### 3. **Order Tracking** (`/dashboard/orders`)
- View all customer orders with status
- Filter by order status (all, pending, processing, shipped, delivered)
- Order details including items count, total amount, date
- Status badges (Pending, Processing, Shipped, Delivered, Cancelled)
- Download invoices for delivered orders
- View order details

### 4. **Search History** (`/dashboard/search-history`)
- Automatic logging of all searches
- Category and results count tracking
- Organized by date (Today, Earlier)
- Quick re-search from history
- Delete individual searches
- Clear all search history
- Pagination support

### 5. **Saved Comparisons** (`/dashboard/comparisons`)
- Save product comparisons with custom names
- Add descriptions to comparisons
- Track products compared
- View comparison details
- Delete saved comparisons
- Metadata storage for comparison specs/filters

## Database Schema

### New Tables

```sql
-- Search History
CREATE TABLE search_history (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  query TEXT NOT NULL,
  category TEXT,
  resultsCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Comparison History
CREATE TABLE comparison_history (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  productId TEXT NOT NULL,
  productName TEXT NOT NULL,
  comparisonGroupId TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Saved Comparisons
CREATE TABLE saved_comparisons (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  productIds JSONB DEFAULT '[]',
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Extended User Table
```sql
ALTER TABLE "user" ADD COLUMN phone TEXT;
ALTER TABLE "user" ADD COLUMN address TEXT;
ALTER TABLE "user" ADD COLUMN city TEXT;
ALTER TABLE "user" ADD COLUMN state TEXT;
ALTER TABLE "user" ADD COLUMN zip TEXT;
```

## API Routes

### Profile API
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Orders API
- `GET /api/orders` - Get all customer orders

### Search History API
- `GET /api/search-history` - Get search history
- `POST /api/search-history` - Log a new search
- `DELETE /api/search-history` - Clear all searches
- `DELETE /api/search-history/[id]` - Delete specific search

### Comparisons API
- `GET /api/comparisons` - Get saved comparisons
- `POST /api/comparisons` - Save new comparison
- `DELETE /api/comparisons/[id]` - Delete comparison

## Authentication

All dashboard features require Better Auth authentication:
- User session validation on every request
- Server-side auth checks with Better Auth
- Client-side session management with `useSession` hook
- Automatic redirect to login for unauthenticated users

## Navigation

Dashboard sidebar includes:
- **Profile** - Edit account information
- **Orders** - View order history and status
- **Search History** - View and re-search
- **Comparisons** - Manage saved product comparisons
- **Logout** - Sign out

## Integration with Checkout

The checkout system automatically:
1. Logs search queries to `searchHistory` table
2. Tracks product comparisons
3. Associates orders with logged-in user
4. Stores VIN and vehicle details for future reference

## Usage Examples

### Logging a Search
```typescript
// Called during product search
const res = await fetch('/api/search-history', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Honda Civic Engine',
    category: 'engines',
    resultsCount: 45,
  }),
})
```

### Saving a Comparison
```typescript
// Save current product comparison
const res = await fetch('/api/comparisons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Engine Comparison for My Civic',
    description: 'Comparing 3 engine options',
    productIds: ['prod_1', 'prod_2', 'prod_3'],
  }),
})
```

## Security

- All routes scoped to authenticated user
- User ID always included in queries
- Row-level security via SQL `WHERE userId = session.user.id`
- No cross-user data access possible
- Session validation on every API call

## Mobile Responsive

- Sidebar collapses to hamburger on mobile
- Backdrop overlay for mobile menu
- Responsive grid layouts
- Touch-friendly button sizes
- Mobile-optimized tables and lists
