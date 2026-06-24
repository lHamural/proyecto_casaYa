// app/dashboard/layout.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react' // 👈 Importar signOut
import '@/app/styles/dashboard.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession() // 👈 status para saber si está cargando
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['planes'])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  // Datos del usuario desde la sesión
  const user = session?.user
  const userName = user?.name || user?.email?.split('@')[0] || 'Usuario'
  const userEmail = user?.email || ''
  const userRole = user?.role || 'SUSCRIPTOR'
  const userInitial = userName.charAt(0).toUpperCase()

  // Formatear rol para mostrar
  const getRoleDisplay = (role: string) => {
    const roles: Record<string, string> = {
      'SUPERADMIN': 'Super Administrador',
      'ADMIN': 'Administrador',
      'SUSCRIPTOR': 'Suscriptor',
    }
    return roles[role] || role?.toLowerCase() || 'Usuario'
  }

  // Manejar cierre de sesión
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const menuItems = [
    // ... tus items del menú (sin cambios)
    {
      title: 'Dashboard',
      icon: '📊',
      href: '/dashboard',
      exact: true,
    },
    {
      title: 'Planes',
      icon: '📦',
      key: 'planes',
      items: [
        { title: 'Todos los planes', href: '/dashboard/planes', icon: '📋' },
        { title: 'Crear plan', href: '/dashboard/planes/crear', icon: '➕' },
        { title: 'Categorías', href: '/dashboard/planes/categorias', icon: '🏷️' },
      ],
    },
    {
      title: 'Usuarios',
      icon: '👥',
      key: 'usuarios',
      items: [
        { title: 'Lista de usuarios', href: '/dashboard/usuarios', icon: '📋' },
        { title: 'Roles', href: '/dashboard/usuarios/roles', icon: '👑' },
        { title: 'Permisos', href: '/dashboard/usuarios/permisos', icon: '🔑' },
      ],
    },
    {
      title: 'Ventas',
      icon: '💰',
      key: 'ventas',
      items: [
        { title: 'Órdenes', href: '/dashboard/ventas', icon: '🛒' },
        { title: 'Reportes', href: '/dashboard/ventas/reportes', icon: '📈' },
        { title: 'Clientes', href: '/dashboard/clientes', icon: '👤' },
      ],
    },
    {
      title: 'Configuración',
      icon: '⚙️',
      href: '/dashboard/configuracion',
    },
  ]

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  // Mostrar loading mientras carga la sesión
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

  const notifications = [
    { id: 1, title: 'Nuevo usuario registrado', time: 'Hace 5 minutos', icon: '👤', read: false },
    { id: 2, title: 'Plan actualizado', time: 'Hace 1 hora', icon: '📦', read: false },
    { id: 3, title: 'Pago recibido', time: 'Hace 3 horas', icon: '💰', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Overlay para móvil */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar fixed top-0 left-0 h-full w-72 z-50 transition-sidebar lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="dashboard-sidebar-header p-4 pb-3 border-b flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            🏠
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight">Mi Panel</h1>
            <p className="text-xs opacity-80 leading-tight mt-1">Sistema Administrativo</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="py-2 overflow-y-auto h-[calc(100vh-140px)]">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key!)}
                    className={`w-[calc(100%-16px)] mx-2 flex items-center justify-between px-5 py-2 my-1 rounded-2xl dashboard-sidebar-menu-item ${
                      expandedMenus.includes(item.key!) ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="opacity-70">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className={`opacity-50 transition-transform duration-300 ${
                      expandedMenus.includes(item.key!) ? 'rotate-90' : ''
                    }`}>
                      ▶
                    </span>
                  </button>
                  
                  <div className={`overflow-hidden transition-menu ${
                    expandedMenus.includes(item.key!) ? 'max-h-96 py-2' : 'max-h-0'
                  }`}>
                    <div className="ml-4">
                      {item.items.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-5 py-2 my-1 mx-2 rounded-2xl w-[calc(100%-16px)] dashboard-sidebar-submenu-item ${
                            isActive(subitem.href)
                              ? 'dashboard-sidebar-submenu-item-active'
                              : 'opacity-70'
                          }`}
                        >
                          <span className="text-sm">{subitem.icon}</span>
                          <span className="text-sm">{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-5 py-2 my-1 mx-2 rounded-2xl w-[calc(100%-16px)] dashboard-sidebar-menu-item ${
                    isActive(item.href!, item.exact)
                      ? 'dashboard-sidebar-menu-item-active'
                      : 'opacity-70'
                  }`}
                >
                  <span className="opacity-70">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer - Aquí se muestran los datos del usuario */}
        <div className="dashboard-sidebar-footer absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            {/* Avatar con inicial del usuario */}
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg font-medium">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs opacity-75 truncate">{getRoleDisplay(userRole)}</p>
            </div>
            {/* Botón de cerrar sesión */}
            <button 
              onClick={handleLogout}
              className="opacity-70 hover:opacity-100 transition-opacity"
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="dashboard-topbar sticky top-0 z-40 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-2xl cursor-pointer"
              >
                ☰
              </button>
              <h1 className="text-xl lg:text-2xl font-semibold">
                {menuItems.find(item => 
                  item.href === pathname || 
                  item.items?.some(sub => sub.href === pathname)
                )?.title || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications Dropdown */}
              <div className="relative" ref={el => { dropdownRefs.current['notifications'] = el }}>
                <button
                  onClick={() => toggleDropdown('notifications')}
                  className="relative p-2 rounded-full dashboard-topbar-button focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="notification-badge absolute top-1 right-1 min-w-[17px] h-[17px] flex items-center justify-center text-xs font-bold rounded-full border-2 shadow-md animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {openDropdown === 'notifications' && (
                  <div className="notification-dropdown absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="notification-header px-4 py-3 flex justify-between items-center">
                      <span className="font-semibold">Notificaciones</span>
                      <span className="text-xs px-2 py-1 rounded-full border border-white">
                        {unreadCount} nuevas
                      </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`notification-item flex items-start gap-3 p-3 transition-colors ${
                            !notif.read ? 'notification-item-unread' : ''
                          }`}
                        >
                          <span className="text-xl">{notif.icon}</span>
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.read ? 'font-semibold' : ''}`}>
                              {notif.title}
                            </p>
                            <small className="text-xs opacity-60">{notif.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href="/dashboard/notificaciones"
                      className="block text-center py-3 font-semibold transition-colors hover:bg-black/5 notification-dropdown border-t border-secondary/30"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Ver todas las notificaciones
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/dashboard/configuracion"
                className="p-2 rounded-full dashboard-topbar-button text-xl"
              >
                ⚙️
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="dashboard-footer text-right py-4 px-6 border-t text-sm">
          <div className="container mx-auto">
            <p>
              © 2024 Mi Panel - 
              <Link href="/dashboard/terminos" className="dashboard-footer-link transition-all">
                Términos y condiciones
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}