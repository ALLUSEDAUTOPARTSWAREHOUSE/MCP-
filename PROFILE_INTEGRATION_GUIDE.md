# Integration Guide: Connecting Profile System to Existing Features

## Overview
This guide explains how to connect the new user profile system with existing search, checkout, and product pages.

## 🔗 Integration Points

### 1. Auto-Log Searches
When users search for parts, automatically log to their profile.

**Location:** Search component or API route
**Implementation:**

```typescript
// In your search component or search API
async function handleSearch(query: string, category: string) {
  const results = await searchProducts(query, category)
  
  // Log to user's search history if authenticated
  try {
    await fetch('/api/search-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        category,
        resultsCount: results.length,
      }),
    })
  } catch (error) {
    console.error('Failed to log search:', error)
    // Don't block search if logging fails
  }
  
  return results
}
```

### 2. Save Current Comparison
Let customers save product comparisons from the comparison page.

**Location:** Product comparison component
**Implementation:**

```typescript
// In your comparison component
async function saveComparison() {
  const comparisonName = prompt('Name this comparison:')
  if (!comparisonName) return

  try {
    const res = await fetch('/api/comparisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: comparisonName,
        description: 'Saved from product comparison',
        productIds: selectedProductIds, // Array of product IDs
        metadata: {
          specs: currentSpecsFilters,
          sortBy: currentSortOption,
        },
      }),
    })

    if (res.ok) {
      showSuccessMessage('Comparison saved to your dashboard!')
    }
  } catch (error) {
    console.error('Failed to save comparison:', error)
  }
}
```

### 3. Profile Creation Prompt in Checkout
Encourage guests to create a profile for better order tracking.

**Location:** `/app/checkout/page.tsx` or review step
**Implementation:**

```typescript
// In checkout review component (before payment)
export function CheckoutReview() {
  const { data: session } = useSession()

  return (
    <div>
      {!session?.user && (
        <div className="p-4 mb-6 border border-blue-500/30 rounded-lg bg-blue-500/5">
          <h3 className="font-semibold mb-2">Create a Profile</h3>
          <p className="text-sm text-foreground/60 mb-3">
            Create an account to track your order, save searches, and compare products.
          </p>
          <div className="flex gap-2">
            <Link href="/auth/signup" className="text-blue-400 hover:underline">
              Sign Up Now
            </Link>
            <span className="text-foreground/40">•</span>
            <Link href="/auth/signin" className="text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Rest of checkout review */}
    </div>
  )
}
```

### 4. Link Dashboard from Navigation
Add dashboard link to main navbar/menu.

**Location:** Navbar component
**Implementation:**

```typescript
// In your navbar component
export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav>
      {/* Existing nav items */}
      
      {session?.user && (
        <Link href="/dashboard" className="nav-link">
          My Dashboard
        </Link>
      )}

      {!session?.user && (
        <Link href="/auth/signin" className="nav-link">
          Sign In
        </Link>
      )}
    </nav>
  )
}
```

### 5. Link Dashboard from Account Menu
Add profile/dashboard link to user account menu if it exists.

**Location:** Account dropdown menu
**Implementation:**

```typescript
// In account dropdown
{session?.user && (
  <>
    <Link href="/dashboard/profile">
      My Profile
    </Link>
    <Link href="/dashboard/orders">
      My Orders
    </Link>
    <Link href="/dashboard/search-history">
      Search History
    </Link>
    <Link href="/dashboard/comparisons">
      Saved Comparisons
    </Link>
    <hr />
  </>
)}
```

## 📊 Data Flow

```
Search Part
    ↓
Log to search_history table
    ↓
User sees in /dashboard/search-history
    ↓
Can re-search from history

Compare Products
    ↓
Save to saved_comparisons table
    ↓
User sees in /dashboard/comparisons
    ↓
Can view/delete later

Place Order
    ↓
Associate with userId
    ↓
User sees in /dashboard/orders
    ↓
Can track status & download invoice
```

## 🔐 Authentication Flow

```
Unauthenticated User
    ↓
Browse/Search (searches NOT logged)
    ↓
At checkout: Prompt to create profile
    ↓
Signs up / Signs in
    ↓
Auth session created
    ↓
Future searches ARE logged
    ↓
Orders associated with profile
    ↓
Can access /dashboard
```

## 📱 Mobile Integration

Ensure mobile users can:
- See profile link in mobile menu
- Tap hamburger → My Account → Dashboard
- Access all dashboard features responsively
- Save comparisons from mobile
- View orders on mobile

## 🧪 Testing Checklist

- [ ] Search logging works for authenticated users
- [ ] Search NOT logged for unauthenticated users
- [ ] Comparison save button appears on comparison page
- [ ] Saved comparisons appear in dashboard
- [ ] Orders display correctly after purchase
- [ ] Profile edit saves changes
- [ ] Search history shows proper dates and counts
- [ ] Mobile responsive on all breakpoints
- [ ] Logout clears session properly
- [ ] Can't access others' data via URL manipulation

## 🚀 Implementation Priority

1. **High Priority:**
   - Search logging integration
   - Navbar dashboard link
   - Order display (already works if orders exist)

2. **Medium Priority:**
   - Comparison save feature
   - Checkout profile prompt
   - Mobile menu link

3. **Low Priority:**
   - Analytics on search patterns
   - Recommendation system
   - Advanced filtering

## ⚠️ Common Pitfalls

**Don't:**
- Log searches for unauthenticated users (wastes storage)
- Save comparisons without user confirmation
- Show sensitive data in URLs
- Make search logging block the search action
- Forget to handle API errors gracefully

**Do:**
- Always validate user session
- Show success/error messages
- Keep API calls in background
- Handle network failures gracefully
- Test with and without authentication

## 📞 Support

For questions about integration:
1. Check `USER_PROFILE_SYSTEM.md` for feature details
2. Review API route implementations
3. Test in browser DevTools (Network tab)
4. Check console for error messages

## 🎯 Next Steps

1. Integrate search logging in your search component
2. Add dashboard link to navbar
3. Test end-to-end flow:
   - User searches → logs to history
   - User saves comparison → shows in dashboard
   - User checks orders → sees recent purchases
4. Deploy and monitor usage

---

**Integration Status:** Ready to implement
