# CMS Integration Guide

How to integrate the CMS system into your website frontend.

---

## Overview

The CMS provides content through APIs that your frontend can consume. All published content is available through REST endpoints.

---

## Basic Setup

### 1. Create Content Pages

First, create your content through the Admin CMS:
- Go to `/admin/cms/pages`
- Create pages with meaningful slugs
- Mark them as "Published"

### 2. Fetch Content in Your Frontend

Your frontend can now display this content dynamically.

---

## Implementation Examples

### Example 1: Display a Static Page

```typescript
// app/about/page.tsx

import { db } from '@/lib/db'
import { contentPages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function getAboutPage() {
  const [page] = await db
    .select()
    .from(contentPages)
    .where(
      eq(contentPages.slug, 'about-us') &&
      eq(contentPages.status, 'published')
    )
  
  return page
}

export default async function AboutPage() {
  const page = await getAboutPage()

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      <div 
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  )
}
```

### Example 2: Display All Blog Posts

```typescript
// app/blog/page.tsx

import { db } from '@/lib/db'
import { contentPages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

async function getBlogPosts() {
  return db
    .select()
    .from(contentPages)
    .where(
      eq(contentPages.contentType, 'blog') &&
      eq(contentPages.status, 'published')
    )
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 mt-2">
              {post.description}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
```

### Example 3: Display FAQs by Category

```typescript
// app/support/faqs/page.tsx

import { db } from '@/lib/db'
import { supportContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

async function getFAQsByCategory(category: string) {
  return db
    .select()
    .from(supportContent)
    .where(
      eq(supportContent.contentType, 'faq') &&
      eq(supportContent.category, category) &&
      eq(supportContent.status, 'published')
    )
}

export default async function FAQPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category || 'shipping'
  const faqs = await getFAQsByCategory(category)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="border rounded-lg p-4 cursor-pointer"
          >
            <summary className="font-bold text-lg">
              {faq.title}
            </summary>
            <div 
              className="mt-4 text-gray-700"
              dangerouslySetInnerHTML={{ __html: faq.content }}
            />
          </details>
        ))}
      </div>
    </div>
  )
}
```

### Example 4: Display Marketing Content

```typescript
// components/SalesSection.tsx

'use client'

import { useEffect, useState } from 'react'

interface SalesContent {
  id: string
  title: string
  content: string
  images: string[]
  targetAudience: string
}

export function SalesSection({ audience = 'retail' }) {
  const [content, setContent] = useState<SalesContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(
          `/api/admin/cms/sales?status=published&audience=${audience}`
        )
        const data = await res.json()
        setContent(data.content || [])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [audience])

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {content.map((item) => (
        <div key={item.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">{item.title}</h3>
          
          {item.images && item.images.length > 0 && (
            <img 
              src={item.images[0]} 
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <p className="text-gray-700">{item.content}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 5: Dynamic Policies Page

```typescript
// app/policies/[slug]/page.tsx

import { db } from '@/lib/db'
import { contentPages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

async function getPolicyPage(slug: string) {
  const [page] = await db
    .select()
    .from(contentPages)
    .where(
      and(
        eq(contentPages.slug, slug),
        eq(contentPages.contentType, 'policy'),
        eq(contentPages.status, 'published')
      )
    )

  return page
}

export default async function PolicyPage({
  params,
}: {
  params: { slug: string }
}) {
  const policy = await getPolicyPage(params.slug)

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Policy Not Found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">{policy.title}</h1>
      
      {policy.seoDescription && (
        <p className="text-gray-600 text-lg mb-6">
          {policy.seoDescription}
        </p>
      )}

      <article className="prose prose-lg max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </article>

      <div className="mt-8 pt-8 border-t text-gray-500 text-sm">
        Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
      </div>
    </div>
  )
}
```

---

## Best Practices

### 1. Cache Published Content

```typescript
// Use React cache for better performance
import { cache } from 'react'

export const getPublishedPage = cache(async (slug: string) => {
  const [page] = await db
    .select()
    .from(contentPages)
    .where(
      eq(contentPages.slug, slug) &&
      eq(contentPages.status, 'published')
    )
  
  return page
})
```

### 2. Validate Content on the Frontend

```typescript
// Always validate content structure
function validateContent(content: any) {
  return {
    ...content,
    // Sanitize HTML if needed
    content: content.content || '',
    title: content.title || 'Untitled',
    status: content.status || 'draft'
  }
}
```

### 3. Handle Images Properly

```typescript
// Store images as paths or URLs in the CMS
// Display them safely in your frontend

<img 
  src={page.featuredImage}
  alt={page.title}
  loading="lazy"
  className="w-full h-auto"
/>
```

### 4. Generate Sitemap from CMS

```typescript
// Generate dynamic sitemap from published pages
export async function generateStaticParams() {
  const pages = await db
    .select()
    .from(contentPages)
    .where(eq(contentPages.status, 'published'))

  return pages.map((page) => ({
    slug: page.slug,
  }))
}
```

### 5. SEO Optimization

```typescript
// Use CMS SEO fields for metadata
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPage(params.slug)

  return {
    title: page?.seoTitle || page?.title,
    description: page?.seoDescription,
    keywords: page?.metaKeywords,
    openGraph: {
      title: page?.seoTitle,
      description: page?.seoDescription,
      images: page?.featuredImage ? [page.featuredImage] : [],
    },
  }
}
```

---

## Real-World Scenarios

### Scenario 1: Update Shipping Policy

1. Go to `/admin/cms/pages` (or use API)
2. Find "shipping-policy" page
3. Edit content
4. Save (creates revision)
5. Publish
6. ✅ Website automatically shows new policy

### Scenario 2: Launch Marketing Campaign

1. Go to `/admin/cms/sales`
2. Create campaign titled "Summer Sale 2024"
3. Set target audience: "retail"
4. Set start/end dates
5. Publish
6. ✅ Homepage displays campaign via `<SalesSection audience="retail" />`

### Scenario 3: Add New FAQ

1. Go to `/admin/cms/support`
2. Create FAQ about returns
3. Category: "returns"
4. Publish
5. ✅ FAQs page shows new question automatically

---

## Revalidation & Caching

### On-Demand Revalidation

If using Next.js App Router with ISR (Incremental Static Regeneration):

```typescript
// Revalidate when content changes
import { revalidatePath } from 'next/cache'

// After updating content:
revalidatePath('/about')
revalidatePath('/blog')
revalidatePath('/support/faqs')
```

### Real-Time Updates

For real-time content updates without rebuilding:

```typescript
// Use dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Page() {
  // This always fetches fresh data
  const content = await getLatestContent()
  return <div>{content}</div>
}
```

---

## API Response Examples

### Get Published Page

```bash
GET /api/admin/cms/pages?status=published&contentType=page

Response:
{
  "pages": [
    {
      "id": "page_123",
      "slug": "about-us",
      "title": "About Us",
      "content": "<h1>Welcome...</h1>",
      "contentType": "page",
      "status": "published",
      "seoTitle": "About Our Company",
      "seoDescription": "Learn about our mission...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    }
  ]
}
```

### Get Blog Posts

```bash
GET /api/admin/cms/pages?status=published&contentType=blog

Response:
{
  "pages": [
    {
      "id": "page_456",
      "slug": "getting-started-guide",
      "title": "Getting Started Guide",
      "description": "Your first steps with our service",
      "content": "<p>Start by...</p>",
      "contentType": "blog",
      "status": "published",
      "authorId": "admin@site.com",
      "createdAt": "2024-02-01T09:00:00Z"
    }
  ]
}
```

---

## Error Handling

```typescript
// Always handle errors gracefully
try {
  const page = await getPage(slug)
  
  if (!page) {
    return <NotFound />
  }

  return <PageContent page={page} />
} catch (error) {
  console.error('Failed to load page:', error)
  return <ErrorComponent />
}
```

---

## Summary

1. Create content in the CMS Admin Panel
2. Publish content
3. Query it in your frontend components
4. Display to your visitors
5. Update anytime through the admin panel
6. No code deploy needed!

The CMS provides a flexible, scalable way to manage your website content without touching code.
