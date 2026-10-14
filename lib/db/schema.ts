import { pgTable, text, timestamp, boolean, decimal, integer, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  // Extended profile fields
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
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
// Customer orders, invoices, and vehicle management
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  orderNumber: text('orderNumber').notNull().unique(),
  status: text('status').notNull().default('pending'),
  totalAmount: decimal('totalAmount', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  tax: decimal('tax', { precision: 10, scale: 2 }),
  shippingCost: decimal('shippingCost', { precision: 10, scale: 2 }),
  shippingAddress: text('shippingAddress'),
  billingAddress: text('billingAddress'),
  items: jsonb('items'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  estimatedDelivery: timestamp('estimatedDelivery'),
})

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  orderId: text('orderId').notNull(),
  invoiceNumber: text('invoiceNumber').notNull().unique(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  pdfUrl: text('pdfUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Order line items
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  productId: text('productId').notNull(),
  productName: text('productName').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unitPrice', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull(),
  partNumber: text('partNumber'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Payment methods and payment intents
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  userId: text('userId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // pending, authorized, captured, failed, cancelled
  paymentMethod: text('paymentMethod').notNull(), // credit_card, debit_card, paypal, bank_transfer
  cardDetails: jsonb('cardDetails'), // {last4, brand, expiry}
  cardToken: text('cardToken'), // mock authorization reference
  authorizationCode: text('authorizationCode'), // mock auth code
  failureReason: text('failureReason'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const savedVehicles = pgTable('saved_vehicles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  vin: text('vin').notNull(),
  make: text('make'),
  model: text('model'),
  year: integer('year'),
  trim: text('trim'),
  engine: text('engine'),
  transmission: text('transmission'),
  mileage: integer('mileage'),
  nickname: text('nickname'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const wishlistItems = pgTable('wishlist_items', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: text('productId').notNull(),
  productName: text('productName').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  partNumber: text('partNumber'),
  quantity: integer('quantity').default(1),
  addedAt: timestamp('addedAt').notNull().defaultNow(),
})

// Notification system for 14 event types
export const notificationSettings = pgTable('notification_settings', {
  id: text('id').primaryKey(),
  // Event types: newCustomer, newOrder, paymentSuccess, paymentFailure, highRiskOrder,
  // chargeback, refund, contactForm, quoteRequest, ticketCreated, shipmentNotification,
  // dailyReport, weeklyReport, aiChatEscalation
  eventType: text('eventType').notNull().unique(),
  enabled: boolean('enabled').notNull().default(true),
  // Recipients: stored as JSON array or comma-separated, e.g. ["auapworld@gmail.com", "sale@auapw.com"]
  recipients: jsonb('recipients').notNull().default('[]'),
  subject: text('subject').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Log every notification sent, failed, or pending
export const notificationLogs = pgTable('notification_logs', {
  id: text('id').primaryKey(),
  eventType: text('eventType').notNull(),
  recipients: jsonb('recipients').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull().default('pending'), // pending, sent, failed
  failureReason: text('failureReason'),
  // Reference to the event (orderId, userId, etc.)
  referenceId: text('referenceId'),
  referenceType: text('referenceType'), // order, user, payment, etc.
  // Optional metadata
  metadata: jsonb('metadata'),
  attemptCount: integer('attemptCount').default(0),
  lastAttemptAt: timestamp('lastAttemptAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// User search history — track what customers search for
export const searchHistory = pgTable('search_history', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  query: text('query').notNull(),
  category: text('category'), // engines, transmissions, parts, etc.
  resultsCount: integer('resultsCount').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Product comparison history — track products compared side-by-side
export const comparisonHistory = pgTable('comparison_history', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  productId: text('productId').notNull(),
  productName: text('productName').notNull(),
  comparisonGroupId: text('comparisonGroupId'), // group related comparisons
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Saved comparisons — customers can save comparison snapshots
export const savedComparisons = pgTable('saved_comparisons', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  productIds: jsonb('productIds').notNull().default('[]'), // array of product IDs
  metadata: jsonb('metadata'), // filters, specs used in comparison
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
