// app/(private)/suscriptor/layout.tsx
import { DashboardLayout } from '@/components/dashboard'
import '@/app/styles/dashboard.css'
export const dynamic = 'force-dynamic'
import { 
  faTachometerAlt,
  faHome,
  faCrown,
  faBox,
  faUserPlus,
  faUsers,
  faHistory,
  faChartLine,
  faUser 
} from '@fortawesome/free-solid-svg-icons'

const suscriptorMenuItems = [
  { title: 'Dashboard', icon: faTachometerAlt, href: '/admin', exact: true },
  { title: 'Propiedades', icon: faHome, href: '/admin/propiedades' },
  { title: 'Suscripcion', icon: faCrown, href: '/admin/suscripcion' },
  { title: 'Planes', icon: faBox, href: '/admin/planes' },
  { title: 'Asignacion', icon: faUserPlus, href: '/admin/asignacion' },
  { title: 'Usuarios', icon: faUsers, href: '/admin/usuarios' },
  { title: 'Historial', icon: faHistory, href: '/admin/historial' },
  { title: 'Reportes', icon: faChartLine, href: '/admin/reportes' },
  { title: 'Perfil', icon: faUser, href: '/admin/perfil' },
]

export default function SuscriptorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout menuItems={suscriptorMenuItems} title="CasaYa">
      {children}
    </DashboardLayout>
  )
}