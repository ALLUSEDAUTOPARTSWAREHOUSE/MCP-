'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, FileText, BarChart3, HelpCircle } from 'lucide-react'

interface PortalSwitcherProps {
  currentPortal?: 'admin' | 'sales' | 'support'
}

export function PortalSwitcher({ currentPortal = 'admin' }: PortalSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const portals = [
    {
      id: 'admin',
      name: 'Content Manager',
      href: '/admin/cms/pages',
      icon: FileText,
      color: 'text-blue-400',
      description: 'Manage website pages',
    },
    {
      id: 'sales',
      name: 'Sales Team',
      href: '/admin/cms/sales',
      icon: BarChart3,
      color: 'text-green-400',
      description: 'Manage campaigns',
    },
    {
      id: 'support',
      name: 'Support Team',
      href: '/admin/cms/support',
      icon: HelpCircle,
      color: 'text-orange-400',
      description: 'Manage help articles',
    },
  ]

  const current = portals.find((p) => p.id === currentPortal)
  const CurrentIcon = current?.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition text-white"
      >
        {CurrentIcon && <CurrentIcon className={`w-4 h-4 ${current?.color}`} />}
        <span>{current?.name}</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.id}
                href={portal.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-700 transition ${
                  portal.id === currentPortal ? 'bg-slate-700 border-l-2 border-blue-500' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${portal.color} mt-0.5`} />
                <div>
                  <div className="font-semibold text-white">{portal.name}</div>
                  <div className="text-xs text-slate-400">{portal.description}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
