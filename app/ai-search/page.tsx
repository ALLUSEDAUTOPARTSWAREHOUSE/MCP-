'use client'

import { useState } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SmartSearch } from "@/components/search/smart-search"
import { VinSearchForm } from "@/components/vin/vin-search-form"
import { VehicleDetails } from "@/components/vin/vehicle-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AiSearchPage() {
  const [decodedVehicle, setDecodedVehicle] = useState<any>(null)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Smart Parts Search
            </h1>
            <p className="text-lg text-foreground/70">
              Find the exact parts you need using AI or your vehicle VIN
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="description">Search by Description</TabsTrigger>
              <TabsTrigger value="vin">Search by VIN</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <SmartSearch />
            </TabsContent>

            <TabsContent value="vin" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <VinSearchForm onVehicleFound={setDecodedVehicle} />
                {decodedVehicle ? (
                  <VehicleDetails vehicle={decodedVehicle} />
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
                    <p className="text-foreground/70 mb-4">
                      Enter your VIN to see detailed vehicle information
                    </p>
                    <p className="text-sm text-foreground/50">
                      Your VIN is a 17-character code found on your vehicle&apos;s registration, title, or dashboard.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
