/**
 * AUAPW Admin Portal Credentials
 * Default Admin Account for System Access
 * 
 * IMPORTANT: Change these credentials immediately after first login!
 * Store secure credentials in environment variables for production.
 */

export const ADMIN_CREDENTIALS = {
  username: 'admin@auapw.com',
  password: 'AuapW@2024Admin!Secure', // Change this immediately!
  role: 'super_admin',
  permissions: [
    'view_dashboard',
    'manage_users',
    'manage_orders',
    'manage_sellers',
    'manage_inventory',
    'view_kpis',
    'manage_payments',
    'fraud_review',
    'approve_sellers',
    'export_reports',
  ],
}

export const ADMIN_SESSIONS = {
  timeout: 30 * 60 * 1000, // 30 minutes
  maxSessions: 3,
}

// Secondary admin account for support team
export const SUPPORT_ADMIN = {
  username: 'support@auapw.com',
  password: 'Support@AUAPW2024!Access',
  role: 'support_admin',
  permissions: [
    'view_dashboard',
    'view_orders',
    'manage_customers',
    'manage_support_tickets',
    'view_kpis',
  ],
}

// Finance admin account
export const FINANCE_ADMIN = {
  username: 'finance@auapw.com',
  password: 'Finance@AUAPW2024!Secure',
  role: 'finance_admin',
  permissions: [
    'view_dashboard',
    'view_kpis',
    'view_payments',
    'view_payouts',
    'manage_commissions',
    'export_financials',
    'manage_refunds',
  ],
}

export type AdminRole = 'super_admin' | 'support_admin' | 'finance_admin'

export interface AdminUser {
  username: string
  password: string
  role: AdminRole
  permissions: string[]
}
