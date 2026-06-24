// app/(public)/contacto/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  Building2
} from 'lucide-react'

// FontAwesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faFacebook, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn, 
  faYoutube 
} from '@fortawesome/free-brands-svg-icons'
import { faLocationDot, faClock as faClockSolid } from '@fortawesome/free-solid-svg-icons'

export default function ContactoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Por favor completa los campos obligatorios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar mensaje')
      }

      setSuccess(true)
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar mensaje')
    } finally {
      setLoading(false)
    }
  }

  const infoContacto = [
    {
      icon: Phone,
      title: 'Teléfono',
      details: '+591 123 456 789',
      action: 'Llamar ahora',
      href: 'tel:+591123456789',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'info@inmobiliaria.com',
      action: 'Enviar email',
      href: 'mailto:info@inmobiliaria.com',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      details: 'Av. Principal 123, La Paz',
      action: 'Ver en mapa',
      href: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Horario de atención',
      details: 'Lun - Vie: 9:00 - 18:00',
      action: 'Sábados: 9:00 - 13:00',
      href: '#',
    },
  ]

  const redesSociales = [
    { icon: faFacebook, label: 'Facebook', color: 'hover:bg-[#1877f2]', href: 'https://www.facebook.com/share/1EHHyYYZtP/' },
    { icon: faTwitter, label: 'Twitter', color: 'hover:bg-[#1da1f2]', href: '#' },
    { icon: faInstagram, label: 'Instagram', color: 'hover:bg-[#e4405f]', href: '#' },
    { icon: faLinkedinIn, label: 'LinkedIn', color: 'hover:bg-[#0a66c2]', href: '#' },
    { icon: faYoutube, label: 'YouTube', color: 'hover:bg-[#ff0000]', href: 'https://www.tiktok.com/@casa.ya2?_r=1&_t=ZS-97H5bTufT56' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Contáctanos
            </h1>
            <p className="text-white/80 text-lg md:text-xl text-primary">
              Estamos aquí para ayudarte. Cuéntanos tu consulta y te responderemos 
              a la brevedad posible.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Información de contacto
              </h2>
              <p className="text-muted-foreground text-sm">
                Ponte en contacto con nosotros a través de cualquiera de estos medios
              </p>
            </div>

            {infoContacto.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                      <a 
                        href={item.href} 
                        target={item.title === 'Dirección' ? '_blank' : undefined}
                        rel={item.title === 'Dirección' ? 'noopener noreferrer' : undefined}
                        className="text-xs text-primary hover:underline mt-1 inline-block"
                      >
                        {item.action}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Redes Sociales con FontAwesome */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-3">Síguenos en redes sociales</h3>
                <div className="flex gap-3">
                  {redesSociales.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:text-white transition-colors ${social.color}`}
                    >
                      <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Oficina */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Oficina Central</h3>
                    <p className="text-xs text-muted-foreground">
                      Av. Principal 123, Edificio Centro
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de contacto */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Envíanos un mensaje
                </h2>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-green-800 font-medium">¡Mensaje enviado!</p>
                      <p className="text-sm text-green-600">
                        Te responderemos a la brevedad posible.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre completo *</Label>
                      <Input
                        placeholder="Tu nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Correo electrónico *</Label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input
                        type="tel"
                        placeholder="+591 12345678"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asunto</Label>
                      <Input
                        placeholder="Asunto de tu mensaje"
                        value={form.asunto}
                        onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mensaje *</Label>
                    <Textarea
                      placeholder="Escribe tu mensaje detalladamente..."
                      rows={6}
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card className="mt-6 overflow-hidden">
              <div className="relative h-[300px]">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-68.15,-16.50,-68.10,-16.45&layer=mapnik&marker=-16.499,-68.146"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0"
                  title="Ubicación de la oficina"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}