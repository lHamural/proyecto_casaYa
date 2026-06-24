// test-groq.ts
import { config } from 'dotenv'
import { resolve } from 'path'

// ✅ 1. PRIMERO cargar .env
config({ path: resolve(process.cwd(), '.env') })

// ✅ 2. Verificar que se cargó
console.log('📌 GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Existe' : '❌ No existe')
console.log('📌 Valor:', process.env.GROQ_API_KEY?.substring(0, 10) + '...')

// ✅ 3. AHORA importar groq (después de configurar .env)
import { groq } from './lib/groq'

async function test() {
  try {
    console.log('🔑 Probando conexión a Groq...')
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres un asistente amable.' },
        { role: 'user', content: 'Hola, ¿cómo estás?' }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 100,
    })

    console.log('✅ Respuesta:', completion.choices[0]?.message?.content)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.status) console.log('Status:', error.status)
    if (error.error) console.log('Detalle:', JSON.stringify(error.error, null, 2))
  }
}

test()