// app/(private)/suscriptor/layout.tsx
import { DashboardLayout } from '@/components/dashboard'
import '@/app/styles/dashboard.css'

const suscriptorMenuItems = [
  { title: 'Dashboard', icon: '📊', href: '/suscriptor', exact: true },
  { title: 'Mis Planes', icon: '📦', href: '/suscriptor/mis-planes' },
  { title: 'Mi Perfil', icon: '👤', href: '/suscriptor/perfil' },
  { title: 'Soporte', icon: '💬', href: '/suscriptor/soporte' },
]

export default function SuscriptorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout menuItems={suscriptorMenuItems} title="Mi Panel">
      {children}
    </DashboardLayout>
  )
}