// lib/groq.ts
import Groq from 'groq-sdk'

// ✅ Verificar que la variable existe
if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY no está configurada en el entorno')
  console.warn('📌 Revisa tu archivo .env o .env.local')
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

console.log('✅ Groq inicializado con API Key:', process.env.GROQ_API_KEY ? '✅ Presente' : '❌ Ausente')