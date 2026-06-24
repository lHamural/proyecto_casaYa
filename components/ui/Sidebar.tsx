// components/ui/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  title: string
  icon: string
  href?: string
  items?: MenuItem[]
  permission?: string
}

function SidebarMenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const isActive = item.href ? pathname === item.href : false

  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
            ${isActive
              ? 'bg-white/10 text-white font-medium'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
        >
          <span>{item.icon}</span>
          <span>{item.title}</span>
        </Link>
      ) : (
        <div className="px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
          {item.title}
        </div>
      )}
      {item.items?.map(subItem => (
        <SidebarMenuItem key={subItem.title} item={subItem} pathname={pathname} />
      ))}
    </div>
  )
}

export function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#001c40] min-h-screen">
      <nav>
        {menuItems.map(item => (
          <SidebarMenuItem key={item.title} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  )
}