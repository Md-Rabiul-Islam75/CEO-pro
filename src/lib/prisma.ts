import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Build the pg connection config + target schema from env.
 * Prefers DATABASE_URL if present; otherwise assembles from the DB_* parts.
 * The "?schema=..." query is Prisma-specific, so we strip it for pg and
 * pass the schema to the adapter separately (sets the search_path).
 */
function pgConfig(): { connectionString: string; schema: string } {
  const { DATABASE_URL, DB_SCHEMA } = process.env;

  if (DATABASE_URL) {
    const u = new URL(DATABASE_URL);
    const schema = u.searchParams.get("schema") ?? DB_SCHEMA ?? "public";
    u.search = "";
    return { connectionString: u.toString(), schema };
  }

  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  const connectionString = `postgresql://${DB_USER}:${encodeURIComponent(
    DB_PASSWORD ?? ""
  )}@${DB_HOST}:${DB_PORT ?? 5432}/${DB_NAME}`;
  return { connectionString, schema: DB_SCHEMA ?? "public" };
}

function createPrismaClient() {
  const { connectionString, schema } = pgConfig();
  const adapter = new PrismaPg({ connectionString }, { schema });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot reloads in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
