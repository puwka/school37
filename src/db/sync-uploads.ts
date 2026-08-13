import "dotenv/config";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { documents, employees, media, users } from "@/db/schema";
import { documents as documentItems } from "@/data/documents";
import { staff } from "@/data/staff";

const publicRoot = path.join(process.cwd(), "public");

const mimeByExt: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

async function getUploaderId() {
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.isActive, true)))
    .orderBy(asc(users.createdAt))
    .limit(1);
  return admin?.id ?? null;
}

async function ensureMedia(
  urlPath: string,
  originalName: string,
  mimeType: string,
  uploadedById: string | null,
) {
  const [existing] = await db
    .select()
    .from(media)
    .where(eq(media.url, urlPath))
    .limit(1);
  if (existing) return existing;

  const abs = path.join(publicRoot, urlPath.replace(/^\//, ""));
  if (!existsSync(abs)) return null;

  const sizeBytes = statSync(abs).size;
  const filename = path.basename(abs);
  const [row] = await db
    .insert(media)
    .values({
      filename,
      originalName,
      mimeType,
      sizeBytes,
      storagePath: urlPath,
      url: urlPath,
      uploadedById,
    })
    .returning();
  return row;
}

export async function syncUploadsFromDisk() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL не задан — sync-uploads пропущен.");
    return;
  }

  const uploadedById = await getUploaderId();
  if (!uploadedById) {
    console.log("Активный администратор не найден — sync-uploads пропущен.");
    return;
  }

  let linkedDocs = 0;
  for (const item of documentItems) {
    if (!item.href) continue;
    const ext = path.extname(item.href).toLowerCase();
    const row = await ensureMedia(
      item.href,
      path.basename(item.href),
      mimeByExt[ext] ?? "application/octet-stream",
      uploadedById,
    );
    if (!row) continue;

    const updated = await db
      .update(documents)
      .set({ fileId: row.id, updatedAt: new Date() })
      .where(eq(documents.slug, item.slug))
      .returning({ id: documents.id });
    if (updated.length) linkedDocs += 1;
  }

  let linkedStaff = 0;
  for (const person of staff) {
    if (!person.photoSrc) continue;
    const row = await ensureMedia(
      person.photoSrc,
      path.basename(person.photoSrc),
      "image/jpeg",
      uploadedById,
    );
    if (!row) continue;

    const updated = await db
      .update(employees)
      .set({ photoId: row.id, updatedAt: new Date() })
      .where(eq(employees.slug, person.slug))
      .returning({ id: employees.id });
    if (updated.length) linkedStaff += 1;
  }

  console.log(
    `sync-uploads: документов привязано ${linkedDocs}, фото сотрудников ${linkedStaff}`,
  );
}

async function main() {
  await syncUploadsFromDisk();
}

const isDirectRun =
  typeof process.argv[1] === "string" &&
  process.argv[1].replace(/\\/g, "/").endsWith("src/db/sync-uploads.ts");

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
