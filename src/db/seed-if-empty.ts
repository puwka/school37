import "dotenv/config";
import postgres from "postgres";
import { runSeed } from "./seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("DATABASE_URL не задан — seed-if-empty пропущен.");
    return;
  }

  const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 15 });
  try {
    const rows = await sql<{ exists: boolean }[]>`
      select exists(
        select 1 from settings where key = 'school' limit 1
      ) as exists
    `;
    if (rows[0]?.exists) {
      console.log("База уже заполнена — seed пропущен.");
      return;
    }
    console.log("База пустая — запуск seed…");
    await runSeed();
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
