'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

type Props = {
  fid: number
}

export function ChatCard({ fid }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message immediately
    const newMessages = [
      ...messages,
      { role: 'user' as const, content: userMessage, timestamp: Date.now() },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_fid: fid,
          message: userMessage,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      // Add an empty assistant message that we'll update as we stream
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '', timestamp: Date.now() },
      ])

      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                assistantContent += content
                // Update the last message (assistant) with accumulated content
                setMessages((prev) => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                    timestamp: lastMessage.timestamp,
                  }
                  return updated
                })
              }
            } catch (_e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (_error) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <section
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        Chat with Your AI Pet
      </h2>

      {/* Messages area */}
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          marginBottom: '12px',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              textAlign: 'center',
              marginTop: '160px',
            }}
          >
            Start chatting with your AI companion!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.timestamp}
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent:
                message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor:
                  message.role === 'user' ? '#3b82f6' : '#e5e7eb',
                color: message.role === 'user' ? 'white' : '#1f2937',
                wordWrap: 'break-word',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: isLoading ? '#f3f4f6' : 'white',
          }}
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            borderRadius: '8px',
            backgroundColor: isLoading || !input.trim() ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && input.trim()) {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </section>
  )
}
