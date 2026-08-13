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
  createNewsAction,
  deleteNewsAction,
  updateNewsAction,
} from "@/server/actions";

type Category = { id: string; name: string };

type NewsFormData = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  kind: "news" | "announcement" | "event" | "federal";
  categoryId: string | null;
  isUrgent: boolean;
  status: "draft" | "published" | "archived";
};

export function NewsEditor({
  initial,
  categories,
}: {
  initial?: NewsFormData;
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [bodyText, setBodyText] = useState((initial?.body ?? []).join("\n\n"));
  const [kind, setKind] = useState<NewsFormData["kind"]>(initial?.kind ?? "news");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [isUrgent, setIsUrgent] = useState(initial?.isUrgent ?? false);
  const [status, setStatus] = useState<NewsFormData["status"]>(
    initial?.status ?? "draft",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function save(nextStatus?: NewsFormData["status"]) {
    const publishStatus = nextStatus ?? status;
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      kind,
      categoryId: categoryId || null,
      isUrgent,
      status: publishStatus,
    };

    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = initial?.id
        ? await updateNewsAction(initial.id, payload)
        : await createNewsAction(payload);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setMessage(
        publishStatus === "published" ? "Опубликовано" : "Сохранено",
      );
      if (!initial?.id) {
        router.replace(`/admin/news/${result.data.id}`);
      } else {
        router.refresh();
      }
    });
  }

  function remove() {
    if (!initial?.id || !confirm("Удалить новость?")) return;
    startTransition(async () => {
      const result = await deleteNewsAction(initial.id!);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      router.replace("/admin/news");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <FormStatus status={message} error={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Заголовок"
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
          hint="Латиница и дефисы, например: den-znaniy-2025"
          required
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm font-medium text-ink">Анонс</span>
        <textarea
          className="min-h-[88px] w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 font-sans text-[15px]"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-sm font-medium text-ink">Текст</span>
        <span className="text-sm text-graphite">
          Абзацы разделяйте пустой строкой
        </span>
        <textarea
          className="min-h-[220px] w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 font-sans text-[15px] leading-relaxed"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <Select value={kind} onValueChange={(v) => setKind(v as NewsFormData["kind"])}>
          <SelectTrigger label="Тип">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">Новость</SelectItem>
            <SelectItem value="announcement">Объявление</SelectItem>
            <SelectItem value="event">Мероприятие</SelectItem>
            <SelectItem value="federal">Федеральная</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryId || "none"}
          onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}
        >
          <SelectTrigger label="Категория">
            <SelectValue placeholder="Без категории" />
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
          onValueChange={(v) => setStatus(v as NewsFormData["status"])}
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

      <label className="flex items-center gap-2 text-[15px]">
        <input
          type="checkbox"
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
          className="size-4 accent-brick"
        />
        Срочное объявление на главной
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
        {initial?.id && slug ? (
          <Button type="button" variant="ghost" asChild>
            <a href={`/novosti/${slug}/`} target="_blank" rel="noopener noreferrer">
              Просмотр на сайте
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
