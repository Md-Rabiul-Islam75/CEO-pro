import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env — `dotenv/config` above handles that.

// Build the connection URL from the individual DB_* parts in .env.
// encodeURIComponent handles special characters in the password (e.g. "@").
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_SCHEMA,
  DATABASE_URL,
} = process.env;

const urlFromParts =
  DB_USER && DB_HOST && DB_NAME
    ? `postgresql://${DB_USER}:${encodeURIComponent(
        DB_PASSWORD ?? ""
      )}@${DB_HOST}:${DB_PORT ?? 5432}/${DB_NAME}?schema=${DB_SCHEMA ?? "public"}`
    : undefined;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Prefer an explicit DATABASE_URL if set; otherwise assemble from parts.
    url: DATABASE_URL ?? urlFromParts,
  },
});
