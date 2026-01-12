import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  try {
    // Validate NEXTAUTH_SECRET
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is missing - authentication will fail')
      redirect('/auth/login')
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      redirect('/auth/login')
    }

    return session
  } catch (error: any) {
    console.error('Error in requireAuth:', error?.message || error)
    redirect('/auth/login')
  }
}

export async function requireRole(allowedRoles: string[]) {
  try {
    const session = await requireAuth()

    if (!allowedRoles.includes(session.user.role)) {
      redirect('/dashboard')
    }

    return session
  } catch (error: any) {
    console.error('Error in requireRole:', error?.message || error)
    redirect('/auth/login')
  }
}

