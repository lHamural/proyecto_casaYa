// test-groq-simple.js
import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ✅ Cargar .env
config({ path: resolve(__dirname, '.env') })

console.log('📌 GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Existe' : '❌ No existe')

// ✅ Crear cliente de Groq directamente
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function test() {
  try {
    console.log('🔑 Probando...')
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres un asistente amable.' },
        { role: 'user', content: 'Hola' }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 50,
    })

    console.log('✅ Respuesta:', completion.choices[0]?.message?.content)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

test()