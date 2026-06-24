// components/DashboardHeader.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold" style={{ color: '#001c40' }}>
          {title}
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              👤
            </div>
            <span>Admin</span>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}