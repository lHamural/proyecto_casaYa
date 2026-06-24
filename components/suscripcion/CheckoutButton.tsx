// components/suscripcion/CheckoutButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { stripePromise } from '@/lib/stripe-client'

interface CheckoutButtonProps {
  planId: string
  planName: string
  price: number
  children: React.ReactNode
}

export function CheckoutButton({ planId, planName, price, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Procesando...' : children}
    </Button>
  )
}