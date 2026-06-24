// app/(private)/suscriptor/layout.tsx
import { DashboardLayout } from '@/components/dashboard'
import '@/app/styles/dashboard.css'
export const dynamic = 'force-dynamic'
import { 
  faChartPie,
  faHome,
  faHistory,
  faCrown,
  faUser
} from '@fortawesome/free-solid-svg-icons'

const suscriptorMenuItems = [
  { 
    title: 'Dashboard', 
    icon: faChartPie, 
    href: '/suscriptor', 
    exact: true 
  },
  { 
    title: 'Mis Propiedades', 
    icon: faHome, 
    href: '/suscriptor/propiedades' 
  },
  { 
    title: 'Historial', 
    icon: faHistory, 
    href: '/suscriptor/historial' 
  },
  { 
    title: 'Suscripcion', 
    icon: faCrown, 
    href: '/suscriptor/suscripcion' 
  },
  { 
    title: 'Perfil', 
    icon: faUser, 
    href: '/suscriptor/perfil' 
  },
]

export default function SuscriptorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout menuItems={suscriptorMenuItems} title="casaYa">
      {children}
    </DashboardLayout>
  )
}