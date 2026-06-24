// app/(public)/funcion/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Home, 
  FileCheck, 
  Handshake, 
  ArrowRight,
  Building2,
  UserPlus,
  MessageCircle,
  Shield,
  Clock,
  TrendingUp,
  Users,
  CheckCircle  // ← Agregar esta importación
} from 'lucide-react'

export default function ComoFuncionaPage() {
  const pasos = [
    {
      numero: '01',
      icon: Search,
      title: 'Busca la propiedad ideal',
      description: 'Explora nuestro catálogo de propiedades con filtros avanzados. Encuentra la propiedad que se ajusta a tus necesidades y presupuesto.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      numero: '02',
      icon: MessageCircle,
      title: 'Contacta al vendedor',
      description: 'Envía un mensaje al propietario para obtener más información, agendar una visita o resolver tus dudas sobre la propiedad.',
      color: 'bg-green-50 text-green-600',
    },
    {
      numero: '03',
      icon: Home,
      title: 'Visita la propiedad',
      description: 'Coordina una visita con el propietario para conocer la propiedad en persona y asegurarte de que cumple con tus expectativas.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      numero: '04',
      icon: FileCheck,
      title: 'Realiza la oferta',
      description: 'Presenta tu oferta formal. Nuestro equipo te guiará en todo el proceso de negociación y documentación necesaria.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      numero: '05',
      icon: Handshake,
      title: 'Cierra el trato',
      description: 'Firma el contrato y completa la transacción. Te acompañamos hasta que la propiedad sea tuya o esté vendida.',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  const beneficios = [
    {
      icon: Shield,
      title: 'Seguridad garantizada',
      description: 'Todas las transacciones son seguras y respaldadas por nuestra plataforma.',
    },
    {
      icon: Clock,
      title: 'Proceso rápido',
      description: 'Optimizamos cada etapa para que encuentres tu hogar en el menor tiempo posible.',
    },
    {
      icon: Users,
      title: 'Asesoría profesional',
      description: 'Contamos con un equipo de expertos que te guiarán en cada paso.',
    },
    {
      icon: TrendingUp,
      title: 'Mejores precios',
      description: 'Accede a propiedades con los mejores precios del mercado inmobiliario.',
    },
  ]

  const roles = [
    {
      title: 'Para Compradores',
      description: 'Encuentra la propiedad de tus sueños con nuestra ayuda.',
      icon: UserPlus,
      steps: [
        'Regístrate en la plataforma',
        'Explora propiedades con filtros avanzados',
        'Contacta a los vendedores',
        'Agenda visitas',
        'Realiza tu oferta',
      ],
      buttonText: 'Buscar Propiedades',
      buttonLink: '/full-propiedades',
    },
    {
      title: 'Para Vendedores',
      description: 'Publica tu propiedad y llega a miles de compradores.',
      icon: Building2,
      steps: [
        'Publica tu propiedad en minutos',
        'Recibe consultas de interesados',
        'Gestiona tus propiedades',
        'Negocia con compradores',
        'Cierra la venta',
      ],
      buttonText: 'Publicar Propiedad',
      buttonLink: '/publicar-propiedad',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-custom relative z-10 text-primary">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Cómo funciona?
            </h1>
            <p className="text-primary/80 text-lg md:text-xl">
              Te guiamos paso a paso en el proceso de compra, venta o alquiler de 
              propiedades. Simple, rápido y seguro.
            </p>
          </div>
        </div>
      </section>

      {/* Pasos */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">5 pasos para tu propiedad</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Un proceso sencillo y transparente para que encuentres o vendas tu propiedad sin complicaciones
            </p>
          </div>

          <div className="space-y-8">
            {pasos.map((paso, index) => (
              <div key={paso.numero} className="relative">
                {/* Línea conectora */}
                {index < pasos.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
                )}
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Número e icono */}
                  <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl ${paso.color} flex items-center justify-center flex-shrink-0`}>
                      <paso.icon className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground/20">
                      {paso.numero}
                    </span>
                  </div>
                  
                  {/* Contenido */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{paso.title}</h3>
                    <p className="text-muted-foreground max-w-2xl">{paso.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles: Compradores y Vendedores */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">¿Qué necesitas hacer?</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roles.map((rol) => (
              <Card key={rol.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <rol.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{rol.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{rol.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {rol.steps.map((step) => (
                      <li key={step} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="w-full">
                    <Link href={rol.buttonLink}>
                      {rol.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Ventajas de trabajar con nosotros</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio) => (
              <div key={beneficio.title} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <beneficio.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{beneficio.title}</h3>
                <p className="text-sm text-muted-foreground">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-white/80 mb-8">
              Únete a miles de personas que ya encontraron su hogar ideal con nosotros
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
                <Link href="/full-propiedades">
                  Buscar Propiedades
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contacto">
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}