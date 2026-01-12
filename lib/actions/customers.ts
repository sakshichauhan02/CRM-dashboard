'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getCustomers(page: number = 1, pageSize: number = 10, search?: string) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ])

  return {
    customers,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getCustomer(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      deals: {
        include: {
          assignedTo: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      activities: {
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      tasks: {
        include: {
          assignedTo: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      notesRelation: {
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      convertedFrom: true,
    },
  })
}

export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const company = formData.get('company') as string | null
  const industry = formData.get('industry') as string | null
  const status = formData.get('status') as string || 'ACTIVE'
  const notes = formData.get('notes') as string | null

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone: phone || null,
      company: company || null,
      industry: industry || null,
      status,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/customers')
  return customer
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const company = formData.get('company') as string | null
  const industry = formData.get('industry') as string | null
  const status = formData.get('status') as string
  const notes = formData.get('notes') as string | null

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      name,
      email,
      phone: phone || null,
      company: company || null,
      industry: industry || null,
      status,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/customers')
  revalidatePath(`/dashboard/customers/${id}`)
  return customer
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  })

  revalidatePath('/dashboard/customers')
}

