'use server'

import { prisma } from '@/lib/db'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function processChatMessage(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase().trim()

  // Check for user/sales person queries
  if (lowerMessage.includes('user') || lowerMessage.includes('sales person') || lowerMessage.includes('salesperson') || lowerMessage.includes('employee') || lowerMessage.includes('who is') || lowerMessage.includes('show me')) {
    // Try to extract name from message - handle various patterns
    const patterns = [
      /(?:user|sales person|salesperson|employee|details of|info about|tell me about|who is|show me|information about)\s+([a-zA-Z\s]+)/i,
      /(?:about|for)\s+([a-zA-Z\s]+)/i,
      /^([a-zA-Z\s]+)$/i, // Just a name
    ]
    
    let searchName: string | null = null
    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match && match[1]) {
        searchName = match[1].trim()
        // Filter out common words that aren't names
        if (!['the', 'a', 'an', 'all', 'list', 'show', 'get', 'find'].includes(searchName.toLowerCase())) {
          break
        }
      }
    }
    
    if (searchName && searchName.length > 1) {
      const user = await prisma.user.findFirst({
        where: {
          name: {
            contains: searchName,
          },
        },
        include: {
          _count: {
            select: {
              assignedLeads: true,
              assignedDeals: true,
              assignedTasks: true,
            },
          },
        },
      })

      if (user) {
        return `**${user.name}** (${user.email})\n\n` +
          `Role: ${user.role}\n` +
          `Status: ${user.isActive ? 'Active' : 'Inactive'}\n` +
          `Assigned Leads: ${user._count.assignedLeads}\n` +
          `Assigned Deals: ${user._count.assignedDeals}\n` +
          `Assigned Tasks: ${user._count.assignedTasks}\n` +
          `Created: ${user.createdAt.toLocaleDateString()}`
      }
      
      // Try partial match by email
      const partialMatch = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { contains: searchName } },
          ],
        },
        include: {
          _count: {
            select: {
              assignedLeads: true,
              assignedDeals: true,
              assignedTasks: true,
            },
          },
        },
      })
      
      if (partialMatch) {
        return `**${partialMatch.name}** (${partialMatch.email})\n\n` +
          `Role: ${partialMatch.role}\n` +
          `Status: ${partialMatch.isActive ? 'Active' : 'Inactive'}\n` +
          `Assigned Leads: ${partialMatch._count.assignedLeads}\n` +
          `Assigned Deals: ${partialMatch._count.assignedDeals}\n` +
          `Assigned Tasks: ${partialMatch._count.assignedTasks}\n` +
          `Created: ${partialMatch.createdAt.toLocaleDateString()}`
      }
      
      // If no match found, show all users
      const users = await prisma.user.findMany({
        take: 10,
        select: {
          name: true,
          email: true,
          role: true,
        },
      })
      return `I couldn't find a user named "${searchName}". Here are all users:\n\n${users.map(u => `- ${u.name} (${u.email}) - ${u.role}`).join('\n')}`
    } else {
      // List all users
      const users = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        select: {
          name: true,
          email: true,
          role: true,
          isActive: true,
          _count: {
            select: {
              assignedLeads: true,
              assignedDeals: true,
            },
          },
        },
      })
      return `**All Users:**\n\n${users.map(u => 
        `- ${u.name} (${u.email}) - ${u.role} - ${u.isActive ? 'Active' : 'Inactive'} - ${u._count.assignedLeads} leads, ${u._count.assignedDeals} deals`
      ).join('\n')}`
    }
  }

  // Check for lead queries
  if (lowerMessage.includes('lead') || lowerMessage.includes('leads')) {
    const count = await prisma.lead.count()
    const byStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    })
    return `**Leads Summary:**\n\nTotal Leads: ${count}\n\nBy Status:\n${byStatus.map(s => `- ${s.status}: ${s._count}`).join('\n')}`
  }

  // Check for customer queries
  if (lowerMessage.includes('customer') || lowerMessage.includes('customers')) {
    const total = await prisma.customer.count()
    const active = await prisma.customer.count({ where: { status: 'ACTIVE' } })
    return `**Customers Summary:**\n\nTotal Customers: ${total}\nActive Customers: ${active}\nInactive Customers: ${total - active}`
  }

  // Check for deal queries
  if (lowerMessage.includes('deal') || lowerMessage.includes('deals')) {
    const total = await prisma.deal.count()
    const byStage = await prisma.deal.groupBy({
      by: ['stage'],
      _count: true,
    })
    const totalValue = await prisma.deal.aggregate({
      where: { stage: 'WON' },
      _sum: { value: true },
    })
    return `**Deals Summary:**\n\nTotal Deals: ${total}\nTotal Revenue (Won): $${Number(totalValue._sum.value || 0).toLocaleString()}\n\nBy Stage:\n${byStage.map(s => `- ${s.stage}: ${s._count}`).join('\n')}`
  }

  // Check for task queries
  if (lowerMessage.includes('task') || lowerMessage.includes('tasks')) {
    const total = await prisma.task.count()
    const pending = await prisma.task.count({ where: { status: 'PENDING' } })
    const completed = await prisma.task.count({ where: { status: 'COMPLETED' } })
    return `**Tasks Summary:**\n\nTotal Tasks: ${total}\nPending: ${pending}\nCompleted: ${completed}`
  }

  // Check for dashboard/stats queries
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('stats') || lowerMessage.includes('statistics') || lowerMessage.includes('overview')) {
    const [totalLeads, activeCustomers, openDeals, totalRevenue] = await Promise.all([
      prisma.lead.count(),
      prisma.customer.count({ where: { status: 'ACTIVE' } }),
      prisma.deal.count({ where: { stage: { not: 'WON' } } }),
      prisma.deal.aggregate({
        where: { stage: 'WON' },
        _sum: { value: true },
      }),
    ])
    return `**Dashboard Overview:**\n\n` +
      `Total Leads: ${totalLeads}\n` +
      `Active Customers: ${activeCustomers}\n` +
      `Open Deals: ${openDeals}\n` +
      `Total Revenue: $${Number(totalRevenue._sum.value || 0).toLocaleString()}`
  }

  // Check for help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `**I can help you with:**\n\n` +
      `- User/Sales Person Info: Ask about any user or sales person (e.g., "Tell me about John")\n` +
      `- Leads: Ask about leads (e.g., "How many leads do we have?")\n` +
      `- Customers: Ask about customers (e.g., "How many customers are active?")\n` +
      `- Deals: Ask about deals (e.g., "What's our total revenue?")\n` +
      `- Tasks: Ask about tasks (e.g., "How many tasks are pending?")\n` +
      `- Dashboard: Get an overview of all statistics\n\n` +
      `Try asking: "Tell me about [user name]" or "What's our dashboard overview?"`
  }

  // Default response
  return `I'm here to help you with CRM information! You can ask me about:\n\n` +
    `- Users/Sales People (e.g., "Tell me about John")\n` +
    `- Leads, Customers, Deals, Tasks\n` +
    `- Dashboard statistics\n\n` +
    `Type "help" for more information.`
}

