// components/dashboard/DashboardLayoutClient.tsx
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { DashboardFooter } from './DashboardFooter'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboarSidebar'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface MenuItem {
  title: string
  icon: IconDefinition | string
  href?: string
  exact?: boolean
  key?: string
  items?: { title: string; href: string; icon: string }[]
}

interface DashboardLayoutClientProps {
  children: React.ReactNode
  menuItems: MenuItem[]
  title: string
}

export function DashboardLayout({ 
  children, 
  menuItems, 
  title 
}: DashboardLayoutClientProps) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const user = session?.user
  const userName = user?.name || user?.email?.split('@')[0] || 'Usuario'
  const userRole = user?.role || 'SUSCRIPTOR'
  const userInitial = userName.charAt(0).toUpperCase()

  const getCurrentTitle = () => {
    return title
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="layout-wrapper">
      {/* Overlay para móvil */}
      <div 
        className={`overlay-mobile ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <DashboardSidebar
        menuItems={menuItems}
        title={title}
        userName={userName}
        userRole={userRole}
        userInitial={userInitial}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="main-container">
        <DashboardHeader 
          title={getCurrentTitle()} 
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="dashboard-main">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}