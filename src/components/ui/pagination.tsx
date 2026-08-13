import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}

function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const result: (number | "…")[] = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) result.push(i);
      return result;
    }
    result.push(1);
    if (page > 3) result.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(pageCount - 1, page + 1);
      i++
    ) {
      result.push(i);
    }
    if (page < pageCount - 2) result.push("…");
    result.push(pageCount);
    return result;
  }, [page, pageCount]);

  return (
    <nav
      aria-label="Пагинация"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Предыдущая страница"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        <ChevronLeft />
      </Button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 font-sans text-sm text-muted"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            type="button"
            variant={p === page ? "soft" : "ghost"}
            size="icon"
            aria-label={`Страница ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange?.(p)}
            className={cn(
              p === page && "pointer-events-none",
            )}
          >
            {p}
          </Button>
        ),
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Следующая страница"
        disabled={page >= pageCount}
        onClick={() => onPageChange?.(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

export { Pagination };
