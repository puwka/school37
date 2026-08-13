"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export interface SidebarNavProps {
  title?: string;
  items: SidebarItem[];
  currentPath?: string;
  className?: string;
}

/**
 * Боковое оглавление для «Сведений об ОО».
 * Desktop: sticky list. Mobile: collapsible «Содержание».
 */
function SidebarNav({
  title = "Содержание",
  items,
  currentPath = "",
  className,
}: SidebarNavProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const list = (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active =
          currentPath === item.href ||
          (item.href !== "/svedeniya/" && currentPath.startsWith(item.href));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block border-l-2 py-2 pl-3 font-sans text-sm no-underline transition-colors",
                active
                  ? "border-brick font-medium text-ink"
                  : "border-transparent text-graphite hover:border-line-strong hover:text-ink",
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
            {item.children?.length ? (
              <ul className="mb-1 ml-3 space-y-0.5">
                {item.children.map((child) => {
                  const childActive = currentPath === child.href;
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          "block py-1.5 pl-3 font-sans text-[13px] no-underline",
                          childActive
                            ? "font-medium text-brick"
                            : "text-graphite hover:text-ink",
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className={cn("font-sans", className)}>
      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between border border-line bg-surface px-4 py-3 text-left text-sm font-medium lg:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            mobileOpen && "rotate-180",
          )}
        />
      </button>

      <div className="hidden lg:block">
        <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.04em] text-muted">
          {title}
        </p>
        {list}
      </div>

      {mobileOpen ? (
        <div className="mb-6 border border-line bg-surface p-3 lg:hidden">
          {list}
        </div>
      ) : null}
    </aside>
  );
}

export { SidebarNav };
