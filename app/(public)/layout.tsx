// app/(website)/layout.tsx
'use client'
export const runtime = 'nodejs'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Chatbot } from '@/components/web/Chatbot'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import '@/app/styles/website.css'
import Image from 'next/image'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<string[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenMobileDropdowns([])
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const toggleMobileDropdown = (title: string) => {
    setOpenMobileDropdowns(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  // ✅ Menú principal optimizado
  const menuItems = [
    { title: 'Inicio', href: '/' },
    { 
      title: 'Propiedades', 
      href: '/full-propiedades',
      dropdown: [
        { title: 'En Venta', href: '/full-propiedades?operacion=venta', description: 'Casas, departamentos, terrenos' },
        { title: 'En Alquiler', href: '/full-propiedades?operacion=alquiler', description: 'Propiedades en alquiler' },
        { title: 'Anticrético', href: '/full-propiedades?operacion=anticretico', description: 'Opciones anticrético' },
      ]
    },
    { 
      title: 'Planes', 
      href: '/precios',
    },
    { 
      title: 'Nosotros', 
      href: '/nosotros',
      dropdown: [
        { title: 'Quiénes somos', href: '/nosotros', description: 'Conoce nuestra historia' },
        { title: 'Cómo funciona', href: '/funcion', description: 'Guía paso a paso' },
      ]
    },
    { 
      title: 'Ayuda', 
      href: '/faq',
      dropdown: [
        { title: 'Preguntas Frecuentes', href: '/faq', description: 'Respuestas rápidas' },
        { title: 'Contacto', href: '/contacto', description: 'Habla con nosotros' },
      ]
    },
  ]

  // ✅ Footer organizado por secciones
  const footerSections = [
    {
      title: 'Explorar',
      links: [
        { title: 'Todas las propiedades', href: '/full-propiedades' },
        { title: 'Propiedades en venta', href: '/full-propiedades?operacion=venta' },
        { title: 'Propiedades en alquiler', href: '/full-propiedades?operacion=alquiler' },
        { title: 'Anticrético', href: '/full-propiedades?operacion=anticretico' },
      ]
    },
    {
      title: 'Planes',
      links: [
        { title: 'Ver planes', href: '/precios' },
        { title: 'Plan Gratuito', href: '/precios#gratuito' },
        { title: 'Plan Básico', href: '/precios#basico' },
        { title: 'Plan Platino', href: '/precios#platino' },
        { title: 'Plan Premium', href: '/precios#premium' },
      ]
    },
    {
      title: 'Sobre nosotros',
      links: [
        { title: 'Quiénes somos', href: '/nosotros' },
        { title: 'Cómo funciona', href: '/funcion' },
        { title: 'FAQ', href: '/faq' },
        { title: 'Contacto', href: '/contacto' },
      ]
    },
    {
      title: 'Ayuda',
      links: [
        { title: 'Preguntas Frecuentes', href: '/faq' },
        { title: 'Términos y condiciones', href: '/terminos' },
        { title: 'Política de privacidad', href: '/privacidad' },
        { title: 'Política de cookies', href: '/cookies' },
      ]
    },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  const getPanelLink = () => {
    const role = session?.user?.role
    if (role === 'SUPERADMIN') return '/admin'
    if (role === 'PROPIETARIO') return '/suscriptor'
    if (role === 'VISITANTE') return '/suscriptor'
    if (role === 'INMOBILIARIA') return '/suscriptor'
    return '/login'
  }

  const getPublishLink = () => {
    const role = session?.user?.role
    if (role === 'SUPERADMIN') return '/admin/propiedades'
    if (role === 'PROPIETARIO') return '/suscriptor/propiedades'
    if (role === 'VISITANTE') return '/suscriptor/propiedades'
    if (role === 'INMOBILIARIA') return '/suscriptor/propiedades'
    return '/login'
  }

  const getPanelText = () => {
    if (session?.user) return 'Mi Panel'
    return 'Iniciar Sesión'
  }

  return (
    <div className="website-wrapper">
      {/* Header */}
      <header className={`website-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-custom">
          <div className="header-inner">
            {/* Logo */}
            <Link href="/" className="logo">
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
                <span className="logo-title">casaYa</span>
                <span className="logo-subtitle">Tu hogar perfecto</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {menuItems.map((item) => (
                <div key={item.title} className="nav-item">
                  {item.dropdown ? (
                    <div className="dropdown">
                      <button className="dropdown-trigger">
                        {item.title} <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      <div className="dropdown-menu">
                        {item.dropdown.map((subitem) => (
                          <Link key={subitem.title} href={subitem.href} className="dropdown-item">
                            <div>
                              <div className="font-semibold">{subitem.title}</div>
                              <div className="text-xs text-gray-500">{subitem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={item.href} 
                      className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Botones de acción */}
            <div className="header-actions desktop-actions">
              {session?.user ? (
                <>
                  <Link href={getPublishLink()} className="btn-outline-light">
                    Publicar Propiedad
                  </Link>
                  <Link href={getPanelLink()} className="btn-primary-light">
                    {getPanelText()}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline-light">
                    Iniciar Sesión
                  </Link>
                  <Link href="/registro" className="btn-primary-light">
                    Registrarse
                  </Link>
                </>
              )}
              
              <button 
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-header">
            <div className="mobile-logo">
              <div className="logo-icon">🏠</div>
              <span>casaYa</span>
            </div>
            <button 
              className="mobile-nav-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mobile-nav-inner">
            {menuItems.map((item) => (
              <div key={item.title} className="mobile-nav-item">
                {item.dropdown ? (
                  <>
                    <button
                      className="mobile-dropdown-trigger"
                      onClick={() => toggleMobileDropdown(item.title)}
                    >
                      <span>{item.title}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openMobileDropdowns.includes(item.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`mobile-dropdown-items ${
                      openMobileDropdowns.includes(item.title) ? 'open' : ''
                    }`}>
                      {item.dropdown.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className="mobile-nav-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-medium">{subitem.title}</div>
                          <div className="text-xs text-gray-500">{subitem.description}</div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="mobile-nav-divider"></div>
            
            <div className="mobile-nav-buttons">
              {session?.user ? (
                <>
                  <Link 
                    href={getPublishLink()} 
                    className="mobile-outline-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Publicar Propiedad
                  </Link>
                  <Link 
                    href={getPanelLink()} 
                    className="mobile-primary-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getPanelText()}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="mobile-outline-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/registro" 
                    className="mobile-primary-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="website-main">
        {children}
      </main>

      {/* Footer optimizado */}
      <footer className="website-footer">
        <div className="container-custom">
          <div className="footer-grid">
            {/* Columna 1 - Logo e info */}
            <div className="footer-col">
              <div className="footer-logo">
                <div className="logo-icon">
                   <Image 
                        src="/image/logo.png"  // Ruta a tu logo en la carpeta public
                        alt="Logo"
                        width={120}
                        height={120}
                        className="w-9 h-9 object-contain"
                      />
                </div>
                <div>
                  <h3>Inmobiliaria</h3>
                  <p>Tu hogar perfecto</p>
                </div>
              </div>
              <p className="footer-description">
                Encontramos la propiedad perfecta para ti. Con más de 10 años de experiencia en el mercado inmobiliario.
              </p>
              <div className="social-links">
                <a href="https://www.facebook.com/share/1EHHyYYZtP/" className="social-link" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="https://www.tiktok.com/@casa.ya2?_r=1&_t=ZS-97H5bTufT56" className="social-link" aria-label="YouTube">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>

            {/* Secciones del footer */}
            {footerSections.map((section) => (
              <div key={section.title} className="footer-col">
                <h4>{section.title}</h4>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Columna de contacto */}
            <div className="footer-col">
              <h4>Contacto</h4>
              <ul className="contact-info">
                <li>
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
                  +51 123 456 789
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                  casaYa@gmail.com
                </li>
                <li>
                  <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 mr-2" />
                  Av. Principal 123, Potosi
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 casaYa. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <Link href="/mapa-sitio">Mapa del sitio</Link>
              <Link href="/faq">Preguntas Frecuentes</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}   