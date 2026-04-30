import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { logger } from '@/lib/logger'

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Missing DATABASE_URL. Set it before starting the app.')
  }

  if (!url.startsWith('file:')) {
    throw new Error(
      'This Prisma schema uses SQLite. DATABASE_URL must be a file: URL unless the schema and adapter are changed.'
    )
  }

  logger.info('prisma', 'Initializing Prisma client', {
    provider: 'sqlite',
    databaseUrlKind: 'file',
  })

  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
