// components/web/LikeButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'

interface LikeButtonProps {
  propertyId: string
  initialLikes: number
}

export function LikeButton({ propertyId, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [loading, setLoading] = useState(false)
  const [showLoginMessage, setShowLoginMessage] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchLikeStatus()
    }
  }, [session])

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`/api/propiedades/${propertyId}/like`)
      const data = await res.json()
      setLiked(data.liked)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLike = async () => {
    if (!session?.user) {
      setShowLoginMessage(true)
      setTimeout(() => setShowLoginMessage(false), 5000)
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(`/api/propiedades/${propertyId}/like`, {
        method: 'POST',
      })
      const data = await res.json()
      setLiked(data.liked)
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant={liked ? 'default' : 'ghost'}
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={`gap-2 ${liked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
        )}
        {likesCount}
      </Button>

      {showLoginMessage && (
        <div className="absolute top-full left-0 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-sm whitespace-nowrap shadow-lg z-10">
          <span>
            Debes <a href="/login" className="font-semibold underline hover:text-amber-800">iniciar sesión</a> para dar like
          </span>
        </div>
      )}
    </div>
  )
} 