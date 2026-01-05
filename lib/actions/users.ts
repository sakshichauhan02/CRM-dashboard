'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import * as bcrypt from 'bcryptjs'

type Role = 'ADMIN' | 'MANAGER' | 'SALES'

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          assignedLeads: true,
          assignedDeals: true,
          assignedTasks: true,
        },
      },
    },
  })
}

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as Role
  const isActive = formData.get('isActive') === 'true'

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
      isActive,
    },
  })

  revalidatePath('/dashboard/settings')
  return user
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as Role
  const isActive = formData.get('isActive') === 'true'
  const password = formData.get('password') as string | null

  const data: any = {
    name,
    role,
    isActive,
  }

  if (password) {
    data.password = await bcrypt.hash(password, 10)
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  })

  revalidatePath('/dashboard/settings')
  return user
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath('/dashboard/settings')
}

