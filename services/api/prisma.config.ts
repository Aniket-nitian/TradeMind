import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection: they hold a
    // session-level postgres advisory lock, which Neon's pgbouncer-style
    // pooled endpoint doesn't reliably support — that mismatch is what was
    // causing `prisma migrate deploy` to fail with P1002 on every deploy.
    // The running app still uses the pooled DATABASE_URL (see prisma.ts);
    // this override only affects CLI commands (migrate/studio/etc).
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
