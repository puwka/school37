import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
  db: Db | undefined;
};

export function getDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL не задан. Скопируйте .env.example в .env или задайте переменную в Vercel.",
    );
  }
  if (!globalForDb.sql) {
    const serverless = Boolean(process.env.VERCEL);
    globalForDb.sql = postgres(url, {
      max: serverless ? 1 : 10,
      idle_timeout: 20,
      connect_timeout: 15,
      // Neon / Supabase pooler (transaction mode)
      prepare: false,
    });
  }
  if (!globalForDb.db) {
    globalForDb.db = drizzle(globalForDb.sql, { schema });
  }
  return globalForDb.db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
export type Database = Db;
