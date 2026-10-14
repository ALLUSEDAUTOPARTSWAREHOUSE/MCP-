'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderHistory } from './order-history'
import { SavedVehicles } from './saved-vehicles'
import { WishlistView } from './wishlist-view'
import { InvoiceList } from './invoice-list'
import { ProfileSettings } from './profile-settings'

export function DashboardTabs({
  orders,
  invoices,
  vehicles,
  wishlistItems,
}: {
  orders: any[]
  invoices: any[]
  vehicles: any[]
  wishlistItems: any[]
}) {
  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="mt-6">
        <OrderHistory orders={orders} />
      </TabsContent>

      <TabsContent value="vehicles" className="mt-6">
        <SavedVehicles vehicles={vehicles} />
      </TabsContent>

      <TabsContent value="wishlist" className="mt-6">
        <WishlistView wishlistItems={wishlistItems} />
      </TabsContent>

      <TabsContent value="invoices" className="mt-6">
        <InvoiceList invoices={invoices} />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  )
}
