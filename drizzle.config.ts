import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./supabase/migrations",
  // Drizzle Kit 1.0 manages *all* Postgres schemas by default. Supabase
  // creates several internal schemas (auth, storage, realtime, ...), so we
  // limit Drizzle Kit to the `public` schema that this app owns.
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
