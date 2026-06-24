// components/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  title: string
  icon: string
  href?: string
  items?: MenuItem[]
  permission?: string // Para control de permisos
}

export function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()
  
  return (
    <aside className="w-64 bg-[#001c40] min-h-screen">
      <nav>
        {menuItems.map(item => (
          <MenuItem key={item.title} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  )
}