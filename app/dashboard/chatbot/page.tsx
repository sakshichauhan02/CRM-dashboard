import { requireRole } from '@/lib/middleware'
import { Chatbot } from '@/components/chatbot/chatbot'

export const dynamic = 'force-dynamic'

export default async function ChatbotPage() {
  await requireRole(['ADMIN'])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chatbot Assistant</h1>
        <p className="text-gray-600">Ask me anything about your CRM data</p>
      </div>
      <Chatbot />
    </div>
  )
}

