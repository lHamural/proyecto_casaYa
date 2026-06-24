// app/api/chat/historial/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionToken = searchParams.get('sessionToken')

    if (!sessionToken) {
      return NextResponse.json({ messages: [] })
    }

    const chatSession = await prisma.chatSession.findUnique({
      where: { sessionToken },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20,
        },
      },
    })

    if (!chatSession) {
      return NextResponse.json({ messages: [] })
    }

    const messages = chatSession.messages.map(msg => ({
      id: msg.id,
      role: msg.role === 'USER' ? 'user' : 'bot',
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ messages: [] })
  }
}