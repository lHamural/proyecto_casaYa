'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AvatarUploadProps {
  avatarUrl: string | null
  userName: string
  initials?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function AvatarUpload({ avatarUrl, userName, initials }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleClick = () => inputRef.current?.click()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Formato no válido. Usa JPG, PNG o WebP')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar 2MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/usuario/avatar', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPreview(data.avatar)
      window.location.reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  const src = preview || avatarUrl

  return (
    <div className="relative">
      {src ? (
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <Image src={src} alt={userName} width={96} height={96} className="object-cover w-full h-full" />
        </div>
      ) : (
        <Avatar className="w-24 h-24">
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {initials || getInitials(userName)}
          </AvatarFallback>
        </Avatar>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        ) : (
          <Camera className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  )
}
