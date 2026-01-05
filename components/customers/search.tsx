'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Suspense } from 'react'

function CustomerSearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/dashboard/customers?${params.toString()}`)
  }

  return (
    <Input
      placeholder="Search customers..."
      defaultValue={searchParams.get('search') || ''}
      onChange={(e) => handleSearch(e.target.value)}
      className="max-w-sm mb-4"
    />
  )
}

export function CustomerSearch() {
  return (
    <Suspense fallback={<Input placeholder="Search customers..." className="max-w-sm mb-4" disabled />}>
      <CustomerSearchInput />
    </Suspense>
  )
}

