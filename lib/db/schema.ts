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
