"use client";

import * as React from "react";
import { DocumentRow } from "@/components/school/document-card";
import { Search } from "@/components/ui/search";
import { cn } from "@/lib/utils";
import type { PublicDocument } from "@/server/queries";

export function DocumentsRegistry({
  documents,
  categories,
}: {
  documents: PublicDocument[];
  categories: string[];
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("Все");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const byCategory = category === "Все" || doc.category === category;
      const byQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [query, category, documents]);

  return (
    <div className="space-y-7">
      <Search
        placeholder="Поиск по названию документа…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery("")}
        aria-label="Поиск документов"
      />

      <div
        className="-mx-1 flex gap-0 overflow-x-auto border-b border-line px-1"
        role="tablist"
        aria-label="Категории документов"
      >
        {["Все", ...categories].map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={category === item}
            className={cn(
              "relative shrink-0 px-3 py-3 font-sans text-[13px] font-medium tracking-[-0.01em] transition-colors duration-150",
              category === item
                ? "text-ink"
                : "text-muted hover:text-graphite",
            )}
            onClick={() => setCategory(item)}
          >
            {item}
            {category === item ? (
              <span
                className="absolute inset-x-3 bottom-0 h-[2px] bg-brick"
                aria-hidden
              />
            ) : null}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-muted">Найдено: {filtered.length}</p>

      <div
        className={cn(
          "border-t border-line",
          filtered.length === 0 && "border-none py-10 text-center text-graphite",
        )}
      >
        {filtered.length === 0
          ? "Документы не найдены. Измените запрос или категорию."
          : filtered.map((doc) => (
              <DocumentRow
                key={doc.slug}
                title={doc.title}
                href={doc.href}
                downloadable={doc.downloadable}
                category={doc.category}
                date={doc.date}
                sizeLabel={doc.sizeLabel}
                signed={doc.signed}
              />
            ))}
      </div>
    </div>
  );
}
