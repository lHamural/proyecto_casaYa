'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2,
  Sparkles,
  Home,
  Search,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
}

const STORAGE_KEY = 'casaya_chat_messages'

export function Chatbot() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch { }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const mensaje = input.trim()
    setInput('')
    setLoading(true)

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: mensaje,
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Enviar historial completo para mantener contexto de conversación
      const historial = messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial }),
      })

      if (!res.ok) throw new Error('Error en el servidor')

      const data = await res.json()

      if (data.respuesta) {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          role: 'bot',
          content: data.respuesta,
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: `bot_error_${Date.now()}`,
        role: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const sugerencias = [
    { icon: Home, label: 'Buscar propiedades', action: '¿Cómo busco propiedades?' },
    { icon: Search, label: 'Publicar propiedad', action: '¿Cómo publico mi propiedad?' },
    { icon: Phone, label: 'Contactar', action: '¿Cómo contacto al vendedor?' },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[500px] max-h-[80vh]'
      }`}>
        <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Asistente Virtual</p>
              <p className="text-xs text-white/70">Siempre disponible</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 h-[340px] bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold text-gray-700">¡Hola! Soy tu asistente</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Pregúntame sobre propiedades, publicación, precios o lo que necesites saber.
                  </p>
                  
                  <div className="mt-4 space-y-2 w-full">
                    {sugerencias.map((sug) => (
                      <button
                        key={sug.label}
                        onClick={() => {
                          setInput(sug.action)
                          setTimeout(handleSend, 100)
                        }}
                        className="w-full text-left text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-primary transition-colors flex items-center gap-2"
                      >
                        <sug.icon className="w-4 h-4 text-primary" />
                        <span>{sug.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.role === 'bot' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}>
                          {msg.role === 'bot' ? '🤖' : getInitials(session?.user?.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-white border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary">🤖</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-tl-none">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  disabled={loading}
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
