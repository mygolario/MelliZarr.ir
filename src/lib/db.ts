import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveSqliteUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (raw === ":memory:" || raw.startsWith("file::memory:")) {
    return ":memory:";
  }
  const withoutScheme = raw.replace(/^file:/, "");
  if (path.isAbsolute(withoutScheme)) {
    return withoutScheme;
  }
  return path.join(process.cwd(), withoutScheme);
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: resolveSqliteUrl() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
