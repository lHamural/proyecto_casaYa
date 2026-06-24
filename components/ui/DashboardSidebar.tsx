// components/DashboardSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface MenuItem {
  title: string
  icon: string
  href: string
  roles?: string[] // Roles que pueden ver este item
}

interface DashboardSidebarProps {
  menuItems: MenuItem[]
  userRole: string
}

export function DashboardSidebar({ menuItems, userRole }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  )

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300"
      style={{ backgroundColor: '#001c40' }}
    >
      <div className="p-4 border-b border-white/20">
        <h2 className="text-white text-xl font-bold">MiPanel</h2>
        <p className="text-white/60 text-sm">
          {userRole === 'SUPERADMIN' ? 'Administrador' : 'Mi Cuenta'}
        </p>
      </div>

      <nav className="p-2 mt-4">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 my-1 rounded-lg transition-all hover:bg-white/10 ${
              pathname === item.href ? 'bg-white/20' : ''
            }`}
          >
            <span className="text-white/70">{item.icon}</span>
            <span className="text-white">{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}