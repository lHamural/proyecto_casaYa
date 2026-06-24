// app/(public)/faq/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'  // ← Agregar esta importación
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        question: '¿Qué es Inmobiliaria?',
        answer: 'Inmobiliaria es una plataforma que conecta compradores, vendedores y arrendatarios de propiedades, facilitando el proceso de compra, venta y alquiler de inmuebles de manera segura y eficiente.'
      },
      {
        question: '¿Cómo puedo registrarme?',
        answer: 'Puedes registrarte haciendo clic en "Registrarse" en la parte superior derecha. Solo necesitas un correo electrónico y crear una contraseña. También puedes registrarte con Google o Facebook.'
      },
    ]
  },
  {
    category: 'Propiedades',
    questions: [
      {
        question: '¿Cómo publico una propiedad?',
        answer: 'Inicia sesión en tu cuenta, ve a "Mi Perfil" y selecciona "Publicar Propiedad". Completa el formulario con los detalles de tu propiedad y publica. Recibirás notificaciones cuando alguien se interese.'
      },
      {
        question: '¿Cuánto cuesta publicar una propiedad?',
        answer: 'La publicación de propiedades es gratuita. Sin embargo, ofrecemos planes premium que permiten destacar tu propiedad y tener más visibilidad. Revisa nuestros planes para más información.'
      },
      {
        question: '¿Cómo destaco mi propiedad?',
        answer: 'Desde el panel de control, selecciona la propiedad que deseas destacar y haz clic en "Destacar". Dependiendo de tu plan, esta función puede estar disponible o requerir una actualización.'
      },
    ]
  },
  {
    category: 'Compra y Venta',
    questions: [
      {
        question: '¿Cómo contacto al vendedor?',
        answer: 'En la página de cada propiedad, encontrarás un botón "Contactar al vendedor". Completa el formulario con tu consulta y el vendedor recibirá tu mensaje directamente.'
      },
      {
        question: '¿Necesito un agente inmobiliario?',
        answer: 'No es obligatorio, pero recomendamos contar con asesoría profesional para garantizar una transacción segura. Nuestra plataforma te permite contactar con agentes certificados.'
      },
    ]
  },
  {
    category: 'Suscripciones',
    questions: [
      {
        question: '¿Qué planes ofrecen?',
        answer: 'Ofrecemos planes Gratuito, Básico, Profesional y Premium. Cada plan tiene diferentes beneficios como el número de propiedades, imágenes, y herramientas de marketing.'
      },
      {
        question: '¿Cómo cancelo mi suscripción?',
        answer: 'Puedes cancelar tu suscripción desde el panel de control, en la sección "Mi Suscripción". La cancelación se efectuará al final del período de facturación actual.'
      },
    ]
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})

  const toggleFaq = (id: string) => {
    setOpenFaqs(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Filtrar FAQs
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Preguntas Frecuentes
            </h1>
            <p className="text-primary text-lg">
              Encuentra respuestas a las preguntas más comunes sobre nuestra plataforma
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Buscador */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron preguntas con ese término</p>
            </div>
          ) : (
            filteredFaqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const id = `${category.category}-${index}`
                    const isOpen = openFaqs[id]

                    return (
                      <Card key={id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleFaq(id)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors rounded-xl"
                          >
                            <span className="font-medium pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-muted-foreground text-sm border-t border-gray-100 pt-4">
                              {faq.answer}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
          <p className="text-muted-foreground mb-4">
            Nuestro equipo está aquí para ayudarte
          </p>
          <Button asChild>
            <Link href="/contacto">Contactar soporte</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}