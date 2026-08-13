"use client";

import { blockLabel } from "@/lib/cms/block-catalog";

/** Упрощённый предпросмотр блока в редакторе (без запросов к БД). */
export function BlockPreview({
  type,
  data,
}: {
  type: string;
  data: Record<string, unknown>;
}) {
  const normalized =
    type === "prose" ? "text" : type === "link_list" ? "links" : type;

  switch (normalized) {
    case "heading":
      return (
        <p className="font-serif text-lg font-semibold text-ink">
          {String(data.text ?? "Заголовок")}
        </p>
      );
    case "text": {
      const paragraphs = (data.paragraphs as string[]) ?? [];
      return (
        <div className="space-y-2 text-[15px] text-graphite">
          {paragraphs.slice(0, 3).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {paragraphs.length > 3 ? (
            <p className="text-sm text-muted">…ещё {paragraphs.length - 3}</p>
          ) : null}
        </div>
      );
    }
    case "image":
      return data.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(data.src)}
          alt={String(data.alt ?? "")}
          className="max-h-40 border border-line object-cover"
        />
      ) : (
        <p className="text-sm text-muted">Картинка не задана</p>
      );
    case "gallery": {
      const items = ((data.items as { src: string }[]) ?? []).filter((i) => i.src);
      return (
        <p className="text-sm text-muted">
          Галерея: {items.length || 0} фото
        </p>
      );
    }
    case "cta":
      return (
        <div className="border border-line bg-paper-muted px-4 py-3">
          <p className="font-medium">{String(data.title ?? "")}</p>
          <p className="mt-1 text-sm text-muted">
            Кнопка «{String(data.buttonLabel ?? "")}» → {String(data.href ?? "")}
          </p>
        </div>
      );
    case "news":
      return (
        <p className="text-sm text-muted">
          Новости: последние {String(data.limit ?? 5)}
          {data.kind && data.kind !== "all" ? ` (${String(data.kind)})` : ""}
        </p>
      );
    case "documents":
      return (
        <p className="text-sm text-muted">
          Документы
          {data.categorySlug ? ` · категория ${String(data.categorySlug)}` : ""}
          {Array.isArray(data.slugs) && data.slugs.length
            ? ` · ${data.slugs.length} шт.`
            : ""}
        </p>
      );
    case "employees":
      return (
        <p className="text-sm text-muted">
          Сотрудники ·{" "}
          {data.mode === "leadership"
            ? "руководство"
            : data.mode === "teachers"
              ? "педагоги"
              : "все"}
          , до {String(data.limit ?? 12)}
        </p>
      );
    case "accordion": {
      const items = (data.items as { question: string }[]) ?? [];
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm text-graphite">
          {items.map((item, i) => (
            <li key={i}>{item.question}</li>
          ))}
        </ul>
      );
    }
    case "tabs": {
      const items = (data.items as { label: string }[]) ?? [];
      return (
        <p className="text-sm text-muted">
          Вкладки: {items.map((i) => i.label).join(" · ") || "—"}
        </p>
      );
    }
    case "table": {
      const columns = (data.columns as string[]) ?? [];
      const rows = (data.rows as string[][]) ?? [];
      return (
        <p className="text-sm text-muted">
          Таблица {columns.length}×{rows.length}
        </p>
      );
    }
    case "links": {
      const items = (data.items as { label: string }[]) ?? [];
      return (
        <ul className="space-y-1 text-sm text-brick">
          {items.map((item, i) => (
            <li key={i}>{item.label}</li>
          ))}
        </ul>
      );
    }
    case "contacts":
      return (
        <p className="text-sm text-muted">
          Контакты школы
          {data.note ? ` · ${String(data.note).slice(0, 60)}` : ""}
        </p>
      );
    case "html":
      return (
        <p className="font-mono text-xs text-muted">
          {String(data.html ?? "").slice(0, 120) || "Пустой HTML"}
        </p>
      );
    case "alert":
      return (
        <p className="text-sm text-graphite">
          {data.title ? <strong>{String(data.title)}: </strong> : null}
          {String(data.body ?? "")}
        </p>
      );
    case "definition_list":
    case "facts": {
      const items = (data.items as { label?: string; term?: string }[]) ?? [];
      return (
        <p className="text-sm text-muted">
          {blockLabel(type)}: {items.length} пунктов
        </p>
      );
    }
    default:
      return <p className="text-sm text-muted">{blockLabel(type)}</p>;
  }
}
