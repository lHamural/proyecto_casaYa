// components/web/Comentarios.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Send, MessageCircle, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Comentario {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string | null
  }
  replies: Comentario[]
  _count: {
    replies: number
  }
}

interface ComentariosProps {
  propertyId: string
}

export function Comentarios({ propertyId }: ComentariosProps) {
  const { data: session } = useSession()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [sending, setSending] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showLoginMessage, setShowLoginMessage] = useState(false)

  useEffect(() => {
    cargarComentarios()
  }, [propertyId])

  const cargarComentarios = async () => {
    try {
      const res = await fetch(`/api/propiedades/${propertyId}/comentarios`)
      const data = await res.json()
      setComentarios(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      setShowLoginMessage(true)
      setTimeout(() => setShowLoginMessage(false), 5000)
      return
    }

    if (!newComment.trim()) return

    setSending(true)
    try {
      const res = await fetch(`/api/propiedades/${propertyId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, parentId: null }),
      })

      if (res.ok) {
        const nuevoComentario = await res.json()
        setComentarios(prev => {
          // Asegurar que el nuevo comentario tenga la estructura correcta
          const comentarioConEstructura = {
            ...nuevoComentario,
            _count: nuevoComentario._count || { replies: 0 },
            replies: nuevoComentario.replies || [],
          }
          return [comentarioConEstructura, ...prev]
        })
        setNewComment('')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSending(false)
    }
  }

  const handleResponder = async (comentarioId: string) => {
    if (!session?.user) {
      setShowLoginMessage(true)
      setTimeout(() => setShowLoginMessage(false), 5000)
      return
    }

    if (!replyContent.trim()) return

    try {
      const res = await fetch(`/api/propiedades/${propertyId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, parentId: comentarioId }),
      })

      if (res.ok) {
        const nuevaRespuesta = await res.json()
        setComentarios(prev => 
          prev.map(c => 
            c.id === comentarioId 
              ? { 
                  ...c, 
                  replies: [...c.replies, nuevaRespuesta],
                  _count: { replies: c._count.replies + 1 }
                }
              : c
          )
        )
        setReplyContent('')
        setReplyTo(null)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showLoginMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            Debes <a href="/login" className="font-semibold underline hover:text-amber-800">iniciar sesión</a> para comentar.
          </span>
        </div>
      )}

      {/* Input de comentario */}
      <form onSubmit={handleComentar} className="flex gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarFallback>
            {session?.user?.name ? getInitials(session.user.name) : '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder={session?.user ? "Escribe un comentario..." : "Inicia sesión para comentar"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!session?.user || sending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!session?.user || sending || !newComment.trim()}
            size="sm"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </form>

      {/* Comentarios */}
      <div className="space-y-4">
        {comentarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              {/* Comentario principal */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(comentario.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{comentario.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comentario.createdAt), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comentario.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => {
                        if (!session?.user) {
                          setShowLoginMessage(true)
                          setTimeout(() => setShowLoginMessage(false), 5000)
                          return
                        }
                        setReplyTo(replyTo === comentario.id ? null : comentario.id)
                      }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Responder
                    </button>
                    {comentario._count?.replies > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {comentario._count.replies} {comentario._count.replies === 1 ? 'respuesta' : 'respuestas'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Respuestas */}
              {comentario.replies && comentario.replies.length > 0 && (
                <div className="ml-10 space-y-3 border-l-2 border-gray-200 pl-4">
                  {comentario.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(reply.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs">{reply.user.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </span>
                        </div>
                        <p className="text-xs mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input de respuesta */}
              {replyTo === comentario.id && (
                <div className="ml-10 flex gap-2">
                  <Input
                    placeholder="Escribe una respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1 text-sm"
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleResponder(comentario.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}