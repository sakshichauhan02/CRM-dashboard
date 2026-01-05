'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type TaskStatus = 'PENDING' | 'COMPLETED'

export async function getTasks(page: number = 1, pageSize: number = 10, status?: TaskStatus, userId?: string) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (status) {
    where.status = status
  }

  if (userId) {
    where.assignedToId = userId
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { dueDate: 'asc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        lead: {
          select: { id: true, name: true },
        },
        customer: {
          select: { id: true, name: true },
        },
        deal: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.task.count({ where }),
  ])

  return {
    tasks,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const dueDate = formData.get('dueDate') as string | null
  const assignedToId = formData.get('assignedToId') as string | null
  const leadId = formData.get('leadId') as string | null
  const customerId = formData.get('customerId') as string | null
  const dealId = formData.get('dealId') as string | null

  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId || null,
      leadId: leadId || null,
      customerId: customerId || null,
      dealId: dealId || null,
    },
  })

  revalidatePath('/dashboard/tasks')
  return task
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const status = formData.get('status') as TaskStatus
  const dueDate = formData.get('dueDate') as string | null
  const assignedToId = formData.get('assignedToId') as string | null

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description: description || null,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId || null,
    },
  })

  revalidatePath('/dashboard/tasks')
  return task
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  })

  revalidatePath('/dashboard/tasks')
}

