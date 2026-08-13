"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";

export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export interface SiteHeaderProps {
  logoHref?: string;
  title?: string;
  items: NavItem[];
  currentPath?: string;
  showSearch?: boolean;
  onVisuallyImpaired?: () => void;
}

const navLinkClass =
  "inline-flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-[var(--radius-sm)] px-2.5 font-sans text-[14px] font-medium text-graphite no-underline transition-colors hover:bg-paper-muted hover:text-ink lg:h-10 lg:px-3 lg:text-[15px]";

function MainNav({
  items,
  currentPath,
  className,
}: {
  items: NavItem[];
  currentPath: string;
  className?: string;
}) {
  function isActive(item: NavItem) {
    return (
      currentPath === item.href ||
      (item.href !== "/" && currentPath.startsWith(item.href))
    );
  }

  return (
    <nav className={className} aria-label="Главное меню">
      {items.map((item) => {
        const active = isActive(item);
        if (item.children?.length) {
          return (
            <Dropdown key={item.href}>
              <DropdownTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    navLinkClass,
                    active && "bg-brick-tint/60 text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 shrink-0 opacity-60" aria-hidden />
                </button>
              </DropdownTrigger>
              <DropdownContent align="start">
                <DropdownItem asChild>
                  <Link href={item.href}>{item.label} — обзор</Link>
                </DropdownItem>
                {item.children.map((child) => (
                  <DropdownItem key={child.href} asChild>
                    <Link href={child.href}>{child.label}</Link>
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(navLinkClass, active && "bg-brick-tint/60 text-ink")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SiteHeader({
  logoHref = "/",
  title = "МОАУ СОШ №37",
  items,
  currentPath = "/",
  showSearch = true,
  onVisuallyImpaired,
}: SiteHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  function submitSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/poisk/?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-site">
        {/* Верхняя строка: логотип и утилиты — отдельно от меню */}
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href={logoHref}
            className="shrink-0 font-serif text-base font-semibold tracking-tight whitespace-nowrap text-ink no-underline sm:text-lg"
          >
            {title}
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {showSearch ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Поиск по сайту"
                  onClick={() => router.push("/poisk/")}
                >
                  <SearchIcon className="size-5" />
                </Button>
                <div className="hidden w-40 shrink-0 lg:block xl:w-44">
                  <Search
                    appearance="compact"
                    className="!max-w-none w-full"
                    placeholder="Поиск"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClear={() => setQuery("")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitSearch();
                      }
                    }}
                    aria-label="Поиск по сайту"
                  />
                </div>
              </>
            ) : null}
            {onVisuallyImpaired ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onVisuallyImpaired}
                className="hidden whitespace-nowrap lg:inline-flex"
                aria-pressed={false}
                aria-label="Версия для слабовидящих"
              >
                <span className="hidden xl:inline">Версия для слабовидящих</span>
                <span className="xl:hidden" aria-hidden>
                  А+
                </span>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Нижняя строка: меню на всю ширину */}
        <MainNav
          items={items}
          currentPath={currentPath}
          className="hidden flex-wrap items-center gap-x-0.5 gap-y-1 border-t border-line py-1.5 lg:flex"
        />
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-surface lg:hidden">
          <nav className="container-site flex flex-col py-3" aria-label="Мобильное меню">
            {items.map((item) => (
              <div key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 font-sans text-[15px] font-medium text-ink no-underline"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2 pl-4 font-sans text-sm text-graphite no-underline"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            {showSearch ? (
              <Link
                href="/poisk/"
                className="block py-3 font-sans text-[15px] font-medium text-brick no-underline"
                onClick={() => setOpen(false)}
              >
                Поиск по сайту
              </Link>
            ) : null}
            {onVisuallyImpaired ? (
              <button
                type="button"
                className="block w-full py-3 text-left font-sans text-[15px] font-medium text-graphite"
                onClick={() => {
                  onVisuallyImpaired();
                  setOpen(false);
                }}
              >
                Версия для слабовидящих
              </button>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

/** Компактные быстрые действия на главной — не карточки */
export function QuickNav({
  items,
  className,
}: {
  items: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Быстрые действия"
      className={cn(
        "flex flex-wrap border border-line bg-surface",
        className,
      )}
    >
      {items.map((item, index) => {
        const external = item.href.startsWith("http");
        const classNameItem = cn(
          "group flex min-h-[72px] min-w-0 flex-1 basis-[140px] items-center border-line px-4 py-3 font-sans text-[15px] font-medium text-ink no-underline transition-colors hover:bg-paper-muted sm:px-5",
          index > 0 && "border-t sm:border-t-0 sm:border-l",
        );
        const label = (
          <span className="border-l-2 border-transparent transition-all group-hover:border-brick group-hover:pl-2">
            {item.label}
          </span>
        );
        return external ? (
          <a
            key={item.href}
            href={item.href}
            className={classNameItem}
            rel="noopener noreferrer"
            target="_blank"
          >
            {label}
          </a>
        ) : (
          <Link key={item.href} href={item.href} className={classNameItem}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export { SiteHeader };
