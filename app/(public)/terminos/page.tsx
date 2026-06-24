// app/(public)/terminos/page.tsx
import Link from 'next/link'
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function TerminosPage() {
  const secciones = [
    {
      title: '1. Aceptación de los términos',
      content: 'Al acceder y utilizar este sitio web, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio.'
    },
    {
      title: '2. Uso del sitio',
      content: 'Este sitio está diseñado para personas mayores de 18 años. Te comprometes a utilizar el sitio de manera legal y ética, sin infringir los derechos de terceros o las leyes aplicables.'
    },
    {
      title: '3. Propiedad intelectual',
      content: 'Todo el contenido de este sitio, incluyendo textos, imágenes, logotipos y diseño, es propiedad de Inmobiliaria y está protegido por las leyes de propiedad intelectual.'
    },
    {
      title: '4. Publicación de propiedades',
      content: 'Los usuarios son responsables de la veracidad y exactitud de la información que publican. Inmobiliaria no se hace responsable por el contenido publicado por terceros.'
    },
    {
      title: '5. Responsabilidad',
      content: 'Inmobiliaria actúa como intermediario y no se responsabiliza por las transacciones realizadas entre usuarios. Recomendamos verificar la información de las propiedades y los vendedores.'
    },
    {
      title: '6. Modificaciones',
      content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán efectivas inmediatamente después de su publicación en el sitio.'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Términos y Condiciones
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
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Estos términos y condiciones rigen el uso de la plataforma Inmobiliaria. 
                  Al utilizar nuestros servicios, aceptas cumplir con estos términos en su totalidad.
                </p>
              </div>
            </div>
          </div>

          {/* Secciones */}
          <div className="space-y-6">
            {secciones.map((seccion, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-primary mb-3">
                  {seccion.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {seccion.content}
                </p>
              </div>
            ))}
          </div>

          {/* Aceptación */}
          <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/10">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Al continuar usando nuestro sitio, aceptas estos términos.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Si tienes preguntas sobre nuestros términos, no dudes en contactarnos.
                </p>
              </div>
            </div>
          </div>

          {/* Enlaces a otras políticas */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/terminos" className="text-sm text-primary font-medium hover:underline">
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary hover:underline">
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