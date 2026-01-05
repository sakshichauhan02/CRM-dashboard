import { PrismaClient } from '@prisma/client'

// Define enum values as constants for SQLite compatibility
const Role = { ADMIN: 'ADMIN', MANAGER: 'MANAGER', SALES: 'SALES' }
const LeadStatus = { NEW: 'NEW', CONTACTED: 'CONTACTED', QUALIFIED: 'QUALIFIED', LOST: 'LOST', CONVERTED: 'CONVERTED' }
const LeadSource = { WEBSITE: 'WEBSITE', REFERRAL: 'REFERRAL', ADS: 'ADS', COLD_CALL: 'COLD_CALL' }
const DealStage = { PROSPECT: 'PROSPECT', PROPOSAL: 'PROPOSAL', NEGOTIATION: 'NEGOTIATION', WON: 'WON', LOST: 'LOST' }
const TaskStatus = { PENDING: 'PENDING', COMPLETED: 'COMPLETED' }
const ActivityType = { CALL: 'CALL', EMAIL: 'EMAIL', MEETING: 'MEETING', NOTE: 'NOTE', OTHER: 'OTHER' }
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@crm.com' },
    update: {},
    create: {
      email: 'manager@crm.com',
      name: 'Manager User',
      password: hashedPassword,
      role: 'MANAGER',
    },
  })

  const sales1 = await prisma.user.upsert({
    where: { email: 'sales1@crm.com' },
    update: {},
    create: {
      email: 'sales1@crm.com',
      name: 'Sales Person 1',
      password: hashedPassword,
      role: 'SALES',
    },
  })

  const sales2 = await prisma.user.upsert({
    where: { email: 'sales2@crm.com' },
    update: {},
    create: {
      email: 'sales2@crm.com',
      name: 'Sales Person 2',
      password: hashedPassword,
      role: 'SALES',
    },
  })

  // Create leads
  const leads = []
  for (let i = 0; i < 20; i++) {
    const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'CONVERTED']
    const sources = ['WEBSITE', 'REFERRAL', 'ADS', 'COLD_CALL']
    const assignedTo = i % 2 === 0 ? sales1.id : sales2.id

    const lead = await prisma.lead.create({
      data: {
        name: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: `+123456789${i}`,
        source: sources[i % sources.length],
        status: statuses[i % statuses.length],
        assignedToId: assignedTo,
        notes: `This is a sample lead number ${i + 1}`,
      },
    })
    leads.push(lead)
  }

  // Create customers
  const customers = []
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+198765432${i}`,
        company: `Company ${i + 1}`,
        industry: ['Technology', 'Healthcare', 'Finance', 'Retail'][i % 4],
        totalDealValue: (i + 1) * 5000,
        status: i % 3 === 0 ? 'INACTIVE' : 'ACTIVE',
        convertedFromId: i < leads.length ? leads[i].id : null,
      },
    })
    customers.push(customer)
  }

  // Create deals
  const deals = []
  for (let i = 0; i < 15; i++) {
    const stages = ['PROSPECT', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']
    const assignedTo = i % 2 === 0 ? sales1.id : sales2.id
    const customer = customers[i % customers.length]

    const deal = await prisma.deal.create({
      data: {
        name: `Deal ${i + 1}`,
        value: (i + 1) * 10000,
        stage: stages[i % stages.length],
        expectedCloseDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
        assignedToId: assignedTo,
        customerId: customer.id,
        leadId: i < leads.length ? leads[i].id : null,
      },
    })
    deals.push(deal)
  }

  // Create tasks
  for (let i = 0; i < 15; i++) {
    const statuses = ['PENDING', 'COMPLETED']
    const assignedTo = i % 2 === 0 ? sales1.id : sales2.id

    await prisma.task.create({
      data: {
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        status: statuses[i % statuses.length],
        dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        assignedToId: assignedTo,
        leadId: i < leads.length ? leads[i].id : null,
        customerId: i < customers.length ? customers[i].id : null,
        dealId: i < deals.length ? deals[i].id : null,
      },
    })
  }

  // Create activities
  for (let i = 0; i < 20; i++) {
    const types = ['CALL', 'EMAIL', 'MEETING', 'NOTE']
    const createdBy = i % 2 === 0 ? sales1.id : sales2.id

    await prisma.activity.create({
      data: {
        type: types[i % types.length],
        title: `${types[i % types.length]} Activity ${i + 1}`,
        description: `Description for activity ${i + 1}`,
        activityDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        createdById: createdBy,
        leadId: i < leads.length ? leads[i].id : null,
        customerId: i < customers.length ? customers[i].id : null,
        dealId: i < deals.length ? deals[i].id : null,
      },
    })
  }

  // Create notifications
  await prisma.notification.create({
    data: {
      title: 'Welcome to CRM',
      message: 'Your account has been set up successfully',
      userId: sales1.id,
      link: '/dashboard',
    },
  })

  console.log('Seeding completed!')
  console.log('Default login credentials:')
  console.log('Admin: admin@crm.com / password123')
  console.log('Manager: manager@crm.com / password123')
  console.log('Sales: sales1@crm.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

