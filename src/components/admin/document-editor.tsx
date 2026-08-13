"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStatus } from "@/components/admin/form-status";
import { slugify } from "@/lib/slugify";
import {
  createDocumentAction,
  deleteDocumentAction,
  updateDocumentAction,
  uploadDocumentAction,
} from "@/server/actions";

type Category = { id: string; name: string };

type DocumentFormData = {
  id?: string;
  slug: string;
  title: string;
  categoryId: string | null;
  fileId: string | null;
  fileUrl?: string | null;
  documentDate: string | null;
  sizeLabel: string | null;
  isSigned: boolean;
  status: "draft" | "published" | "archived";
};

export function DocumentEditor({
  initial,
  categories,
}: {
  initial?: DocumentFormData;
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [fileId, setFileId] = useState(initial?.fileId ?? "");
  const [fileUrl, setFileUrl] = useState(initial?.fileUrl ?? "");
  const [documentDate, setDocumentDate] = useState(initial?.documentDate ?? "");
  const [sizeLabel, setSizeLabel] = useState(initial?.sizeLabel ?? "");
  const [isSigned, setIsSigned] = useState(initial?.isSigned ?? false);
  const [status, setStatus] = useState<DocumentFormData["status"]>(
    initial?.status ?? "draft",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function uploadFile(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      setError(null);
      const result = await uploadDocumentAction(formData);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setFileId(result.data.media.id);
      setFileUrl(result.data.media.url);
      if (!sizeLabel) setSizeLabel(result.data.sizeLabel);
      setMessage("Файл загружен");
    });
  }

  function save(nextStatus?: DocumentFormData["status"]) {
    const publishStatus = nextStatus ?? status;
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      categoryId: categoryId || null,
      fileId: fileId || null,
      documentDate: documentDate.trim() || null,
      sizeLabel: sizeLabel.trim() || null,
      isSigned,
      status: publishStatus,
    };

    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = initial?.id
        ? await updateDocumentAction(initial.id, payload)
        : await createDocumentAction(payload);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setMessage(publishStatus === "published" ? "Опубликовано" : "Сохранено");
      if (!initial?.id) {
        router.replace(`/admin/documents/${result.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function remove() {
    if (!initial?.id || !confirm("Удалить документ?")) return;
    startTransition(async () => {
      const result = await deleteDocumentAction(initial.id!);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.replace("/admin/documents");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <FormStatus status={message} error={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Название"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        <Input
          label="URL (slug)"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          value={categoryId || "none"}
          onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}
        >
          <SelectTrigger label="Категория">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Без категории</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as DocumentFormData["status"])}
        >
          <SelectTrigger label="Статус">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Черновик</SelectItem>
            <SelectItem value="published">Опубликовано</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-[var(--radius-md)] border border-line bg-paper-muted/40 p-4">
        <p className="font-sans text-sm font-medium text-ink">Файл документа</p>
        {fileUrl ? (
          <p className="mt-2 text-sm text-graphite">
            Загружен:{" "}
            <a
              href={fileUrl}
              className="text-brick hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {fileUrl.split("/").pop()}
            </a>
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Файл не прикреплён</p>
        )}
        <Input
          type="file"
          className="mt-3"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.rtf,.txt"
          disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
        <p className="mt-1 text-sm text-graphite">PDF, DOC, DOCX, XLS, до 20 МБ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Дата документа"
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
          placeholder="2025-01-15"
        />
        <Input
          label="Размер"
          value={sizeLabel}
          onChange={(e) => setSizeLabel(e.target.value)}
          placeholder="245 КБ"
        />
      </div>

      <label className="flex items-center gap-2 text-[15px]">
        <input
          type="checkbox"
          checked={isSigned}
          onChange={(e) => setIsSigned(e.target.checked)}
          className="size-4 accent-brick"
        />
        Документ с электронной подписью
      </label>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Button type="button" disabled={pending} onClick={() => save()}>
          Сохранить
        </Button>
        <Button
          type="button"
          variant="soft"
          disabled={pending}
          onClick={() => save("published")}
        >
          Опубликовать
        </Button>
        {initial?.id && fileUrl ? (
          <Button type="button" variant="ghost" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Скачать файл
            </a>
          </Button>
        ) : null}
        {initial?.id ? (
          <Button
            type="button"
            variant="ghost"
            className="ml-auto text-brick"
            disabled={pending}
            onClick={remove}
          >
            Удалить
          </Button>
        ) : null}
      </div>
    </div>
  );
}
