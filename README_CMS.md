# Content Management System (CMS) & Team Portals

A comprehensive, multi-team content management system for managing website pages, marketing campaigns, and support articles through dedicated admin portals.

## 🎯 Features

- **Three Separate Portals**: Content Manager, Sales Team, Support Team
- **Role-Based Access**: Owner, Manager, Editor, Viewer roles
- **Auto-Versioning**: Every change is tracked with revision history
- **SEO Optimization**: Built-in SEO fields for better search visibility
- **Activity Logging**: Complete audit trail of all changes
- **Soft Deletes**: Archive content instead of permanently deleting
- **Status Workflow**: Draft → Publish → Archive workflow
- **Team Organization**: Organize content by categories and types
- **Fast & Secure**: Built on Next.js 16, Neon PostgreSQL, and Drizzle ORM

---

## 🚀 Quick Start

### 1. Access the CMS
```
Admin Dashboard: http://localhost:3000/admin/cms
Login: admin@auapw.com / AUAPWAdmin123!
```

### 2. Choose Your Portal

#### Content Manager
- **URL**: `/admin/cms/pages`
- **Manage**: Website pages, blog posts, FAQs, policies
- **Features**: SEO optimization, version history, rich text editor

#### Sales Team
- **URL**: `/admin/cms/sales`
- **Manage**: Marketing campaigns, product features, promotions
- **Features**: Schedule campaigns, target audiences, campaign tracking

#### Support Team
- **URL**: `/admin/cms/support`
- **Manage**: Help articles, FAQs, troubleshooting guides, policies
- **Features**: Categorized articles, priority sorting, related links

### 3. Create Your First Content
1. Click "New [Page/Campaign/Article]"
2. Fill in the required fields
3. Click Create
4. Edit and publish when ready
5. ✅ It's live!

---

## 📁 Architecture

### Database Tables

```
team_roles              → User role assignments per team
content_pages           → Website pages and content
content_revisions       → Version history for pages
sales_content          → Marketing campaigns and content
support_content        → Help articles and support content
portal_activity_log    → Audit trail of all changes
```

### API Routes

```
/api/admin/cms/pages              → Page management (CRUD)
/api/admin/cms/pages/[id]         → Single page operations
/api/admin/cms/sales              → Sales content management
/api/admin/cms/support            → Support content management
/api/admin/cms/team-roles         → Role assignments
```

### Pages & Components

```
/admin/cms                        → Main CMS dashboard
/admin/cms/pages                  → Content Manager portal
/admin/cms/sales                  → Sales Team portal
/admin/cms/support                → Support Team portal
components/admin/portal-switcher  → Portal navigation switcher
```

---

## 📚 Documentation

- **[CMS_SYSTEM.md](./CMS_SYSTEM.md)** - Complete system documentation
- **[CMS_QUICKSTART.md](./CMS_QUICKSTART.md)** - Quick reference guide
- **[CMS_INTEGRATION.md](./CMS_INTEGRATION.md)** - Frontend integration examples

---

## 🔐 Authentication

All CMS endpoints require admin authentication:

```bash
# Default credentials (CHANGE IN PRODUCTION!)
ADMIN_EMAIL=admin@auapw.com
ADMIN_PASSWORD=AUAPWAdmin123!

# Set in production via environment variables
```

Authentication is handled through:
- HMAC-signed session tokens
- HttpOnly cookies
- 8-hour session timeout

---

## 🎨 Portals Overview

### Content Manager Portal
**Admin Portal for general website content**

What you can manage:
- ✅ Website pages
- ✅ Blog posts
- ✅ General FAQs
- ✅ Company policies
- ✅ SEO metadata
- ✅ Page versioning

Perfect for:
- Content managers
- Marketing teams
- Documentation writers

### Sales Team Portal
**Dedicated portal for marketing and sales content**

What you can manage:
- ✅ Marketing campaigns
- ✅ Product features
- ✅ Promotions and discounts
- ✅ Customer testimonials
- ✅ Pricing information
- ✅ Campaign scheduling

Perfect for:
- Sales managers
- Marketing teams
- Product marketers

### Support Team Portal
**Help desk and customer support content**

What you can manage:
- ✅ Frequently asked questions
- ✅ Support guides
- ✅ Company policies
- ✅ Troubleshooting articles
- ✅ Contact information
- ✅ Service status pages

Perfect for:
- Support team leads
- Customer success managers
- Help desk staff

---

## 💾 Content Organization

### Status Workflow
```
Draft → Published → Archived
```

- **Draft**: Not visible to visitors, work in progress
- **Published**: Live on website, visible to all
- **Archived**: Hidden from website, kept in database for history

### Content Types

#### Pages
- General web pages
- Blog posts
- FAQs
- Policies
- Guides

#### Sales Content
- Product features
- Promotions
- Pricing information
- Testimonials

#### Support Content
- FAQs
- Policies
- Guides
- Troubleshooting articles

---

## 🔄 Version Control

Every time you edit content:
1. Previous version is automatically saved
2. Revision includes:
   - Who made the change
   - What changed
   - When it changed
   - Change description (optional)

Access revision history from the edit view.

---

## 🏆 Best Practices

### DO ✅
- Use descriptive slugs: `about-us`, not `page1`
- Fill in SEO fields for better search visibility
- Write clear change descriptions when editing
- Use proper categories and tags
- Keep content organized
- Review before publishing
- Archive old content instead of deleting

### DON'T ❌
- Use special characters in slugs
- Leave SEO fields empty
- Create duplicate content
- Mix unrelated content
- Forget to publish drafts
- Delete content permanently
- Keep sensitive info in drafts

---

## 🔗 Integration with Frontend

### Display Published Content

```typescript
// In your Next.js page component
import { contentPages } from '@/lib/db/schema'

async function getPage(slug: string) {
  const [page] = await db
    .select()
    .from(contentPages)
    .where(
      eq(contentPages.slug, slug) &&
      eq(contentPages.status, 'published')
    )
  return page
}
```

### Fetch from Frontend

```typescript
// Client-side React component
const [articles, setArticles] = useState([])

useEffect(() => {
  fetch('/api/admin/cms/support?status=published')
    .then(res => res.json())
    .then(data => setArticles(data.content))
}, [])
```

See [CMS_INTEGRATION.md](./CMS_INTEGRATION.md) for detailed examples.

---

## 📊 Activity Tracking

All CMS actions are logged to `portal_activity_log`:

- Who made the change
- What type of resource changed
- What action was performed (create/update/delete/publish)
- When the change occurred
- Specific details of what changed

Use this for:
- Compliance audits
- Debugging issues
- Change tracking
- Performance monitoring

---

## ⚙️ Team Roles

### Role Definitions

| Role | Permissions | Best For |
|------|-------------|----------|
| Owner | Full control | Portal administrators |
| Manager | Create, edit, approve content | Team leads |
| Editor | Create and edit (needs approval) | Content creators |
| Viewer | Read-only access | Stakeholders |

### Assign Roles

```bash
curl -X POST http://localhost:3000/api/admin/cms/team-roles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "teamType": "sales",
    "role": "manager"
  }'
```

---

## 🔧 Environment Variables

```bash
# Admin authentication
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!

# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# Auth secret
BETTER_AUTH_SECRET=your-random-secret-key
```

Change defaults for production!

---

## 📈 Performance Tips

1. **Cache Published Content**: Use React `cache()` for RSCs
2. **Use CDN for Images**: Store image URLs in CMS
3. **Pagination**: Fetch content in batches for large databases
4. **Search Indexing**: Full-text search on frequently queried fields
5. **Scheduled Publishing**: Set dates for automatic publishing

---

## 🐛 Troubleshooting

### "Unauthorized" on CMS Access
→ Admin session expired. Log in again at `/admin/login`

### Can't Find Published Content
→ Check page status is "Published", not "Draft"

### Page Not Showing on Website
→ Verify `status` is "published" AND `teamType` matches permissions

### Changes Not Saving
→ Check database connection and server logs

### Performance Issues
→ Check revision history size; archive old content

---

## 🚢 Deployment

1. Update environment variables in production
2. Run database migrations
3. Deploy to Vercel
4. Test CMS portals at `/admin/cms`
5. Create initial content
6. Monitor activity logs

---

## 📝 Documentation Files

1. **CMS_SYSTEM.md** - Comprehensive technical documentation
2. **CMS_QUICKSTART.md** - Quick reference and common workflows
3. **CMS_INTEGRATION.md** - Frontend integration examples
4. **README_CMS.md** - This file

---

## 🤝 Support

For issues or questions:
1. Check documentation files above
2. Review activity logs for errors
3. Check server console logs
4. Verify environment variables
5. Test database connection

---

## 📜 License

Part of the AUAPW platform. All rights reserved.

---

## 🎉 Next Steps

1. ✅ Log in: `http://localhost:3000/admin/login`
2. ✅ Visit CMS: `http://localhost:3000/admin/cms`
3. ✅ Choose a portal
4. ✅ Create your first content
5. ✅ Publish and see it live!

**Happy content managing!** 🚀
