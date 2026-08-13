import "dotenv/config";
import postgres from "postgres";
import { runSeed } from "./seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("DATABASE_URL не задан — seed-if-empty пропущен.");
    return;
  }

  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 30 });
  let needsSeed = false;
  try {
    const rows = await sql<{ exists: boolean }[]>`
      select exists(
        select 1 from settings where key = 'school' limit 1
      ) as exists
    `;
    needsSeed = !rows[0]?.exists;
    if (!needsSeed) {
      console.log("База уже заполнена — seed пропущен.");
    }
  } finally {
    await sql.end({ timeout: 5 });
  }

  if (!needsSeed) return;

  console.log("База пустая — первичное заполнение…");
  await runSeed({ skipTruncate: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
