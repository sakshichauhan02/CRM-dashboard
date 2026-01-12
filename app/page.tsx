import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Home() {
  try {
    const session = await getServerSession(authOptions)

    if (session) {
      redirect('/dashboard')
    } else {
      redirect('/auth/login')
    }
  } catch (error) {
    // If database/auth fails during build, redirect to login
    redirect('/auth/login')
  }
}

