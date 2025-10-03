import { convertToModelMessages, type UIMessage } from 'ai'
import { demoAgent } from '@/lib/chat/agents/demo-agent'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // Convert UIMessages to ModelMessages for the agent
  const modelMessages = convertToModelMessages(messages)

  // Stream the agent response with tool support
  const result = demoAgent.stream({
    messages: modelMessages,
  })

  // Consume stream to handle client disconnects gracefully
  result.consumeStream()

  // Return UIMessage stream response for proper client-side handling
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
  })
}

