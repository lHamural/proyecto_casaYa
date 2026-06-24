// prisma.config.ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  migrations: {
    seed: 'node --import tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!, // ← La URL se define aquí
  },
})