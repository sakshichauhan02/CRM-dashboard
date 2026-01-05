'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { updateDealStage } from '@/lib/actions/deals'
import { useRouter } from 'next/navigation'

interface DealsKanbanProps {
  dealsByStage: {
    PROSPECT: any[]
    PROPOSAL: any[]
    NEGOTIATION: any[]
    WON: any[]
    LOST: any[]
  }
}

export function DealsKanban({ dealsByStage }: DealsKanbanProps) {
  const router = useRouter()

  const stages = [
    { key: 'PROSPECT', label: 'Prospect', color: 'bg-blue-50 border-blue-200' },
    { key: 'PROPOSAL', label: 'Proposal', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-50 border-orange-200' },
    { key: 'WON', label: 'Won', color: 'bg-green-50 border-green-200' },
    { key: 'LOST', label: 'Lost', color: 'bg-red-50 border-red-200' },
  ]

  const handleStageChange = async (dealId: string, newStage: string) => {
    await updateDealStage(dealId, newStage as any)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {stages.map((stage) => {
        const deals = dealsByStage[stage.key as keyof typeof dealsByStage] || []
        const totalValue = deals.reduce((sum, deal) => sum + Number(deal.value || 0), 0)

        return (
          <Card key={stage.key} className={stage.color}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {stage.label} ({deals.length})
              </CardTitle>
              <p className="text-xs text-gray-600">{formatCurrency(totalValue)}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {deals.map((deal) => (
                <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>
                  <div className="p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm">{deal.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {deal.customer?.name || 'No customer'}
                    </p>
                    <p className="text-xs font-semibold mt-1">{formatCurrency(deal.value)}</p>
                    {deal.assignedTo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {deal.assignedTo.name}
                      </p>
                    )}
                    <div className="flex gap-1 mt-2">
                      {stages.map((s) => (
                        <button
                          key={s.key}
                          onClick={(e) => {
                            e.preventDefault()
                            handleStageChange(deal.id, s.key)
                          }}
                          className={`text-xs px-2 py-1 rounded ${deal.stage === s.key ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {s.label.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

