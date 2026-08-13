"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-sm font-medium text-ink">{children}</p>;
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 font-sans text-[15px] text-ink focus-visible:border-brick focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brick"
      />
    </div>
  );
}

function paragraphsToText(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

function textToParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function BlockFields({
  type,
  data,
  onChange,
}: {
  type: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const normalized =
    type === "prose" ? "text" : type === "link_list" ? "links" : type;
  const set = (patch: Record<string, unknown>) => onChange({ ...data, ...patch });

  switch (normalized) {
    case "heading":
      return (
        <div className="space-y-3">
          <Input
            label="Текст заголовка"
            value={String(data.text ?? "")}
            onChange={(e) => set({ text: e.target.value })}
          />
          <div>
            <FieldLabel>Уровень</FieldLabel>
            <select
              className="h-11 w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 text-[15px]"
              value={Number(data.level) === 3 ? 3 : 2}
              onChange={(e) => set({ level: Number(e.target.value) })}
            >
              <option value={2}>Крупный (H2)</option>
              <option value={3}>Меньше (H3)</option>
            </select>
          </div>
        </div>
      );
    case "text":
      return (
        <TextArea
          label="Текст (абзацы разделяйте пустой строкой)"
          value={paragraphsToText((data.paragraphs as string[]) ?? [])}
          onChange={(value) => set({ paragraphs: textToParagraphs(value) })}
          rows={8}
        />
      );
    case "image":
      return (
        <div className="space-y-3">
          <Input
            label="Ссылка на картинку"
            value={String(data.src ?? "")}
            onChange={(e) => set({ src: e.target.value })}
            placeholder="https://… или /uploads/…"
          />
          <Input
            label="Подпись для слабовидящих (alt)"
            value={String(data.alt ?? "")}
            onChange={(e) => set({ alt: e.target.value })}
          />
          <Input
            label="Подпись под фото"
            value={String(data.caption ?? "")}
            onChange={(e) => set({ caption: e.target.value })}
          />
        </div>
      );
    case "gallery": {
      const items = (data.items as { src: string; alt?: string }[]) ?? [];
      return (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="space-y-2 border border-line p-3">
              <Input
                label={`Фото ${index + 1}`}
                value={item.src}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, src: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <Input
                label="Описание"
                value={item.alt ?? ""}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, alt: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set({ items: items.filter((_, i) => i !== index) })
                }
              >
                Удалить фото
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => set({ items: [...items, { src: "", alt: "" }] })}
          >
            Добавить фото
          </Button>
        </div>
      );
    }
    case "cta":
      return (
        <div className="space-y-3">
          <Input
            label="Заголовок"
            value={String(data.title ?? "")}
            onChange={(e) => set({ title: e.target.value })}
          />
          <TextArea
            label="Текст"
            value={String(data.body ?? "")}
            onChange={(value) => set({ body: value })}
            rows={3}
          />
          <Input
            label="Текст кнопки"
            value={String(data.buttonLabel ?? "")}
            onChange={(e) => set({ buttonLabel: e.target.value })}
          />
          <Input
            label="Ссылка"
            value={String(data.href ?? "")}
            onChange={(e) => set({ href: e.target.value })}
          />
        </div>
      );
    case "news":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Сколько показать"
            type="number"
            min={1}
            max={50}
            value={String(data.limit ?? 5)}
            onChange={(e) => set({ limit: Number(e.target.value) || 5 })}
          />
          <div>
            <FieldLabel>Тип</FieldLabel>
            <select
              className="h-11 w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 text-[15px]"
              value={String(data.kind ?? "all")}
              onChange={(e) => set({ kind: e.target.value })}
            >
              <option value="all">Все</option>
              <option value="news">Новости</option>
              <option value="announcement">Объявления</option>
              <option value="event">События</option>
              <option value="federal">Федеральные</option>
            </select>
          </div>
        </div>
      );
    case "documents":
      return (
        <div className="space-y-3">
          <Input
            label="Категория (slug, необязательно)"
            value={String(data.categorySlug ?? "")}
            onChange={(e) => set({ categorySlug: e.target.value })}
            hint="Например: obrazovanie, sout, otchety"
          />
          <TextArea
            label="Или список slug через запятую"
            value={((data.slugs as string[]) ?? []).join(", ")}
            onChange={(value) =>
              set({
                slugs: value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            rows={2}
          />
        </div>
      );
    case "employees":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Кого показать</FieldLabel>
            <select
              className="h-11 w-full rounded-[var(--radius-md)] border border-line bg-surface px-3 text-[15px]"
              value={String(data.mode ?? "all")}
              onChange={(e) => set({ mode: e.target.value })}
            >
              <option value="all">Все</option>
              <option value="leadership">Руководство</option>
              <option value="teachers">Педагоги</option>
            </select>
          </div>
          <Input
            label="Сколько максимум"
            type="number"
            min={1}
            max={100}
            value={String(data.limit ?? 12)}
            onChange={(e) => set({ limit: Number(e.target.value) || 12 })}
          />
        </div>
      );
    case "accordion": {
      const items =
        (data.items as { question: string; answer: string[] }[]) ?? [];
      return (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="space-y-2 border border-line p-3">
              <Input
                label="Вопрос"
                value={item.question}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, question: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <TextArea
                label="Ответ"
                value={paragraphsToText(item.answer ?? [])}
                onChange={(value) => {
                  const next = items.map((row, i) =>
                    i === index
                      ? { ...row, answer: textToParagraphs(value) }
                      : row,
                  );
                  set({ items: next });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set({ items: items.filter((_, i) => i !== index) })
                }
              >
                Удалить
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({
                items: [
                  ...items,
                  { question: "Новый вопрос", answer: ["Ответ"] },
                ],
              })
            }
          >
            Добавить пункт
          </Button>
        </div>
      );
    }
    case "tabs": {
      const items =
        (data.items as { label: string; paragraphs: string[] }[]) ?? [];
      return (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="space-y-2 border border-line p-3">
              <Input
                label="Название вкладки"
                value={item.label}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <TextArea
                label="Текст"
                value={paragraphsToText(item.paragraphs ?? [])}
                onChange={(value) => {
                  const next = items.map((row, i) =>
                    i === index
                      ? { ...row, paragraphs: textToParagraphs(value) }
                      : row,
                  );
                  set({ items: next });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set({ items: items.filter((_, i) => i !== index) })
                }
              >
                Удалить вкладку
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({
                items: [
                  ...items,
                  { label: `Вкладка ${items.length + 1}`, paragraphs: ["Текст"] },
                ],
              })
            }
          >
            Добавить вкладку
          </Button>
        </div>
      );
    }
    case "table": {
      const columns = (data.columns as string[]) ?? [];
      const rows = (data.rows as string[][]) ?? [];
      return (
        <div className="space-y-3">
          <Input
            label="Столбцы через | "
            value={columns.join(" | ")}
            onChange={(e) =>
              set({
                columns: e.target.value
                  .split("|")
                  .map((c) => c.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextArea
            label="Строки (ячейки через | , новая строка — новая запись)"
            value={rows.map((row) => row.join(" | ")).join("\n")}
            onChange={(value) =>
              set({
                rows: value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => line.split("|").map((c) => c.trim())),
              })
            }
            rows={6}
          />
        </div>
      );
    }
    case "links": {
      const items = (data.items as { label: string; href: string }[]) ?? [];
      return (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 border border-line p-3 sm:grid-cols-2">
              <Input
                label="Название"
                value={item.label}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <Input
                label="Ссылка"
                value={item.href}
                onChange={(e) => {
                  const next = items.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  );
                  set({ items: next });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="sm:col-span-2"
                onClick={() =>
                  set({ items: items.filter((_, i) => i !== index) })
                }
              >
                Удалить
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              set({ items: [...items, { label: "Ссылка", href: "/" }] })
            }
          >
            Добавить ссылку
          </Button>
        </div>
      );
    }
    case "contacts":
      return (
        <div className="space-y-3">
          {(
            [
              ["showAddress", "Адрес"],
              ["showPhone", "Телефон"],
              ["showEmail", "Email"],
              ["showHours", "Режим работы"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data[key] !== false}
                onChange={(e) => set({ [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
          <TextArea
            label="Дополнительная заметка"
            value={String(data.note ?? "")}
            onChange={(value) => set({ note: value })}
            rows={2}
          />
        </div>
      );
    case "html":
      return (
        <TextArea
          label="HTML-код"
          value={String(data.html ?? "")}
          onChange={(value) => set({ html: value })}
          rows={8}
        />
      );
    case "alert":
      return (
        <div className="space-y-3">
          <Input
            label="Заголовок"
            value={String(data.title ?? "")}
            onChange={(e) => set({ title: e.target.value })}
          />
          <TextArea
            label="Текст"
            value={String(data.body ?? "")}
            onChange={(value) => set({ body: value })}
          />
        </div>
      );
    default:
      return (
        <TextArea
          label="Данные (JSON)"
          value={JSON.stringify(data, null, 2)}
          onChange={(value) => {
            try {
              onChange(JSON.parse(value) as Record<string, unknown>);
            } catch {
              /* ignore while typing */
            }
          }}
          rows={8}
        />
      );
  }
}
