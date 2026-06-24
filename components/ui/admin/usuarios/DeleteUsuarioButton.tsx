// components/ui/admin/usuarios/DeleteUsuarioButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function DeleteUsuarioButton({
  usuarioId,
  usuarioName,
}: {
  usuarioId: string
  usuarioName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/usuarios/${usuarioId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setOpen(false)
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-gray-200 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              ¿Eliminar a {usuarioName}?
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Esta acción eliminará al usuario y todos sus datos asociados
            (propiedades, comentarios, favoritos). No se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4" />
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl px-6 border-gray-200 text-primary transition-colors"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl px-6 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              'Sí, eliminar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}