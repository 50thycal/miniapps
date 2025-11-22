import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { user_fid, message, history } = body

    if (!user_fid) {
      return NextResponse.json(
        { ok: false, error: 'Missing user_fid' },
        { status: 400 },
      )
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid message' },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: 'OpenAI API key not configured' },
        { status: 500 },
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build messages array for OpenAI
    const messages: Array<{
      role: 'system' | 'user' | 'assistant'
      content: string
    }> = [
      {
        role: 'system',
        content:
          'You are a friendly and helpful AI companion. You are supportive, enthusiastic, and enjoy chatting with your human friend. Keep your responses concise and engaging.',
      },
    ]

    // Add history if provided
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          })
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    // Create streaming response from OpenAI
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0.8,
      max_tokens: 500,
    })

    // Create a ReadableStream that forwards OpenAI's stream in SSE format
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk)
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Return streaming response
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    )
  }
}
