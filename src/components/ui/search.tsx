"use client";

import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  appearance?: "compact" | "field";
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    { className, value, onClear, appearance = "field", onChange, ...props },
    ref,
  ) => {
    const showClear = Boolean(value) && Boolean(onClear);
    return (
      <div
        className={cn(
          "relative flex w-full items-center",
          appearance === "compact" && "max-w-xs",
        )}
      >
        <SearchIcon
          className="pointer-events-none absolute left-3 size-4 text-graphite"
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          className={cn(
            "h-11 w-full rounded-[var(--radius-md)] border border-line bg-surface pl-10 pr-10 font-sans text-[15px] text-ink placeholder:text-muted",
            "transition-colors duration-150 hover:border-line-strong",
            "focus-visible:border-brick focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brick",
            "[&::-webkit-search-cancel-button]:hidden",
            appearance === "compact" && "h-10 bg-paper",
            className,
          )}
          {...props}
        />
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 rounded-[var(--radius-sm)] p-1.5 text-graphite hover:bg-paper-muted hover:text-ink"
            aria-label="Очистить поиск"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    );
  },
);
Search.displayName = "Search";

export { Search };
