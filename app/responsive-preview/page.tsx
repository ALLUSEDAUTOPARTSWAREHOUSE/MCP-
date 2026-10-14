'use client'

import { useState } from 'react'
import { Smartphone, Monitor, Tablet } from 'lucide-react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface Device {
  id: DeviceType
  name: string
  width: number
  height: number
  icon: React.ReactNode
}

const devices: Device[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    width: 375,
    height: 812,
    icon: <Smartphone size={20} />,
  },
  {
    id: 'tablet',
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: <Tablet size={20} />,
  },
  {
    id: 'desktop',
    name: 'Desktop',
    width: 1280,
    height: 800,
    icon: <Monitor size={20} />,
  },
]

export default function ResponsivePreviewPage() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('mobile')

  const device = devices.find((d) => d.id === activeDevice)!

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-900 text-white mb-2">Responsive Preview</h1>
        <p className="text-slate-400 text-sm">Test the website across different device sizes</p>
      </div>

      {/* Device Selector */}
      <div className="mb-8 flex gap-3 flex-wrap">
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDevice(d.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-700 text-sm uppercase letter-spacing-0.2 transition-all duration-300 ${
              activeDevice === d.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {d.icon}
            {d.name}
            <span className="text-xs opacity-75">({d.width}×{d.height})</span>
          </button>
        ))}
      </div>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: device.width,
            height: device.height,
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 250px)',
          }}
        >
          {/* Device Frame */}
          <div className="w-full h-full overflow-auto">
            <iframe
              src="/"
              title={`${device.name} Preview`}
              className="w-full h-full border-none"
              style={{
                transform: 'scale(1)',
                transformOrigin: 'top left',
              }}
            />
          </div>

          {/* Device Label */}
          <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full">
            {device.name} • {device.width}×{device.height}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-3">Testing Guide</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Click the device buttons above to switch between mobile, tablet, and desktop views</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Test navigation, forms, images, and text rendering at each breakpoint</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Verify that all interactive elements work properly on each device size</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Check responsive typography, spacing, and layout adjustments</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
