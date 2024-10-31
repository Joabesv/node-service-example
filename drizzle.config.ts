import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

process.loadEnvFile()

export default defineConfig({
  out: './drizzle',
  schema: './src/models/models.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
