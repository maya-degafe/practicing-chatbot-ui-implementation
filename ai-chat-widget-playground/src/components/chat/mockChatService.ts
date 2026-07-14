export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MOCK_RESPONSES: string[] = [
  "That's a great question! I'm a mock AI assistant here to demonstrate the chat widget UI.",
  "I understand. While I can't actually process your request right now, this interface shows how a real AI chat would look.",
  "Interesting! In a production environment, this would be handled by a real language model API such as OpenAI's GPT.",
  "Thanks for trying the playground! Feel free to type anything — I'll do my best to respond helpfully.",
  "I'm currently running in mock mode. Connect a real AI API via the VITE_OPENAI_API_KEY environment variable to get live responses.",
  "That's a fascinating topic. A fully integrated AI assistant could provide detailed information on that subject.",
  "Good point! This chat widget supports message history, streaming-style responses, and a clean UI — all ready for a real backend.",
]

let responseIndex = 0

function getNextMockResponse(): string {
  const response = MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length]
  responseIndex++
  return response
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export async function sendMessage(
  _userMessage: string,
  _history: Message[],
): Promise<Message> {
  // Simulate network latency
  const delay = 600 + Math.random() * 800
  await new Promise((resolve) => setTimeout(resolve, delay))

  // In a real implementation, this would call the OpenAI API using
  // import.meta.env.VITE_OPENAI_API_KEY and pass _history as context.
  const content = getNextMockResponse()

  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
  }
}

export function createUserMessage(content: string): Message {
  return {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
}
