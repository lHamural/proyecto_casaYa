// components/dashboard/DashboardLayoutClient.tsx
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
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
  const userAvatar = (user as any)?.image || null
  const userInitial = userName.charAt(0).toUpperCase()

  const getCurrentTitle = () => {
    return title
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <div className="text-center">
          <Image
            src="/image/logo.png"
            alt="CasaYa"
            width={80}
            height={80}
            className="mx-auto mb-6 animate-pulse"
            priority
          />
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
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
        userAvatar={userAvatar}
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