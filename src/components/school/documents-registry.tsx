"use client";

import * as React from "react";
import { DocumentRow } from "@/components/school/document-card";
import { Search } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <Search
        placeholder="Поиск по названию документа…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery("")}
        aria-label="Поиск документов"
      />

      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Категории документов"
      >
        {["Все", ...categories].map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={category === item ? "soft" : "ghost"}
            className="shrink-0"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </Button>
        ))}
      </div>

      <p className="text-sm text-graphite">Найдено: {filtered.length}</p>

      <div
        className={cn(
          "border border-line bg-surface px-4",
          filtered.length === 0 && "py-8 text-center text-graphite",
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
