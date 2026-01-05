'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function LeadFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    // Convert "all" to empty string for URL params
    const filterValue = value === 'all' ? '' : value
    if (filterValue) {
      params.set(key, filterValue)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/dashboard/leads?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search leads..."
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => handleFilter('search', e.target.value)}
        className="max-w-sm"
      />
      <Select
        value={searchParams.get('status') || 'all'}
        onValueChange={(value) => handleFilter('status', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="CONTACTED">Contacted</SelectItem>
          <SelectItem value="QUALIFIED">Qualified</SelectItem>
          <SelectItem value="LOST">Lost</SelectItem>
          <SelectItem value="CONVERTED">Converted</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get('source') || 'all'}
        onValueChange={(value) => handleFilter('source', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="WEBSITE">Website</SelectItem>
          <SelectItem value="REFERRAL">Referral</SelectItem>
          <SelectItem value="ADS">Ads</SelectItem>
          <SelectItem value="COLD_CALL">Cold Call</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

