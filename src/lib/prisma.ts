import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern: reuse one PrismaClient across hot
// reloads in dev, and across invocations within the same serverless
// instance in production, instead of opening a new connection pool on
// every request.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
