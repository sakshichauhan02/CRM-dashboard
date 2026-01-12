'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED'
type LeadSource = 'WEBSITE' | 'REFERRAL' | 'ADS' | 'COLD_CALL'

export async function getLeads(page: number = 1, pageSize: number = 10, search?: string, status?: LeadStatus, source?: LeadSource) {
  const skip = (page - 1) * pageSize
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status
  }

  if (source) {
    where.source = source
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.lead.count({ where }),
  ])

  return {
    leads,
    total,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
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
        orderBy: { createdAt: 'desc' },
      },
      deal: true,
    },
  })
}

export async function createLead(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const source = formData.get('source') as LeadSource
  const status = (formData.get('status') as LeadStatus) || 'NEW'
  const assignedToId = formData.get('assignedToId') as string | null
  const notes = formData.get('notes') as string | null

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone: phone || null,
      source,
      status,
      assignedToId: assignedToId || null,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/leads')
  return lead
}

export async function updateLead(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const source = formData.get('source') as LeadSource
  const status = formData.get('status') as LeadStatus
  const assignedToId = formData.get('assignedToId') as string | null
  const notes = formData.get('notes') as string | null

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      name,
      email,
      phone: phone || null,
      source,
      status,
      assignedToId: assignedToId || null,
      notes: notes || null,
    },
  })

  revalidatePath('/dashboard/leads')
  revalidatePath(`/dashboard/leads/${id}`)
  return lead
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({
    where: { id },
  })

  revalidatePath('/dashboard/leads')
}

export async function convertLeadToCustomer(leadId: string, formData: FormData) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error('Lead not found')

  const company = formData.get('company') as string | null
  const industry = formData.get('industry') as string | null

  // Create customer from lead
  const customer = await prisma.customer.create({
    data: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: company || null,
      industry: industry || null,
      convertedFromId: leadId,
    },
  })

  // Update lead status
  await prisma.lead.update({
    where: { id: leadId },
      data: { status: 'CONVERTED' },
  })

  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard/leads')
  return customer
}

