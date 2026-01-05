import { getDealsByStage } from '@/lib/actions/deals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DealsKanban } from '@/components/deals/kanban'

export const dynamic = 'force-dynamic'

export default async function DealsPage() {
  const dealsByStage = await getDealsByStage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deals Pipeline</h1>
          <p className="text-gray-600">Manage your sales pipeline</p>
        </div>
        <Link href="/dashboard/deals/new">
          <Button>+ New Deal</Button>
        </Link>
      </div>

      <DealsKanban dealsByStage={dealsByStage} />
    </div>
  )
}

