// components/dashboard/DashboardHeader.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Bell, Settings } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  onMenuClick: () => void
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
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

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const notifications = [
    { id: 1, title: 'Nuevo usuario registrado', time: 'Hace 5 minutos', icon: '👤', read: false },
    { id: 2, title: 'Plan actualizado', time: 'Hace 1 hora', icon: '📦', read: false },
    { id: 3, title: 'Pago recibido', time: 'Hace 3 horas', icon: '💰', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button 
          className="btn-menu-mobile" 
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        {/* Notificaciones */}
        <div className="topbar-action-dropdown" ref={el => { dropdownRefs.current['notifications'] = el }}>
          <button
            onClick={() => toggleDropdown('notifications')}
            className="topbar-action-toggle"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="topbar-action-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {openDropdown === 'notifications' && (
            <div className={`topbar-action-menu ${openDropdown === 'notifications' ? 'is-open' : ''}`}>
              <div className="topbar-action-menu-head">
                <span>Notificaciones</span>
                <span className="topbar-action-new-count">
                  {unreadCount} nuevas
                </span>
              </div>
              <div>
                {notifications.map(notif => (
                  <div key={notif.id} className="topbar-action-item">
                    <i>{notif.icon}</i>
                    <div className="topbar-action-item-content">
                      <strong>{notif.title}</strong>
                      <small>{notif.time}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/notificaciones"
                className="topbar-action-item topbar-action-view-all"
                onClick={() => setOpenDropdown(null)}
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>

        <Link href="/perfil" className="topbar-action-toggle">
          <Settings size={20} />
        </Link>
      </div>
    </header>
  )
}