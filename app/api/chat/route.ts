// app/api/chat/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { groq } from '@/lib/groq'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'

console.log('🔑 GROQ_API_KEY en chat:', process.env.GROQ_API_KEY ? '✅ Presente' : '❌ Ausente')

// ✅ Mejorar el prompt del sistema
const SYSTEM_PROMPT = `Eres InmoBot, un asistente virtual experto en bienes raíces en Bolivia.

INFORMACIÓN IMPORTANTE SOBRE PROPIEDADES:
- Tipos de operación: VENTA, ALQUILER, ANTICRÉTICO
- Tipos de propiedad: CASA, DEPARTAMENTO, TERRENO, OFICINA, LOCAL COMERCIAL
- Ciudades principales: La Paz, Santa Cruz, Cochabamba, Oruro, Potosí, Chuquisaca, Tarija, Beni, Pando

PROCESO DE PUBLICACIÓN:
1. El usuario debe iniciar sesión
2. Ir a "Publicar Propiedad" en su panel
3. Completar el formulario con: título, descripción, precio, ubicación, imágenes
4. Esperar la revisión (si aplica)
5. La propiedad se publica automáticamente

PROCESO DE CONTACTO:
1. Los usuarios interesados pueden contactar al vendedor desde la página de la propiedad
2. El vendedor recibe una notificación
3. La comunicación se realiza a través de la plataforma o por teléfono/email

PRECIOS EN LA PAZ:
- Rango aproximado: $50,000 - $500,000 USD
- Depende de: ubicación, tamaño, antigüedad, características
- Zonas exclusivas: Sopocachi, Miraflores, Calacoto, San Miguel

REGLAS DE RESPUESTA:
- Sé específico y útil, NO des respuestas genéricas
- Si preguntan por precios, da rangos aproximados
- Si preguntan cómo publicar, explica el proceso paso a paso
- Si preguntan por ubicación, menciona zonas conocidas
- Si no sabes algo, sugiere contactar a un agente inmobiliario
- Usa un tono amable y profesional

RESPONDE SIEMPRE CON INFORMACIÓN CONCRETA Y ÚTIL.`

export async function POST(request: Request) {
  try {
    const { mensaje, sessionToken } = await request.json()

    console.log('📨 Mensaje recibido:', mensaje)

    if (!mensaje) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    // Buscar o crear sesión de chat
    let chatSession = await prisma.chatSession.findUnique({
      where: { sessionToken },
    })

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          sessionToken: sessionToken || `session_${Date.now()}`,
        },
      })
      console.log('✅ Nueva sesión creada:', chatSession.id)
    }

    // Guardar mensaje del usuario
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'USER',
        content: mensaje,
      },
    })

    // ✅ Obtener TODO el historial (no solo los últimos)
    const historial = await prisma.chatMessage.findMany({
      where: { sessionId: chatSession.id },
      orderBy: { createdAt: 'asc' },
    })

    console.log('📜 Historial completo:', historial.length, 'mensajes')

    // ✅ Construir mensajes con TODO el contexto
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historial.map(msg => ({
        role: (msg.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    console.log('🧠 Enviando a Groq:', messages.length, 'mensajes')

    // ✅ Llamar a Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    })

    const respuesta = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu solicitud.'
    console.log('✅ Respuesta de Groq:', respuesta.substring(0, 100) + '...')

    // Guardar respuesta del bot
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'BOT',
        content: respuesta,
      },
    })

    // Obtener mensajes actualizados
    const messagesActualizados = await prisma.chatMessage.findMany({
      where: { sessionId: chatSession.id },
      orderBy: { createdAt: 'asc' },
    })

    const messagesFormateados = messagesActualizados.map(msg => ({
      id: msg.id,
      role: msg.role === 'USER' ? 'user' : 'bot',
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      messages: messagesFormateados,
      sessionToken: chatSession.sessionToken,
      newMessage: messagesFormateados[messagesFormateados.length - 1],
    })
  } catch (error) {
    console.error('❌ Error en chat:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al procesar mensaje',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}