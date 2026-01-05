'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDeal, updateDeal } from '@/lib/actions/deals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DealFormProps {
  users: any[]
  customers: any[]
  deal?: any
  defaultCustomerId?: string
  defaultLeadId?: string
}

export function DealForm({ users, customers, deal, defaultCustomerId, defaultLeadId }: DealFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Convert special values to empty string for server action
    if (formData.get('customerId') === 'none') {
      formData.set('customerId', '')
    }
    if (formData.get('assignedToId') === 'unassigned') {
      formData.set('assignedToId', '')
    }

    try {
      if (deal) {
        await updateDeal(deal.id, formData)
      } else {
        if (defaultLeadId) {
          formData.set('leadId', defaultLeadId)
        }
        await createDeal(formData)
      }
      router.push('/dashboard/deals')
      router.refresh()
    } catch (error) {
      console.error('Error saving deal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deal ? 'Edit Deal' : 'New Deal'}</CardTitle>
        <CardDescription>{deal ? 'Update deal information' : 'Fill in the details to create a new deal'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deal Name *</Label>
              <Input id="name" name="name" defaultValue={deal?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input id="value" name="value" type="number" step="0.01" defaultValue={deal?.value ? Number(deal.value) : ''} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage *</Label>
              <Select name="stage" defaultValue={deal?.stage || 'PROSPECT'} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="WON">Won</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <Input id="expectedCloseDate" name="expectedCloseDate" type="date" defaultValue={deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select name="customerId" defaultValue={deal?.customerId || defaultCustomerId || 'none'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No customer</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedToId">Assigned To</Label>
              <Select name="assignedToId" defaultValue={deal?.assignedToId || 'unassigned'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue={deal?.notes || ''}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

