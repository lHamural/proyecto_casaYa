// components/dashboard/DashboarSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, ChevronDown } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome,           // ← Importado aquí
  faTachometerAlt 
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
interface MenuItem {
  title: string
  icon: any
  href?: string
  exact?: boolean
  key?: string
  items?: { 
    title: string; 
    href: string; 
    icon: any 
  }[]
}

interface DashboardSidebarProps {
  menuItems: MenuItem[]
  title: string
  userName: string
  userRole: string
  userInitial: string
  onLogout: () => void
  sidebarOpen: boolean
  onCloseSidebar: () => void
}

export function DashboardSidebar({ 
  menuItems, 
  title, 
  userName, 
  userRole, 
  userInitial, 
  onLogout,
  sidebarOpen,
  onCloseSidebar
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
      'SUPERADMIN': 'Super Administrador',
      'ADMIN': 'Administrador',
      'SUSCRIPTOR': 'Suscriptor',
    }
    return roles[role] || role?.toLowerCase() || 'Usuario'
  }

  return (
    <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="dashboard-sidebar-header">
        <div className="logo-icon">
          <Image 
        src="/image/logo.png"  // Ruta a tu logo en la carpeta public
        alt="Logo"
        width={120}
        height={120}
        className="w-9 h-9 object-contain"
      />

        </div>
        <div className="logo-text">
          <h1>{title}</h1>
          <p>Panel de Control</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.key!)}
                  className={`dashboard-sidebar-menu-item ${expandedMenus.includes(item.key!) ? 'active' : ''}`}
                >
                  <div className="menu-label">
                    <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={`arrow w-4 h-4 transition-transform ${expandedMenus.includes(item.key!) ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`sidebar-submenu ${expandedMenus.includes(item.key!) ? 'show' : ''}`}>
                  {item.items.map((subitem) => (
                    <Link
                      key={subitem.title}
                      href={subitem.href}
                      onClick={onCloseSidebar}
                      className={`dashboard-sidebar-submenu-item ${isActive(subitem.href) ? 'dashboard-sidebar-submenu-item-active' : ''}`}
                    >
                      <FontAwesomeIcon icon={subitem.icon} className="menu-icon" />
                      <span>{subitem.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.href!}
                onClick={onCloseSidebar}
                className={`dashboard-sidebar-menu-item ${isActive(item.href!, item.exact) ? 'dashboard-sidebar-menu-item-active' : ''}`}
              >
                <div className="menu-label">
                  <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                  <span>{item.title}</span>
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="dashboard-sidebar-footer">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{getRoleDisplay(userRole)}</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}