'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">CRM System</h2>
      </div>
      <div className="flex items-center space-x-4">
        {session && (
          <>
            <span className="text-sm text-gray-600">
              Welcome, {session.user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

