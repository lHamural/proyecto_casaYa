// app/(public)/privacidad/page.tsx
import Link from 'next/link'
import { Shield, Users, Database, Mail, Lock, Eye } from 'lucide-react'

export default function PrivacidadPage() {
  const secciones = [
    {
      icon: Database,
      title: '1. Información que recopilamos',
      content: 'Recopilamos información que nos proporcionas directamente, como nombre, correo electrónico, teléfono y datos de tu propiedad. También recopilamos información de uso y navegación para mejorar nuestros servicios.'
    },
    {
      icon: Shield,
      title: '2. Cómo usamos tu información',
      content: 'Usamos tu información para: facilitar la publicación y búsqueda de propiedades, comunicarnos contigo, mejorar nuestros servicios, y cumplir con obligaciones legales.'
    },
    {
      icon: Users,
      title: '3. Compartir información',
      content: 'No vendemos ni alquilamos tu información personal. Compartimos información solo con otros usuarios cuando es necesario para la transacción inmobiliaria, y con proveedores de servicios que nos ayudan a operar la plataforma.'
    },
    {
      icon: Lock,
      title: '4. Seguridad de los datos',
      content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.'
    },
    {
      icon: Eye,
      title: '5. Tus derechos',
      content: 'Tienes derecho a acceder, rectificar, cancelar y oponerte al uso de tus datos personales. Puedes ejercer estos derechos contactándonos directamente.'
    },
    {
      icon: Mail,
      title: '6. Contacto',
      content: 'Si tienes preguntas sobre nuestra política de privacidad, puedes contactarnos a través de nuestro formulario de contacto o por correo electrónico a privacidad@inmobiliaria.com.'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Política de Privacidad
            </h1>
            <p className="text-muted-foreground mt-2">
              Última actualización: {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <p className="text-sm text-muted-foreground">
              En Inmobiliaria, nos tomamos muy en serio la privacidad de nuestros usuarios. 
              Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
            </p>
          </div>

          {/* Secciones */}
          <div className="space-y-6">
            {secciones.map((seccion, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <seccion.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-2">
                      {seccion.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {seccion.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consentimiento */}
          <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/10">
            <p className="text-sm">
              <span className="font-medium">Consentimiento:</span>{' '}
              <span className="text-muted-foreground">
                Al utilizar nuestra plataforma, aceptas nuestra política de privacidad.
              </span>
            </p>
          </div>

          {/* Enlaces */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/privacidad" className="text-sm text-primary font-medium hover:underline">
              Política de Privacidad
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}