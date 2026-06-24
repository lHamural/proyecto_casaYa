// app/(public)/components/Pagination.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/full-propiedades?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page = i + 1
          if (totalPages > 5 && currentPage > 3) {
            page = currentPage - 2 + i
          }
          if (page > totalPages) return null
          return (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}