import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { slugify, formatFileSize } from "@/lib/slugify";
import { createMedia } from "@/server/crud";

const DOC_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/rtf",
  "text/plain",
]);

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeBasename(name: string) {
  const ext = path.extname(name).toLowerCase().slice(0, 8);
  const base = slugify(path.basename(name, path.extname(name))) || "file";
  return `${base}${ext}`;
}

async function saveUpload(
  file: File,
  subdir: "documents" | "staff" | "images",
  allowed: Set<string>,
) {
  if (process.env.VERCEL) {
    throw new Error(
      "Загрузка файлов на Vercel пока недоступна. Загрузите файлы локально и задеployте через git, либо подключите Vercel Blob.",
    );
  }
  if (!file.size) throw new Error("Файл пустой");
  if (file.size > 20 * 1024 * 1024) throw new Error("Файл больше 20 МБ");

  const mime = file.type || "application/octet-stream";
  if (!allowed.has(mime)) {
    throw new Error("Недопустимый тип файла");
  }

  const filename = `${Date.now()}-${safeBasename(file.name)}`;
  const relDir = path.join("uploads", subdir);
  const absDir = path.join(process.cwd(), "public", relDir);
  await mkdir(absDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = path.join("public", relDir, filename);
  await writeFile(path.join(process.cwd(), storagePath), buffer);

  const url = `/${relDir.replace(/\\/g, "/")}/${filename}`;
  const media = await createMedia({
    filename,
    originalName: file.name,
    mimeType: mime,
    sizeBytes: file.size,
    storagePath,
    url,
    alt: file.name,
  });

  return { media, sizeLabel: formatFileSize(file.size) };
}

export async function uploadDocumentFile(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Файл не выбран");
  return saveUpload(file, "documents", DOC_TYPES);
}

export async function uploadStaffPhoto(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Файл не выбран");
  return saveUpload(file, "staff", IMAGE_TYPES);
}
