import { pgTable, text, timestamp, boolean, integer, decimal, json } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').default('buyer'), // 'buyer', 'seller', 'admin'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email').notNull(),
  phone: text('phone'),
  businessName: text('businessName'),
  businessType: text('businessType'),
  taxId: text('taxId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const addresses = pgTable('addresses', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  streetAddress: text('streetAddress').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zipCode').notNull(),
  country: text('country').default('USA'),
  isDefault: boolean('isDefault').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const savedVehicles = pgTable('saved_vehicles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  year: integer('year').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  vin: text('vin'),
  engine: text('engine'),
  transmission: text('transmission'),
  isDefault: boolean('isDefault').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  orderNumber: text('orderNumber').notNull().unique(),
  status: text('status').default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('paymentMethod'),
  paymentStatus: text('paymentStatus').default('unpaid'),
  shippingAddress: text('shippingAddress'),
  billingAddress: text('billingAddress'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  productId: text('productId').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unitPrice', { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal('lineTotal', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  orderId: text('orderId').notNull(),
  invoiceNumber: text('invoiceNumber').notNull().unique(),
  invoiceDate: timestamp('invoiceDate').notNull().defaultNow(),
  dueDate: timestamp('dueDate'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('issued'),
  pdfUrl: text('pdfUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const wishlist = pgTable('wishlist', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: text('productId').notNull(),
  addedAt: timestamp('addedAt').notNull().defaultNow(),
})

export const vinQuotes = pgTable('vin_quotes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  vin: text('vin').notNull(),
  year: integer('year'),
  make: text('make'),
  model: text('model'),
  trim: text('trim'),
  engine: text('engine'),
  transmission: text('transmission'),
  parts: json('parts'),
  quoteStatus: text('quoteStatus').default('pending'),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Content Management System (CMS) ---
export const contentPages = pgTable('content_pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  contentType: text('contentType').notNull(),
  category: text('category'),
  teamType: text('teamType'),
  seoTitle: text('seoTitle'),
  seoDescription: text('seoDescription'),
  metaKeywords: text('metaKeywords'),
  featuredImage: text('featuredImage'),
  authorId: text('authorId'),
  status: text('status').default('draft'),
  published: boolean('published').default(false),
  publishedAt: timestamp('publishedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const pageContent = pgTable('page_content', {
  id: text('id').primaryKey(),
  page: text('page').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  sections: json('sections'),
  published: boolean('published').default(false),
  publishedAt: timestamp('publishedAt'),
  createdBy: text('createdBy').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const contentBlocks = pgTable('content_blocks', {
  id: text('id').primaryKey(),
  pageId: text('pageId').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  blockType: text('blockType').notNull(),
  order: integer('order').notNull(),
  visible: boolean('visible').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Team/Business Portal ---
export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  businessId: text('businessId'),
  ownerId: text('ownerId').notNull(),
  description: text('description'),
  logo: text('logo'),
  status: text('status').default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  teamId: text('teamId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').notNull(),
  joinedAt: timestamp('joinedAt').notNull().defaultNow(),
})

export const teamBulkOrders = pgTable('team_bulk_orders', {
  id: text('id').primaryKey(),
  teamId: text('teamId').notNull(),
  userId: text('userId').notNull(),
  status: text('status').default('draft'),
  items: json('items').notNull(),
  quantity: integer('quantity').notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  approvedBy: text('approvedBy'),
  approvedAt: timestamp('approvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Support Portal ---
export const supportTickets = pgTable('support_tickets', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  ticketNumber: text('ticketNumber').notNull().unique(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  priority: text('priority').default('medium'),
  status: text('status').default('open'),
  assignedTo: text('assignedTo'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
})

export const supportTicketMessages = pgTable('support_ticket_messages', {
  id: text('id').primaryKey(),
  ticketId: text('ticketId').notNull(),
  userId: text('userId').notNull(),
  message: text('message').notNull(),
  attachments: json('attachments'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const supportTeamUsers = pgTable('support_team_users', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  role: text('role').notNull(),
  department: text('department'),
  status: text('status').default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Settings & Configuration ---
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  category: text('category'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  updatedBy: text('updatedBy'),
})

export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resourceId'),
  changes: json('changes'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const portalActivityLog = pgTable('portal_activity_log', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  teamType: text('teamType').notNull(),
  action: text('action').notNull(),
  resourceType: text('resourceType').notNull(),
  resourceId: text('resourceId'),
  details: json('details'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Marketplace: Sellers ---
export const sellers = pgTable('sellers', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('businessName').notNull(),
  description: text('description'),
  businessType: text('businessType'),
  stripeConnectId: text('stripeConnectId').unique(),
  onboardingStatus: text('onboardingStatus').default('pending'), // 'pending', 'in_progress', 'completed', 'rejected'
  verificationStatus: text('verificationStatus').default('unverified'), // 'unverified', 'verified', 'suspended'
  website: text('website'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zipCode'),
  country: text('country').default('USA'),
  taxId: text('taxId'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('totalReviews').default(0),
  totalSales: decimal('totalSales', { precision: 15, scale: 2 }).default('0'),
  commissionRate: decimal('commissionRate', { precision: 5, scale: 2 }).default('5'), // Platform takes 5% by default
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Marketplace: Listings (Products/Inventory) ---
export const listings = pgTable('listings', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  sku: text('sku').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('originalPrice', { precision: 10, scale: 2 }),
  quantity: integer('quantity').notNull().default(0),
  images: json('images'), // Array of image URLs
  specifications: json('specifications'), // VIN, year, make, model, etc.
  condition: text('condition').notNull(), // 'new', 'like-new', 'excellent', 'good', 'fair'
  warranty: text('warranty'),
  shippingCost: decimal('shippingCost', { precision: 10, scale: 2 }).default('0'),
  status: text('status').default('active'), // 'active', 'inactive', 'sold', 'delisted'
  views: integer('views').default(0),
  sales: integer('sales').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('totalReviews').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Marketplace: Ledger Entries (Financial Records) ---
export const ledgerEntries = pgTable('ledger_entries', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  type: text('type').notNull(), // 'sale', 'commission_deduction', 'refund', 'adjustment', 'payout'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  orderId: text('orderId'),
  description: text('description'),
  status: text('status').default('completed'), // 'pending', 'completed', 'failed'
  reference: text('reference'), // Transaction ID, check number, etc.
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Marketplace: Payouts ---
export const payouts = pgTable('payouts', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending'), // 'pending', 'in_transit', 'completed', 'failed', 'canceled'
  method: text('method').notNull(), // 'stripe', 'bank_transfer', 'check'
  stripeTransferId: text('stripeTransferId'),
  bankDetails: json('bankDetails'),
  period: text('period').notNull(), // 'YYYY-MM' for monthly periods
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  processedAt: timestamp('processedAt'),
  completedAt: timestamp('completedAt'),
})

// --- Marketplace: Fraud Detection ---
export const fraudFlags = pgTable('fraud_flags', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  sellerId: text('sellerId'),
  type: text('type').notNull(), // 'chargeback', 'dispute', 'suspicious_activity', 'policy_violation'
  severity: text('severity').notNull(), // 'low', 'medium', 'high', 'critical'
  description: text('description'),
  evidence: json('evidence'),
  status: text('status').default('open'), // 'open', 'investigating', 'resolved', 'dismissed'
  actionTaken: text('actionTaken'), // 'none', 'warning', 'suspension', 'termination'
  resolvedAt: timestamp('resolvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Marketplace: Reviews & Ratings ---
export const sellerReviews = pgTable('seller_reviews', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  buyerId: text('buyerId').notNull(),
  orderId: text('orderId').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  comment: text('comment'),
  verified: boolean('verified').default(false), // Verified purchase
  helpful: integer('helpful').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const listingReviews = pgTable('listing_reviews', {
  id: text('id').primaryKey(),
  listingId: text('listingId').notNull(),
  buyerId: text('buyerId').notNull(),
  orderId: text('orderId').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title'),
  comment: text('comment'),
  verified: boolean('verified').default(false), // Verified purchase
  helpful: integer('helpful').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
