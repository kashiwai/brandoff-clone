import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient

// Only use Turso adapter in server-side environment
if (typeof window === 'undefined' && process.env.TURSO_DATABASE_URL) {
  const { PrismaLibSQL } = require('@prisma/adapter-libsql')
  const { createClient } = require('@libsql/client')

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  })

  const adapter = new PrismaLibSQL(libsql)

  prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
} else {
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma