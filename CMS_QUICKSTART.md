# CMS & Team Portals - Quick Start Guide

## Accessing the CMS

1. **Login to Admin**
   - Go to: `http://localhost:3000/admin/login`
   - Default Email: `admin@auapw.com`
   - Default Password: `AUAPWAdmin123!`
   - Change these in production via environment variables

2. **Navigate to CMS Dashboard**
   - After login, go to: `http://localhost:3000/admin/cms`
   - See three main portals

---

## Three Main Portals

### 1. Content Manager (Admin Portal)
**URL**: `/admin/cms/pages`

**What You Can Do**:
- ✅ Create and edit website pages
- ✅ Write blog posts
- ✅ Create FAQs and policies
- ✅ Optimize for SEO
- ✅ Save page versions automatically
- ✅ Filter by status (draft, published, archived)

**Quick Action**: Create a page
1. Click "New Page" button
2. Fill in:
   - Slug: `about-us` (URL-friendly)
   - Title: `About Our Company`
   - Content: Your page content
   - Type: Choose page type
3. Click Create
4. Edit and publish when ready

---

### 2. Sales Team Portal
**URL**: `/admin/cms/sales`

**What You Can Do**:
- 📊 Create marketing campaigns
- 📊 Manage product promotions
- 📊 Set pricing information
- 📊 Add customer testimonials
- 📊 Schedule campaigns (start/end dates)
- 📊 Target specific audiences

**Campaign Types**:
- Product Features
- Promotions & Discounts
- Pricing Information
- Customer Testimonials

**Quick Action**: Launch a campaign
1. Click "New Campaign" button
2. Fill in:
   - Title: `Summer Sale 2024`
   - Type: Promotion
   - Content: Campaign details
   - Target Audience: Retail/Wholesale/Business
   - Start Date: When campaign begins
   - End Date: When campaign ends
3. Click Create and publish

---

### 3. Support Team Portal
**URL**: `/admin/cms/support`

**What You Can Do**:
- 💬 Write FAQs
- 💬 Create support guides
- 💬 Publish policies
- 💬 Add troubleshooting articles
- 💬 Organize by topic
- 💬 Link related articles

**Article Categories**:
- Shipping & Delivery
- Returns & Exchanges
- Payments & Billing
- Account Management
- Technical Support

**Quick Action**: Write an FAQ
1. Click "New Article" button
2. Fill in:
   - Title: `How long does shipping take?`
   - Type: FAQ
   - Category: Shipping & Delivery
   - Content: Your answer
3. Click Create
4. Articles publish automatically by default

---

## Key Features

### 📝 Auto-Versioning
Every time you edit a page/article:
- Previous version is automatically saved
- You can see who changed what and when
- Easy to revert to older versions if needed

### 🔍 SEO Optimization
For web pages, fill in:
- **SEO Title**: What shows in search results
- **SEO Description**: Preview text
- **Meta Keywords**: Search terms

### 🏷️ Smart Organization
- **Categories**: Keep content organized
- **Tags**: Easy filtering
- **Status**: Draft → Publish → Archive workflow
- **Search**: Find content quickly

### 📊 Statistics Dashboard
See at a glance:
- Total number of pages/articles
- Active campaigns
- Draft content waiting to publish
- Recent changes

---

## Common Workflows

### Publishing a Page
1. Go to Content Manager
2. Find your page
3. Click Edit
4. Make changes
5. Set status to "Published"
6. Save
7. ✅ Page is live!

### Creating a Campaign
1. Go to Sales Team Portal
2. Click "New Campaign"
3. Set dates and content
4. Assign target audience
5. Click Publish
6. ✅ Campaign is running!

### Managing FAQs
1. Go to Support Team Portal
2. Click "New Article"
3. Write your FAQ
4. Categorize it
5. Click Create
6. ✅ Help article is live!

---

## Team Roles & Access

The system supports different permission levels:

- **Owner**: Full control, can manage everything
- **Manager**: Can create, edit, and approve content
- **Editor**: Can create and edit (requires approval)
- **Viewer**: Can only read/view

Each team member has a role assigned to them.

---

## Database Tables

The CMS uses these main tables:

```
content_pages        → Website pages and blog posts
content_revisions    → Version history
sales_content        → Marketing campaigns
support_content      → Help articles and FAQs
team_roles          → User permissions
portal_activity_log → Audit trail of changes
```

---

## API Endpoints (for developers)

### Get All Pages
```bash
GET /api/admin/cms/pages?status=published
```

### Create a Page
```bash
POST /api/admin/cms/pages
{
  "slug": "my-page",
  "title": "My Page",
  "content": "Page content here",
  "contentType": "page",
  "status": "draft"
}
```

### Get Sales Content
```bash
GET /api/admin/cms/sales?status=published
```

### Get Support Articles
```bash
GET /api/admin/cms/support?category=shipping
```

### Assign Team Role
```bash
POST /api/admin/cms/team-roles
{
  "userId": "user_123",
  "teamType": "sales",
  "role": "editor"
}
```

---

## Tips & Best Practices

✅ **DO**:
- Use descriptive slugs (e.g., `shipping-policies` not `page1`)
- Write good SEO descriptions
- Keep articles under 2000 words
- Use clear, organized categories
- Save drafts frequently
- Add change descriptions when editing
- Check status before publishing

❌ **DON'T**:
- Use special characters in slugs
- Leave SEO fields empty
- Create duplicate content
- Forget to publish drafts
- Mix unrelated content in one article
- Delete content (archive instead)

---

## Troubleshooting

### "Unauthorized" Error
→ Your admin session expired. Log in again.

### Can't Find My Page
→ Check if it's in "draft" status. Drafts don't appear to visitors.

### Changes Not Saving
→ Check your internet connection and try again.

### Page Not Showing on Website
→ Make sure status is "Published", not "Draft"

---

## Environment Variables (Production)

```bash
# Change these for production:
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD=SecurePassword123!
BETTER_AUTH_SECRET=your-secret-key
```

---

## Next Steps

1. ✅ Log in to `/admin/login`
2. ✅ Go to `/admin/cms`
3. ✅ Choose a portal
4. ✅ Create your first piece of content
5. ✅ Publish it
6. ✅ See it on your website!

---

## Support

For more details, see:
- Full documentation: [CMS_SYSTEM.md](./CMS_SYSTEM.md)
- API endpoints: [CMS_SYSTEM.md#api-endpoints](./CMS_SYSTEM.md#api-endpoints)
- Database schema: [CMS_SYSTEM.md#database-schema](./CMS_SYSTEM.md#database-schema)
