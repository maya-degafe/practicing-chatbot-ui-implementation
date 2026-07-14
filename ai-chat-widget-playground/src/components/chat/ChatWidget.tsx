import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Message, sendMessage, createUserMessage } from './mockChatService'
import './chatWidget.css'

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [inputValue])

  async function handleSend() {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    const userMsg = createUserMessage(trimmed)
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const assistantMsg = await sendMessage(trimmed, messages)
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Failed to get response:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value)
  }

  const canSend = inputValue.trim().length > 0 && !isLoading

  return (
    <div className="chat-widget" role="main" aria-label="AI Chat Widget">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-avatar" aria-hidden="true">🤖</div>
        <div className="chat-header-info">
          <div className="chat-header-name">AI Assistant</div>
          <div className={`chat-header-status${isLoading ? ' typing' : ''}`}>
            {isLoading ? 'Typing…' : 'Online'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && !isLoading && (
          <div className="chat-empty">
            <span className="chat-empty-icon" aria-hidden="true">💬</span>
            <p>Send a message to start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.role}`}
            role="article"
            aria-label={`${msg.role === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`}
          >
            <div className="chat-message-bubble">{msg.content}</div>
            <time className="chat-message-time" dateTime={msg.timestamp.toISOString()}>
              {formatTime(msg.timestamp)}
            </time>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant" aria-label="AI Assistant is typing">
            <div className="typing-indicator" aria-hidden="true">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          rows={1}
          aria-label="Message input"
          disabled={isLoading}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          title="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
