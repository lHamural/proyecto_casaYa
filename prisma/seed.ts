import { PrismaClient } from '../lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...')

  // ─────────────────────────────────────────
  // PLANES
  // ─────────────────────────────────────────
  console.log('📦 Creando planes...')

  const planGratuito = await prisma.plan.upsert({
    where: { name: 'GRATUITO' },
    update: {},
    create: {
      name: 'GRATUITO',
      price: 0,
      currency: 'USD',
      description: 'Plan gratuito para empezar a publicar propiedades',
      maxProperties: 2,
      maxImages: 3,
      allowVirtualTour: false,
      allowHighlight: false,
      allowWhatsapp: false,
      allowStats: false,
      durationDays: 30,
    },
  })

  const planBasico = await prisma.plan.upsert({
    where: { name: 'BASICO' },
    update: {},
    create: {
      name: 'BASICO',
      price: 9.99,
      currency: 'USD',
      description: 'Plan básico para empezar a crecer',
      maxProperties: 5,
      maxImages: 5,
      allowVirtualTour: false,
      allowHighlight: false,
      allowWhatsapp: true,
      allowStats: false,
      durationDays: 30,
    },
  })

  const planPlatino = await prisma.plan.upsert({
    where: { name: 'PLATINO' },
    update: {},
    create: {
      name: 'PLATINO',
      price: 29.99,
      currency: 'USD',
      description: 'Plan platino con más visibilidad y funciones avanzadas',
      maxProperties: 10,
      maxImages: 10,
      allowVirtualTour: false,
      allowHighlight: true,
      allowWhatsapp: true,
      allowStats: true,
      durationDays: 30,
    },
  })

  const planPremium = await prisma.plan.upsert({
    where: {     name: 'PREMIUM' },

    update: {},
    create: {
          name: 'PREMIUM',
      price: 59.99,
      currency: 'USD',
      description: 'Plan premium con todas las funciones incluyendo tour virtual',
      maxProperties: 50,
      maxImages: 20,
      allowVirtualTour: true,
      allowHighlight: true,
      allowWhatsapp: true,
      allowStats: true,
      durationDays: 30,
    },
  })

  console.log('✅ Planes creados:', planGratuito.name, planBasico.name, planPlatino.name, planPremium.name)

  // ─────────────────────────────────────────
  // TIPOS DE OPERACIÓN
  // ─────────────────────────────────────────
  console.log('🏷️  Creando tipos de operación...')

  const tipos = ['VENTA', 'ALQUILER', 'ANTICRETICO'] as const

  for (const tipo of tipos) {
    await prisma.propertyType.upsert({
      where: { name: tipo },
      update: {},
      create: { name: tipo },
    })
  }

  console.log('✅ Tipos de operación creados')

  // ─────────────────────────────────────────
  // CATEGORÍAS DE PROPIEDAD
  // ─────────────────────────────────────────
  console.log('🏠 Creando categorías...')

  const categorias = [
    'CASA',
    'DEPARTAMENTO',
    'TERRENO',
    'OFICINA',
    'LOCAL_COMERCIAL',
    'HOTEL',
    'CAMPO',
    'OTRO',
  ] as const

  for (const categoria of categorias) {
    await prisma.propertyCategory.upsert({
      where: { name: categoria },
      update: {},
      create: { name: categoria },
    })
  }

  console.log('✅ Categorías creadas')

  // ─────────────────────────────────────────
  // CARACTERÍSTICAS
  // ─────────────────────────────────────────
  console.log('✨ Creando características...')

  const caracteristicas = [
    { name: 'Piscina',            icon: '🏊' },
    { name: 'Jardín',             icon: '🌿' },
    { name: 'Terraza',            icon: '🏡' },
    { name: 'Garaje',             icon: '🚗' },
    { name: 'Ascensor',           icon: '🛗' },
    { name: 'Seguridad 24h',      icon: '🔒' },
    { name: 'Amoblado',           icon: '🛋️' },
    { name: 'Aire acondicionado', icon: '❄️' },
    { name: 'Calefacción',        icon: '🔥' },
    { name: 'Internet incluido',  icon: '📶' },
    { name: 'Área de lavandería', icon: '👕' },
    { name: 'Cuarto de servicio', icon: '🚪' },
    { name: 'Depósito/Bodega',    icon: '📦' },
    { name: 'Vista panorámica',   icon: '🌄' },
    { name: 'Cerca transporte',   icon: '🚌' },
    { name: 'Zona residencial',   icon: '🏘️' },
    { name: 'Acceso discapacitados', icon: '♿' },
    { name: 'Gimnasio',           icon: '💪' },
    { name: 'Sala de eventos',    icon: '🎉' },
    { name: 'Parque infantil',    icon: '🎠' },
  ]

  for (const caracteristica of caracteristicas) {
    await prisma.propertyFeature.upsert({
      where: { name: caracteristica.name },
      update: {},
      create: caracteristica,
    })
  }

  console.log('✅ Características creadas')

  // ─────────────────────────────────────────
  // SUPERADMIN
  // ─────────────────────────────────────────
  console.log('👤 Creando superadmin...')

  const hashedPassword = await bcrypt.hash('admin123', 12)

  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@casaya.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@casaya.com',
      password: hashedPassword,
      role: 'SUPERADMIN',
      isActive: true,
    },
  })

  // Asignar plan premium al superadmin
  await prisma.subscription.create({
  data: {
    userId: superadmin.id,
    planId: planPremium.id,
    status: 'ACTIVE',
    startDate: new Date(),
  },
});

  console.log('✅ Superadmin creado:', superadmin.email)
  console.log('🔑 Credenciales: admin@casaya.com / admin123')

  // ─────────────────────────────────────────
  // USUARIO DE PRUEBA
  // ─────────────────────────────────────────
  console.log('👤 Creando usuario de prueba...')

  const hashedPassword2 = await bcrypt.hash('test123', 12)

  const userPrueba = await prisma.user.upsert({
    where: { email: 'test@casaya.com' },
    update: {},
    create: {
      name: 'Usuario Prueba',
      email: 'test@casaya.com',
      password: hashedPassword2,
      role: 'PROPIETARIO',
      isActive: true,
    },
  })

await prisma.subscription.create({
  data: {
    userId: userPrueba.id,
    planId: planGratuito.id,
    status: 'ACTIVE',
    startDate: new Date(),
  },
});

  console.log('✅ Usuario de prueba creado:', userPrueba.email)
  console.log('🔑 Credenciales: test@casaya.com / test123')

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('─────────────────────────────────')
  console.log('📋 Resumen:')
  console.log('   - 3 Planes (Gratuito, Platino, Premium)')
  console.log('   - 3 Tipos de operación')
  console.log('   - 8 Categorías de propiedad')
  console.log('   - 20 Características')
  console.log('   - 1 Superadmin')
  console.log('   - 1 Usuario de prueba')
  console.log('─────────────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })