// app/(public)/nosotros/page.tsx (Sección Equipo actualizada)
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Users, 
  Home, 
  Award, 
  Clock, 
  Shield, 
  Heart,
  MapPin,
  Phone,
  Mail,
  Building2,
  Target,
  Eye,
  Sparkles,
  TrendingUp,
  CheckCircle
} from 'lucide-react'

export default function NosotrosPage() {
  const stats = [
    { icon: Home, label: 'Propiedades vendidas', value: '2,500+' },
    { icon: Users, label: 'Clientes satisfechos', value: '1,200+' },
    { icon: Award, label: 'Años de experiencia', value: '10+' },
    { icon: Clock, label: 'Atención al cliente', value: '24/7' },
  ]

  const valores = [
    {
      icon: Shield,
      title: 'Confianza',
      description: 'Construimos relaciones basadas en la transparencia y honestidad',
    },
    {
      icon: Heart,
      title: 'Compromiso',
      description: 'Nos dedicamos a encontrar la propiedad perfecta para cada cliente',
    },
    {
      icon: Sparkles,
      title: 'Innovación',
      description: 'Utilizamos tecnología de vanguardia para mejorar tu experiencia',
    },
    {
      icon: Target,
      title: 'Excelencia',
      description: 'Buscamos la excelencia en cada paso del proceso inmobiliario',
    },
  ]

  const equipo = [
    {
      name: 'Ana María García',
      role: 'CEO & Fundadora',
      description: '10 años de experiencia en el mercado inmobiliario',
      image: '/image/a1.jpeg',
      fallback: 'AG',
    },
    {
      name: 'Carlos Mendoza',
      role: 'Director Comercial',
      description: 'Especialista en ventas y negociación',
      image: '/image/a2.jpg',
      fallback: 'CM',
    },
    {
      name: 'Laura Fernández',
      role: 'Jefa de Marketing',
      description: 'Estrategias digitales para tu propiedad',
      image: '/image/a3.jpg',
      fallback: 'LF',
    }
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
              Sobre Nosotros
            </h1>
            <p className="text-primary/80 text-lg md:text-xl">
              Somos una empresa inmobiliaria comprometida con ayudarte a encontrar 
              el hogar de tus sueños. Con más de 10 años de experiencia, 
              ofrecemos un servicio profesional y personalizado.
            </p>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-primary">Nuestra Historia</h2>
              <div className="w-20 h-1 bg-accent mb-6" />
              <p className="text-muted-foreground mb-4">
                Inmobiliaria nació en 2014 con la visión de transformar la experiencia 
                de compra y venta de propiedades en Bolivia. Lo que comenzó como un 
                pequeño equipo de entusiastas, hoy es una empresa líder en el sector.
              </p>
              <p className="text-muted-foreground mb-4">
                Nuestro compromiso es ofrecer un servicio integral que guía a nuestros 
                clientes en cada paso del proceso inmobiliario, desde la búsqueda hasta 
                la firma del contrato.
              </p>
              <p className="text-muted-foreground">
                Hoy, con más de 2,500 propiedades vendidas y 1,200 clientes satisfechos, 
                seguimos creciendo con la misma pasión y dedicación que nos caracteriza.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/image/p1.png"
                alt="Nuestra historia"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Nuestra Filosofía</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Nuestros principios guían cada decisión que tomamos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Misión</h3>
                <p className="text-muted-foreground text-sm">
                  Facilitar el acceso a la vivienda ideal, ofreciendo un servicio 
                  profesional, transparente y personalizado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visión</h3>
                <p className="text-muted-foreground text-sm">
                  Ser la empresa inmobiliaria de referencia en Bolivia, reconocida por 
                  nuestra innovación, integridad y excelencia.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Valores</h3>
                <p className="text-muted-foreground text-sm">
                  Confianza, compromiso, innovación y excelencia. Estos valores nos 
                  impulsan a dar lo mejor de nosotros.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Nuestros Valores</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor) => (
              <div key={valor.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <valor.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{valor.title}</h3>
                <p className="text-sm text-muted-foreground">{valor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo con imágenes circulares */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary">Conoce a Nuestro Equipo</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-4" />
            <p className="text-muted-foreground mt-4">
              Profesionales dedicados a hacer realidad tus sueños inmobiliarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipo.map((miembro) => (
              <div key={miembro.name} className="text-center group">
                {/* Imagen circular con fallback */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 shadow-lg">
                    {/* Imagen de perfil si existe */}
                    <div className="relative w-full h-full">
                      <Image
                        src={miembro.image}
                        alt={miembro.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold">{miembro.name}</h3>
                <p className="text-sm text-primary font-medium">{miembro.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{miembro.description}</p>

                {/* Botón de contacto (opcional) */}
                <Button variant="ghost" size="sm" className="mt-3 text-primary hover:text-primary/80">
                  Ver perfil
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres ser parte de nuestra historia?
            </h2>
            <p className="text-white/80 mb-8">
              Publica tu propiedad o encuentra el hogar de tus sueños con nosotros
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
                <Link href="/publicar-propiedad">Publicar Propiedad</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-primary hover:bg-white/10">
                <Link href="/contacto">Contactar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}