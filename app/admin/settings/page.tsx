import { Metadata } from 'next'
import { Settings, Mail, Globe, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings | Admin',
  description: 'Manage site settings and configurations',
}

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Settings className="w-8 h-8" />
            Settings & Configuration
          </h1>
          <p className="text-muted-foreground">Manage global site settings, integrations, and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 border border-primary text-primary flex items-center gap-2 font-semibold">
              <Globe className="w-4 h-4" />
              General Settings
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-card border border-border hover:border-primary transition flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Configuration
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-card border border-border hover:border-primary transition flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security Settings
            </button>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-6">General Settings</h2>

                <div className="space-y-6">
                  {/* Site Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="AUAPW - Used Auto Parts"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Site Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Description</label>
                    <textarea
                      rows={4}
                      defaultValue="AUAPW LLC is a leading supplier of used auto parts for Acura vehicles with a focus on quality and customer service."
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Support Phone</label>
                    <input
                      type="tel"
                      defaultValue="(888) 854-8681"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Support Email</label>
                    <input
                      type="email"
                      defaultValue="aupworld@gmail.com"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Business Hours */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Hours</label>
                    <input
                      type="text"
                      defaultValue="Monday - Saturday: 8:00 AM - 6:00 PM PST"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Shipping Cost */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Standard Shipping ($)</label>
                      <input
                        type="number"
                        defaultValue="240"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Days</label>
                      <input
                        type="text"
                        defaultValue="3-7 business days"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Warranty Info */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Warranty Period (days)</label>
                    <input
                      type="number"
                      defaultValue="90"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-3 pt-4">
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                      Save Changes
                    </button>
                    <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
