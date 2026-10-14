import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, BarChart3, HelpCircle, Plus, ShoppingCart, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CMS & Portals | Admin',
  description: 'Manage content, teams, and support',
}

export default function CMSPortalPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">CMS & Portals</h1>
          <p className="text-muted-foreground">Manage your business content, teams, and support across all platforms</p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Content Management Portal */}
          <Link href="/admin/cms/pages">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold">Content Manager</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage all website pages, blog posts, policies, and general content from a centralized dashboard
              </p>
              <div className="flex items-center text-blue-500 text-sm font-medium pt-2">
                <Plus className="w-4 h-4 mr-1" />
                Manage Pages
              </div>
            </div>
          </Link>

          {/* Team Buying Portal */}
          <Link href="/portal/teams">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <ShoppingCart className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">Team Buying</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and manage team purchasing accounts with bulk order discounts and approval workflows
              </p>
              <div className="flex items-center text-green-500 text-sm font-medium pt-2">
                <Plus className="w-4 h-4 mr-1" />
                View Teams
              </div>
            </div>
          </Link>

          {/* Support Portal */}
          <Link href="/portal/support">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <HelpCircle className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-semibold">Support Team</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage customer support tickets, FAQs, and help articles from a dedicated support interface
              </p>
              <div className="flex items-center text-orange-500 text-sm font-medium pt-2">
                <Plus className="w-4 h-4 mr-1" />
                View Tickets
              </div>
            </div>
          </Link>

          {/* Sales Portal */}
          <Link href="/admin/cms/sales">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold">Sales Team</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Create campaigns, manage promotions, and track sales performance across channels
              </p>
              <div className="flex items-center text-purple-500 text-sm font-medium pt-2">
                <Plus className="w-4 h-4 mr-1" />
                New Campaign
              </div>
            </div>
          </Link>

          {/* Settings Portal */}
          <Link href="/admin/settings">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary transition cursor-pointer space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-slate-500/10">
                  <Settings className="w-6 h-6 text-slate-500" />
                </div>
                <h2 className="text-xl font-semibold">Settings</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure site settings, integrations, email templates, and other global configurations
              </p>
              <div className="flex items-center text-slate-500 text-sm font-medium pt-2">
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </div>
            </div>
          </Link>
        </div>

        {/* Overview Section */}
        <div className="border border-border rounded-lg p-8 space-y-6 bg-card">
          <h2 className="text-2xl font-semibold">Portal Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-green-500 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Active Teams</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-orange-500 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Open Tickets</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-3">Quick Access Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/admin/cms/pages" className="px-4 py-2 rounded-lg bg-background hover:bg-muted text-sm transition">
                Manage Pages
              </Link>
              <Link href="/portal/teams" className="px-4 py-2 rounded-lg bg-background hover:bg-muted text-sm transition">
                View Teams
              </Link>
              <Link href="/portal/support" className="px-4 py-2 rounded-lg bg-background hover:bg-muted text-sm transition">
                Support Tickets
              </Link>
              <Link href="/admin/settings" className="px-4 py-2 rounded-lg bg-background hover:bg-muted text-sm transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
