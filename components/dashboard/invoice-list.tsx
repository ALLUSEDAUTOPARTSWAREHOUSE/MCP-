'use client'

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function InvoiceList({ invoices }: { invoices: any[] }) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-foreground/70">No invoices yet</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-700'
      case 'issued':
        return 'bg-blue-500/20 text-blue-700'
      case 'overdue':
        return 'bg-red-500/20 text-red-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div className="flex-1">
            <p className="font-semibold text-foreground">{invoice.invoiceNumber}</p>
            <p className="text-sm text-foreground/70">
              {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">${invoice.amount}</p>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => {
              if (invoice.pdfUrl) {
                window.open(invoice.pdfUrl, '_blank')
              }
            }}
          >
            Download PDF
          </Button>
        </div>
      ))}
    </div>
  )
}
