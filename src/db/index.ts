import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
  db: Db | undefined;
  dbUrl: string | undefined;
};

/** Neon: предпочитаем pooler — прямое соединение часто даёт ECONNRESET после idle. */
function resolveDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (
      host.includes(".neon.tech") &&
      !host.includes("-pooler.") &&
      !host.includes("-pooler")
    ) {
      // ep-xxx.region → ep-xxx-pooler.region
      parsed.hostname = host.replace(
        /^(ep-[^.]+)(\.)/,
        (_, id: string, dot: string) => `${id}-pooler${dot}`,
      );
      return parsed.toString();
    }
  } catch {
    // keep original
  }
  return url;
}

export function getDb(): Db {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      "DATABASE_URL не задан. Скопируйте .env.example в .env или задайте переменную в Vercel.",
    );
  }

  const url = resolveDatabaseUrl(raw);
  const isNeon = url.includes("neon.tech");
  const serverless = Boolean(process.env.VERCEL) || isNeon;

  // Hot-reload: если URL сменился — пересоздаём клиент
  if (globalForDb.sql && globalForDb.dbUrl !== url) {
    void globalForDb.sql.end({ timeout: 1 }).catch(() => undefined);
    globalForDb.sql = undefined;
    globalForDb.db = undefined;
  }

  if (!globalForDb.sql) {
    globalForDb.dbUrl = url;
    globalForDb.sql = postgres(url, {
      max: serverless ? 1 : 10,
      idle_timeout: 20,
      max_lifetime: 60 * 5,
      connect_timeout: 30,
      // Neon / PgBouncer transaction mode
      prepare: false,
      // Несколько попыток при «промахе» после sleep Neon
      connection: {
        application_name: "school37",
      },
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
