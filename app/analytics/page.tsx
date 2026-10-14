'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

// Analytics data
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240, revenue: 12000 },
  { month: 'Feb', sales: 3000, orders: 221, revenue: 9500 },
  { month: 'Mar', sales: 2000, orders: 229, revenue: 7200 },
  { month: 'Apr', sales: 2780, orders: 200, revenue: 8400 },
  { month: 'May', sales: 1890, orders: 208, revenue: 5900 },
  { month: 'Jun', sales: 2390, orders: 250, revenue: 7600 },
]

const categoryData = [
  { name: 'Engine & Transmission', value: 35, fill: '#3b82f6' },
  { name: 'Suspension & Steering', value: 25, fill: '#ef4444' },
  { name: 'Electrical', value: 20, fill: '#f59e0b' },
  { name: 'Interior Components', value: 12, fill: '#10b981' },
  { name: 'Other', value: 8, fill: '#8b5cf6' },
]

const inventoryStatus = [
  { category: 'Engine & Transmission', inStock: 450, lowStock: 120, outOfStock: 30 },
  { category: 'Suspension', inStock: 320, lowStock: 80, outOfStock: 15 },
  { category: 'Electrical', inStock: 280, lowStock: 60, outOfStock: 20 },
  { category: 'Climate Control', inStock: 150, lowStock: 40, outOfStock: 10 },
  { category: 'Brake System', inStock: 220, lowStock: 50, outOfStock: 25 },
]

const topParts = [
  { part: 'Engine Assembly', sales: 145, revenue: 362500 },
  { part: 'Transmission', sales: 98, revenue: 176400 },
  { part: 'Radiator', sales: 87, revenue: 36540 },
  { part: 'Alternator', sales: 76, revenue: 36480 },
  { part: 'Starter Motor', sales: 65, revenue: 33800 },
]

const customerData = [
  { location: 'California', customers: 2400, purchases: 45000 },
  { location: 'Texas', customers: 1398, purchases: 38000 },
  { location: 'Florida', customers: 1200, purchases: 32000 },
  { location: 'New York', customers: 980, purchases: 28000 },
  { location: 'Illinois', customers: 780, purchases: 24000 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="py-12 sm:py-16 relative bg-gradient-to-b from-background to-background/50 border-b border-border/30">
          <div className="metal-line absolute top-0 left-0 right-0" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2 text-balance">
              Analytics Dashboard
            </h1>
            <p className="text-foreground/70 text-lg sm:text-xl mb-6 max-w-2xl">
              Track inventory, sales performance, and customer insights
            </p>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {['1m', '3m', '6m', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`auapw-btn auapw-btn-sm ${
                    timeRange === range ? 'auapw-btn-blue' : 'auapw-btn-silver'
                  }`}
                >
                  {range === '1m' ? 'Last Month' : range === '3m' ? 'Last 3 Months' : range === '6m' ? 'Last 6 Months' : 'Last Year'}
                </button>
              ))}
            </div>
          </div>
          <div className="metal-line absolute bottom-0 left-0 right-0" />
        </section>

        {/* Charts Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="bg-background border border-border rounded-lg p-6">
                <p className="text-foreground/70 text-sm uppercase tracking-wide mb-2">Total Revenue</p>
                <p className="text-3xl font-black text-foreground">$50.8K</p>
                <p className="text-green-500 text-sm mt-2">+12.5% vs last period</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6">
                <p className="text-foreground/70 text-sm uppercase tracking-wide mb-2">Total Orders</p>
                <p className="text-3xl font-black text-foreground">1,348</p>
                <p className="text-green-500 text-sm mt-2">+8.2% vs last period</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6">
                <p className="text-foreground/70 text-sm uppercase tracking-wide mb-2">Items in Stock</p>
                <p className="text-3xl font-black text-foreground">2,140</p>
                <p className="text-yellow-500 text-sm mt-2">180 low stock items</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-6">
                <p className="text-foreground/70 text-sm uppercase tracking-wide mb-2">Avg Order Value</p>
                <p className="text-3xl font-black text-foreground">$245</p>
                <p className="text-green-500 text-sm mt-2">+5.3% vs last period</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Sales Trend Chart */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Sales Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Sales by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Inventory Status */}
              <div className="bg-background border border-border rounded-lg p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-foreground mb-6">Inventory Status by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inStock" fill="#10b981" />
                    <Bar dataKey="lowStock" fill="#f59e0b" />
                    <Bar dataKey="outOfStock" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue & Orders */}
              <div className="bg-background border border-border rounded-lg p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-foreground mb-6">Revenue & Orders Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Selling Parts */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Top 5 Parts</h2>
                <div className="space-y-4">
                  {topParts.map((part, idx) => (
                    <div key={idx} className="border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{part.part}</h3>
                        <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded">
                          {part.sales} sold
                        </span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                          style={{ width: `${(part.sales / 145) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-foreground/60 mt-2">Revenue: ${part.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Distribution */}
              <div className="bg-background border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Customers by Location</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="location" type="category" width={80} stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="customers" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
