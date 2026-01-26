import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// Configure Neon for serverless environments
// This enables WebSocket connections for edge runtimes
neonConfig.poolQueryViaFetch = true;

// Declare global type for PrismaClient singleton
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Get the database connection string.
 */
function getConnectionString(): string {
  const connectionString = process.env['DATABASE_URL'];

  if (connectionString === undefined || connectionString === '') {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return connectionString;
}

/**
 * Singleton Prisma Client for serverless environments.
 *
 * In development, we store the client on the global object to prevent
 * creating multiple instances during hot reloading.
 *
 * In production, a new client is created for each cold start.
 *
 * Uses @prisma/adapter-neon for edge compatibility.
 */
function createPrismaClient(): PrismaClient {
  const connectionString = getConnectionString();
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

// Export singleton instance
export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
