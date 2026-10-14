# User Profile System - Quick Reference

## 📍 Key URLs

| Feature | URL | Purpose |
|---------|-----|---------|
| Dashboard | `/dashboard` | Home view with quick stats |
| Profile | `/dashboard/profile` | Edit account info |
| Orders | `/dashboard/orders` | View order history |
| Search History | `/dashboard/search-history` | View & re-search |
| Comparisons | `/dashboard/comparisons` | Save & manage comparisons |

## 🔌 API Endpoints

### Profile
```
GET  /api/profile
PUT  /api/profile
```

### Orders
```
GET  /api/orders
```

### Search History
```
GET    /api/search-history
POST   /api/search-history
DELETE /api/search-history
DELETE /api/search-history/[id]
```

### Comparisons
```
GET    /api/comparisons
POST   /api/comparisons
DELETE /api/comparisons/[id]
```

## 📝 Example API Calls

### Log a Search
```bash
curl -X POST http://localhost:3000/api/search-history \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Honda Engine",
    "category": "engines",
    "resultsCount": 24
  }'
```

### Save a Comparison
```bash
curl -X POST http://localhost:3000/api/comparisons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engine Comparison",
    "description": "Top 3 engines for my civic",
    "productIds": ["prod_001", "prod_002", "prod_003"]
  }'
```

### Get User Profile
```bash
curl http://localhost:3000/api/profile
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "(555) 123-4567",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  }'
```

## 🗄️ Database Tables

### `search_history`
```sql
id (TEXT, PK)
userId (TEXT)
query (TEXT)
category (TEXT)
resultsCount (INTEGER)
createdAt (TIMESTAMP)
```

### `saved_comparisons`
```sql
id (TEXT, PK)
userId (TEXT)
name (TEXT)
description (TEXT)
productIds (JSONB)
metadata (JSONB)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

### `user` (extended)
```sql
phone (TEXT)
address (TEXT)
city (TEXT)
state (TEXT)
zip (TEXT)
```

## 🎯 Key Features at a Glance

| Feature | Pages | Auto-Log? | Search? | Delete? |
|---------|-------|-----------|---------|---------|
| Search History | 1 | ✅ Yes | ✅ Re-search | ✅ Yes |
| Comparisons | 1 | ❌ Manual | ❌ No | ✅ Yes |
| Orders | 1 | ✅ Auto | ✅ Filter | ❌ No |
| Profile | 1 | ❌ Manual | ❌ No | ❌ No |

## 🔐 Security

✅ All authenticated
✅ User-scoped queries
✅ Session validation
✅ No cross-user access
✅ Server-side filtering

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Single column, hamburger menu
- **Tablet** (768px - 1024px): 2 columns, sidebar
- **Desktop** (> 1024px): 4 columns, full sidebar

## ⚙️ Configuration

### Search History Limit
```typescript
// Max results returned
limit: 100
```

### Comparison Metadata
```typescript
// Optional metadata stored
metadata: {
  specs: [],
  filters: {},
  sortBy: 'price'
}
```

## 🚀 Quick Start Integration

### 1. Log Searches
```typescript
await fetch('/api/search-history', {
  method: 'POST',
  body: JSON.stringify({ query, category, resultsCount })
})
```

### 2. Add Nav Link
```tsx
<Link href="/dashboard">Dashboard</Link>
```

### 3. Save Comparison
```typescript
await fetch('/api/comparisons', {
  method: 'POST',
  body: JSON.stringify({ name, productIds })
})
```

## 🧪 Testing

### View Search History
1. Search for "engine"
2. Go to `/dashboard/search-history`
3. Should see search logged with timestamp

### View Orders
1. Create test order
2. Go to `/dashboard/orders`
3. Should see order with status badge

### Edit Profile
1. Go to `/dashboard/profile`
2. Click "Edit Profile"
3. Update fields
4. Click "Save Changes"
5. Verify data persists on refresh

### Save Comparison
1. Navigate to comparison feature
2. Click "Save Comparison"
3. Enter name and product IDs
4. Go to `/dashboard/comparisons`
5. Should see saved comparison

## 📊 Performance Tips

- Search history limited to 100 items (pagination ready)
- Use indexes on userId for fast queries
- Consider caching frequently accessed profiles
- Archive old searches monthly

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check session is valid |
| Data not saving | Check network tab for errors |
| Mobile menu stuck | Check viewport > 768px |
| Search not logging | Check if user authenticated |
| Comparison not saving | Verify product IDs exist |

## 📚 Full Documentation

- `USER_PROFILE_SYSTEM.md` - Detailed features
- `PROFILE_SYSTEM_IMPLEMENTATION.md` - Implementation details
- `PROFILE_INTEGRATION_GUIDE.md` - Integration instructions

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
