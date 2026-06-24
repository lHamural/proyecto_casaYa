// prisma.config.ts
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  migrations: {
    seed: 'node --import tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})