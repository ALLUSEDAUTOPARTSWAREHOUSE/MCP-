import { pgTable, text, timestamp, boolean, integer, decimal, json } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
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

// --- ENTERPRISE MARKETPLACE TABLES ---

// User roles and permissions
export const userRoles = pgTable('user_roles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  role: text('role').notNull().default('buyer'), // 'buyer', 'seller', 'admin'
  status: text('status').notNull().default('active'), // 'active', 'suspended', 'banned'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Seller profiles and KYB/KYC information
export const sellerProfiles = pgTable('seller_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('businessName').notNull(),
  businessType: text('businessType').notNull(), // 'salvage_yard', 'distributor', 'individual', etc.
  ein: text('ein'), // Employer ID Number
  businessRegistration: text('businessRegistration'),
  businessRegistrationUrl: text('businessRegistrationUrl'),
  taxId: text('taxId').notNull(),
  businessAddress: text('businessAddress').notNull(),
  businessCity: text('businessCity').notNull(),
  businessState: text('businessState').notNull(),
  businessZip: text('businessZip').notNull(),
  businessPhone: text('businessPhone').notNull(),
  businessWebsite: text('businessWebsite'),
  contactName: text('contactName').notNull(),
  contactEmail: text('contactEmail').notNull(),
  contactPhone: text('contactPhone').notNull(),
  bankAccountName: text('bankAccountName'),
  bankAccountType: text('bankAccountType'), // 'checking', 'savings'
  kycStatus: text('kycStatus').default('pending'), // 'pending', 'verified', 'rejected'
  kybStatus: text('kybStatus').default('pending'), // 'pending', 'verified', 'rejected'
  stripeConnectId: text('stripeConnectId'),
  stripeOnboardingComplete: boolean('stripeOnboardingComplete').default(false),
  approvalStatus: text('approvalStatus').default('pending'), // 'pending', 'approved', 'rejected'
  rejectionReason: text('rejectionReason'),
  monthlyListingFee: decimal('monthlyListingFee', { precision: 10, scale: 2 }).default('0'),
  commissionPercent: decimal('commissionPercent', { precision: 5, scale: 2 }).default('10'), // 10% default
  flatTransactionFee: decimal('flatTransactionFee', { precision: 10, scale: 2 }).default('0'),
  description: text('description'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalSales: integer('totalSales').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Seller listings (inventory)
export const sellerListings = pgTable('seller_listings', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  partNumber: text('partNumber'),
  partName: text('partName').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: text('year'),
  mileage: integer('mileage'),
  condition: text('condition').notNull(), // 'new', 'excellent', 'good', 'fair'
  description: text('description'),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  sku: text('sku').unique(),
  images: json('images'), // array of image URLs
  specs: json('specs'), // flexible object for part specifications
  listingStatus: text('listingStatus').default('active'), // 'active', 'inactive', 'sold'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Double-entry ledger for all financial transactions
export const ledgerEntries = pgTable('ledger_entries', {
  id: text('id').primaryKey(),
  txnId: text('txnId').notNull(), // Reference to order, payout, fee, refund, etc.
  txnType: text('txnType').notNull(), // 'sale', 'refund', 'commission', 'payout', 'fee', 'chargeback'
  accountType: text('accountType').notNull(), // 'buyer', 'seller', 'platform'
  accountId: text('accountId').notNull(), // userId
  debit: decimal('debit', { precision: 10, scale: 2 }).default('0'),
  credit: decimal('credit', { precision: 10, scale: 2 }).default('0'),
  description: text('description').notNull(),
  metadata: json('metadata'), // arbitrary extra data
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Payout records (seller earnings)
export const payoutRecords = pgTable('payout_records', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  period: text('period').notNull(), // 'YYYY-MM'
  totalSales: decimal('totalSales', { precision: 10, scale: 2 }).default('0'),
  commissionDue: decimal('commissionDue', { precision: 10, scale: 2 }).default('0'),
  listingFees: decimal('listingFees', { precision: 10, scale: 2 }).default('0'),
  transactionFees: decimal('transactionFees', { precision: 10, scale: 2 }).default('0'),
  chargebacks: decimal('chargebacks', { precision: 10, scale: 2 }).default('0'),
  adjustments: decimal('adjustments', { precision: 10, scale: 2 }).default('0'),
  netPayout: decimal('netPayout', { precision: 10, scale: 2 }).notNull(),
  payoutStatus: text('payoutStatus').default('pending'), // 'pending', 'initiated', 'completed', 'failed'
  stripePayoutId: text('stripePayoutId'),
  payoutDate: timestamp('payoutDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Fraud flags and alerts
export const fraudFlags = pgTable('fraud_flags', {
  id: text('id').primaryKey(),
  flagType: text('flagType').notNull(), // 'high_chargeback_rate', 'multiple_accounts', 'velocity_abuse', 'velocity_address', 'manual_review'
  riskScore: integer('riskScore').notNull().default(0), // 0-100
  userId: text('userId'),
  sellerId: text('sellerId'),
  orderId: text('orderId'),
  description: text('description').notNull(),
  status: text('status').default('open'), // 'open', 'investigating', 'resolved', 'ignored'
  resolution: text('resolution'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
})

// Order fulfillment tracking
export const orderFulfillment = pgTable('order_fulfillment', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull().unique(),
  sellerId: text('sellerId').notNull(),
  trackingNumber: text('trackingNumber'),
  carrier: text('carrier'), // 'ups', 'fedex', 'usps', 'other'
  shippedAt: timestamp('shippedAt'),
  deliveredAt: timestamp('deliveredAt'),
  fulfillmentStatus: text('fulfillmentStatus').default('pending'), // 'pending', 'shipped', 'delivered', 'failed'
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Returns and RMA (Return Merchandise Authorization)
export const rmaRequests = pgTable('rma_requests', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  itemId: text('itemId').notNull(),
  userId: text('userId').notNull(),
  sellerId: text('sellerId').notNull(),
  reason: text('reason').notNull(),
  description: text('description'),
  rmaNumber: text('rmaNumber').notNull().unique(),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected', 'returned', 'refunded'
  returnShippingLabel: text('returnShippingLabel'),
  refundAmount: decimal('refundAmount', { precision: 10, scale: 2 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Seller reviews and ratings
export const sellerReviews = pgTable('seller_reviews', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  buyerId: text('buyerId').notNull(),
  orderId: text('orderId'),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  aspect: text('aspect'), // 'quality', 'shipping', 'communication', 'accuracy'
  verifiedPurchase: boolean('verifiedPurchase').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Audit log for compliance and debugging
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  actor: text('actor').notNull(), // userId or 'system'
  resource: text('resource').notNull(), // 'user', 'seller', 'order', 'payout', etc.
  resourceId: text('resourceId').notNull(),
  changes: json('changes'), // before/after
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- CMS CONTENT MANAGEMENT TABLES ---

// Team roles and permissions for portals
export const teamRoles = pgTable('team_roles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  teamType: text('teamType').notNull(), // 'admin', 'sales', 'support', 'marketing'
  role: text('role').notNull(), // 'owner', 'manager', 'editor', 'viewer'
  status: text('status').default('active'), // 'active', 'inactive'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Content pages (website pages, blog posts, etc.)
export const contentPages = pgTable('content_pages', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'), // Rich text/markdown content
  contentType: text('contentType').notNull(), // 'page', 'blog', 'faq', 'policy'
  category: text('category'), // 'general', 'shipping', 'returns', 'sales', 'support'
  teamType: text('teamType'), // Which team can edit: 'admin', 'sales', 'support'
  status: text('status').default('published'), // 'draft', 'published', 'archived'
  seoTitle: text('seoTitle'),
  seoDescription: text('seoDescription'),
  metaKeywords: text('metaKeywords'),
  featuredImage: text('featuredImage'),
  authorId: text('authorId'),
  publishedAt: timestamp('publishedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Content revisions/history
export const contentRevisions = pgTable('content_revisions', {
  id: text('id').primaryKey(),
  pageId: text('pageId').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  revisionNumber: integer('revisionNumber').notNull(),
  changedBy: text('changedBy').notNull(),
  changeDescription: text('changeDescription'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Sales content (products, pricing, promotions)
export const salesContent = pgTable('sales_content', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  contentType: text('contentType').notNull(), // 'product_feature', 'promotion', 'pricing_info', 'testimonial'
  content: text('content'),
  images: json('images'), // array of image URLs
  targetAudience: text('targetAudience'), // 'retail', 'wholesale', 'business'
  status: text('status').default('draft'), // 'draft', 'published', 'archived'
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate'),
  editedBy: text('editedBy'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Support content (FAQs, policies, guides)
export const supportContent = pgTable('support_content', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  contentType: text('contentType').notNull(), // 'faq', 'policy', 'guide', 'troubleshooting'
  category: text('category').notNull(), // 'shipping', 'returns', 'payments', 'account', 'technical'
  content: text('content'),
  relatedPages: json('relatedPages'), // array of page IDs
  status: text('status').default('published'), // 'draft', 'published', 'archived'
  priority: integer('priority').default(0), // for sorting/ordering
  editedBy: text('editedBy'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Portal activity log
export const portalActivityLog = pgTable('portal_activity_log', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  teamType: text('teamType').notNull(), // which portal
  action: text('action').notNull(), // 'created', 'updated', 'deleted', 'published'
  resourceType: text('resourceType').notNull(), // 'page', 'product', 'faq'
  resourceId: text('resourceId').notNull(),
  details: json('details'), // what changed
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- PHASE 1: MARKETPLACE TABLES ---

// Seller profiles (users who sell auto parts on platform)
export const sellerProfiles = pgTable('seller_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('businessName').notNull(),
  businessLicense: text('businessLicense'),
  stripeConnectId: text('stripeConnectId'),
  taxId: text('taxId'),
  bankAccount: text('bankAccount'),
  commissionRate: numeric('commissionRate').default('10'), // percentage commission
  status: text('status').default('pending'), // 'pending', 'active', 'suspended', 'rejected'
  verificationStatus: text('verificationStatus').default('unverified'), // 'unverified', 'verified', 'rejected'
  totalSalesVolume: numeric('totalSalesVolume').default('0'),
  averageRating: numeric('averageRating').default('0'),
  reviewCount: integer('reviewCount').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Product listings (inventory for sale)
export const listings = pgTable('listings', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  title: text('title').notNull(),
  sku: text('sku').unique(),
  category: text('category').notNull(), // 'engines', 'transmissions', 'parts'
  subcategory: text('subcategory'),
  description: text('description'),
  price: numeric('price').notNull(),
  originalPrice: numeric('originalPrice'), // MSRP
  quantity: integer('quantity').default(0),
  condition: text('condition').notNull(), // 'new', 'refurbished', 'used'
  warranty: text('warranty'), // e.g. '12 months', 'lifetime'
  compatibility: json('compatibility'), // {makes: [], models: [], years: []}
  images: json('images'), // array of image URLs
  status: text('status').default('active'), // 'active', 'inactive', 'sold_out', 'archived'
  shippingClass: text('shippingClass'), // for different shipping rates
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Append-only ledger (immutable transaction record)
export const ledger = pgTable('ledger', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  sellerId: text('sellerId').notNull(),
  transactionType: text('transactionType').notNull(), // 'sale', 'refund', 'chargeback', 'withdrawal'
  amount: numeric('amount').notNull(),
  commission: numeric('commission').notNull(),
  netAmount: numeric('netAmount').notNull(), // amount - commission
  status: text('status').notNull(), // 'pending', 'completed', 'failed'
  description: text('description'),
  metadata: json('metadata'), // transaction details
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Fraud flags and risk scoring
export const fraudFlags = pgTable('fraud_flags', {
  id: text('id').primaryKey(),
  orderId: text('orderId'),
  userId: text('userId'),
  sellerId: text('sellerId'),
  flagType: text('flagType').notNull(), // 'high_velocity', 'high_chargeback_rate', 'duplicate_card', 'geographical_mismatch', 'price_manipulation'
  riskScore: numeric('riskScore').notNull(), // 0-100
  status: text('status').default('open'), // 'open', 'resolved', 'dismissed'
  notes: text('notes'),
  reviewedBy: text('reviewedBy'),
  reviewedAt: timestamp('reviewedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Payouts to sellers
export const payouts = pgTable('payouts', {
  id: text('id').primaryKey(),
  sellerId: text('sellerId').notNull(),
  stripePayoutId: text('stripePayoutId'),
  amount: numeric('amount').notNull(),
  status: text('status').default('pending'), // 'pending', 'in_transit', 'paid', 'failed', 'cancelled'
  period: text('period').notNull(), // 'monthly', 'weekly', 'manual'
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate').notNull(),
  failureReason: text('failureReason'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  paidAt: timestamp('paidAt'),
})
