# CMS & Team Portal System Documentation

## Overview

This system provides a comprehensive Content Management System (CMS) with multiple team portals for managing website content, sales campaigns, and support articles. Each team has their own dedicated portal for managing their specific content types.

## System Architecture

### Database Schema

The CMS system uses the following main tables:

#### Team Management
- **team_roles**: Tracks user roles and permissions for each team
  - `userId`: The user's ID
  - `teamType`: 'admin', 'sales', 'support', 'marketing'
  - `role`: 'owner', 'manager', 'editor', 'viewer'
  - `status`: 'active' or 'inactive'

#### Content Management
- **content_pages**: General website pages, blog posts, FAQs
  - `slug`: URL-friendly identifier (unique)
  - `title`: Page title
  - `content`: Rich text/markdown content
  - `contentType`: 'page', 'blog', 'faq', 'policy'
  - `category`: Content category
  - `teamType`: Which team can edit (admin, sales, support)
  - `status`: 'draft', 'published', 'archived'
  - SEO fields: `seoTitle`, `seoDescription`, `metaKeywords`

- **content_revisions**: Version history for pages
  - Automatically saves revisions when pages are updated
  - Includes change descriptions and who made the change

- **sales_content**: Sales & marketing content
  - `contentType`: 'product_feature', 'promotion', 'pricing_info', 'testimonial'
  - `images`: Array of image URLs
  - `targetAudience`: 'retail', 'wholesale', 'business'
  - `startDate`, `endDate`: Campaign dates

- **support_content**: Help articles and support materials
  - `contentType`: 'faq', 'policy', 'guide', 'troubleshooting'
  - `category`: 'shipping', 'returns', 'payments', 'account', 'technical'
  - `priority`: Sorting order
  - `relatedPages`: Array of related article IDs

#### Activity Logging
- **portal_activity_log**: Audit trail for all portal actions
  - Logs all create, update, delete, and publish actions
  - Includes details about what changed

---

## API Endpoints

### Content Pages
```
GET    /api/admin/cms/pages                    # Get all pages (with filters)
POST   /api/admin/cms/pages                    # Create new page
GET    /api/admin/cms/pages/[id]              # Get single page
PUT    /api/admin/cms/pages/[id]              # Update page
DELETE /api/admin/cms/pages/[id]              # Archive page
```

**Query Parameters for GET**:
- `category`: Filter by category
- `status`: Filter by status (draft, published, archived)
- `contentType`: Filter by type

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/admin/cms/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "getting-started",
    "title": "Getting Started Guide",
    "content": "# Welcome to our guide...",
    "contentType": "guide",
    "category": "general",
    "seoTitle": "Getting Started with Our Service"
  }'
```

### Sales Content
```
GET    /api/admin/cms/sales                   # Get all sales content
POST   /api/admin/cms/sales                   # Create new campaign
```

**Query Parameters for GET**:
- `contentType`: Filter by type
- `status`: Filter by status
- `audience`: Filter by target audience

### Support Content
```
GET    /api/admin/cms/support                 # Get all support articles
POST   /api/admin/cms/support                 # Create new article
```

**Query Parameters for GET**:
- `contentType`: Filter by type
- `category`: Filter by category
- `status`: Filter by status

### Team Roles
```
GET    /api/admin/cms/team-roles              # Get team roles (with filters)
POST   /api/admin/cms/team-roles              # Assign user to team
```

**Query Parameters for GET**:
- `userId`: Filter by user
- `teamType`: Filter by team

---

## Portals

### 1. Admin CMS Dashboard
**URL**: `/admin/cms`

The main hub for content management. From here, you can:
- Access the Content Manager for managing website pages
- View Sales Team portal
- View Support Team portal
- See overview statistics

### 2. Content Manager Portal
**URL**: `/admin/cms/pages`

Manage all website pages and general content:
- Create new pages with SEO optimization
- Edit existing pages with auto-saved revisions
- Manage page status (draft → published → archived)
- Filter by category and status
- Search for pages

**Features**:
- Auto-version control: Each edit creates a revision
- SEO fields for better search engine optimization
- Rich content support

### 3. Sales Team Portal
**URL**: `/admin/cms/sales`

Manage sales and marketing content:
- Create marketing campaigns
- Manage product features and promotions
- Set target audience (retail, wholesale, business)
- Schedule campaigns with start/end dates
- Track active and draft campaigns

**Content Types**:
- Product Features
- Promotions
- Pricing Information
- Testimonials

### 4. Support Team Portal
**URL**: `/admin/cms/support`

Manage customer support content:
- Write and organize FAQs
- Create support guides
- Publish policies and troubleshooting articles
- Categorize by topic (shipping, returns, payments, account, technical)
- Set article priority for sorting

**Content Types**:
- FAQs
- Policies
- Guides
- Troubleshooting Articles

---

## Authentication

All CMS endpoints require admin authentication via the existing admin session system:

```typescript
// Session is checked via cookies (httpOnly)
// Configured in ADMIN_EMAIL and ADMIN_PASSWORD environment variables
```

**Default Credentials** (change in production):
- Email: admin@auapw.com
- Password: AUAPWAdmin123!

Login at: `/admin/login`

---

## Portal Navigation

The system includes a portal switcher component (`PortalSwitcher`) that allows quick navigation between:
- Content Manager (Admin)
- Sales Team Portal
- Support Team Portal

Each portal maintains its own context and data.

---

## Activity Tracking

All actions in the CMS are logged to `portal_activity_log`:

**Tracked Actions**:
- `created`: New content created
- `updated`: Existing content modified
- `deleted`: Content archived
- `published`: Content status changed to published

**Logged Information**:
- Who made the change
- What changed
- When it changed
- Which team/portal was used
- Additional details about the change

---

## Content Versioning

The system automatically maintains revision history:

- Each update to a page creates a new revision
- Revisions include:
  - Previous content
  - Revision number
  - Author
  - Change description
  - Timestamp

This allows reverting to previous versions if needed.

---

## Team Roles

### Role Permissions

- **Owner**: Full control over team portal
- **Manager**: Can create, edit, and approve content
- **Editor**: Can create and edit content (requires approval)
- **Viewer**: Read-only access

### Assigning Roles

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

## Content Organization

### Content Pages (Admin)
- **Categories**: general, shipping, returns, sales, support
- **Types**: page, blog, faq, policy
- **Status**: draft, published, archived

### Sales Content
- **Types**: product_feature, promotion, pricing_info, testimonial
- **Audiences**: retail, wholesale, business
- **Status**: draft, published, archived

### Support Content
- **Categories**: shipping, returns, payments, account, technical
- **Types**: faq, policy, guide, troubleshooting
- **Status**: draft, published, archived

---

## Best Practices

1. **Use Meaningful Slugs**: Create URL-friendly slugs (e.g., `shipping-policies`, `faq-returns`)
2. **Write Good Descriptions**: Add SEO descriptions for search engine visibility
3. **Organize Content**: Use categories to keep content organized
4. **Track Changes**: Always include a change description when updating
5. **Version Control**: Check revision history before making major changes
6. **Status Workflow**: Keep content in draft until ready, then publish
7. **Team Boundaries**: Assign team roles to manage access control

---

## Integration with Frontend

### Fetching Published Content

```typescript
// Example: Fetch published pages
const pages = await fetch('/api/admin/cms/pages?status=published')
const data = await pages.json()
```

### Displaying Dynamic Content

```typescript
// In your page component
async function getPageContent(slug: string) {
  const res = await db
    .select()
    .from(contentPages)
    .where(
      eq(contentPages.slug, slug) && 
      eq(contentPages.status, 'published')
    )
  
  return res[0]
}
```

---

## Security Considerations

1. **Admin Authentication**: All CMS endpoints require valid admin session
2. **HTTPS Only**: Use HTTPS in production
3. **Session Timeout**: Admin sessions expire after 8 hours
4. **Audit Logging**: All actions are logged for compliance
5. **Status Archiving**: Soft delete instead of hard delete for data preservation

---

## Troubleshooting

### Pages Not Showing
- Verify page `status` is 'published'
- Check `teamType` matches access permissions
- Ensure page slug is unique

### Revisions Not Saving
- Verify database write permissions
- Check `content_revisions` table for errors

### Portal Access Issues
- Verify admin session is valid
- Check `/api/admin/auth/session` endpoint
- Ensure credentials are correct

---

## Future Enhancements

- [ ] Bulk content operations
- [ ] Content scheduling with automation
- [ ] Multi-language support
- [ ] Content templates and snippets
- [ ] Advanced SEO analytics
- [ ] Content approval workflow
- [ ] Media library/asset management
- [ ] Content export (PDF, Markdown)
- [ ] API key management for external integrations
- [ ] Advanced search with full-text indexing
