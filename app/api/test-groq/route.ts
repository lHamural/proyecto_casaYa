// app/api/test-groq/route.ts
export const runtime = 'nodejs'  // ← Agregar al inicio

import { NextResponse } from 'next/server'
import { groq } from '@/lib/groq'

export async function GET() {
  console.log('🔵 GET /api/test-groq llamado')
  console.log('🔑 API Key:', process.env.GROQ_API_KEY ? '✅ Presente' : '❌ Ausente')
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres un asistente amable.' },
        { role: 'user', content: 'Hola, responde con una frase corta' }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 50,
    })

    console.log('✅ Respuesta recibida')
    
    return NextResponse.json({ 
      success: true, 
      respuesta: completion.choices[0]?.message?.content 
    })
  } catch (error: any) {
    console.error('❌ Error en test-groq:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.error || null
    }, { status: 500 })
  }
}