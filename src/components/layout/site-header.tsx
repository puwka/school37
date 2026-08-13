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
  "relative inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap px-2.5 font-sans text-[13px] font-medium tracking-[-0.01em] text-graphite no-underline transition-colors duration-150 hover:text-ink xl:px-3 xl:text-[14px]";

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
        const activeMark = (
          <span
            className={cn(
              "pointer-events-none absolute inset-x-2.5 bottom-0 h-[2px] origin-left bg-brick transition-transform duration-200",
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )}
            aria-hidden
          />
        );

        if (item.children?.length) {
          return (
            <Dropdown key={item.href}>
              <DropdownTrigger asChild>
                <button
                  type="button"
                  className={cn("group", navLinkClass, active && "text-ink")}
                >
                  {item.label}
                  <ChevronDown
                    className="size-3.5 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                  {activeMark}
                </button>
              </DropdownTrigger>
              <DropdownContent align="start" className="min-w-[15rem] p-1.5">
                <DropdownItem asChild>
                  <Link href={item.href} className="font-medium">
                    {item.label} — обзор
                  </Link>
                </DropdownItem>
                <div className="my-1.5 h-px bg-line" />
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
            className={cn("group", navLinkClass, active && "text-ink")}
          >
            {item.label}
            {activeMark}
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
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/poisk/?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-surface/95 backdrop-blur-md transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-line shadow-[var(--shadow-xs)]" : "border-line",
      )}
    >
      <div className="container-site">
        {/* Строка 1: бренд + утилиты — меню отдельно, без наложений */}
        <div className="flex h-14 items-center justify-between gap-4 lg:h-[3.75rem]">
          <Link
            href={logoHref}
            className="relative z-10 shrink-0 font-serif text-[1.05rem] font-semibold tracking-[-0.03em] text-ink no-underline sm:text-lg"
          >
            {title}
          </Link>

          <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                <div className="hidden w-40 shrink-0 lg:block xl:w-48">
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
                А+
              </Button>
            ) : null}
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/roditelyam/zayavka/">Заявка</Link>
            </Button>
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

        {/* Строка 2: меню на всю ширину */}
        <MainNav
          items={items}
          currentPath={currentPath}
          className="hidden flex-wrap items-center gap-x-0.5 gap-y-0 border-t border-line py-1 lg:flex"
        />
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="max-h-[min(80vh,640px)] overflow-y-auto border-t border-line bg-surface lg:hidden"
        >
          <nav
            className="container-site flex flex-col py-2"
            aria-label="Мобильное меню"
          >
            {items.map((item) => (
              <div key={item.href} className="border-b border-line last:border-0">
                <Link
                  href={item.href}
                  className="block py-3.5 font-sans text-[15px] font-medium tracking-[-0.01em] text-ink no-underline"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-2.5 pl-3 font-sans text-sm text-graphite no-underline"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/roditelyam/zayavka/"
              className="mt-3 mb-2 inline-flex h-11 items-center justify-center bg-brick px-4 font-sans text-[15px] font-medium text-white no-underline"
              onClick={() => setOpen(false)}
            >
              Подать заявку
            </Link>
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

/** Компактные быстрые действия — полоса ссылок, не карточки */
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
        "flex flex-wrap divide-y divide-line border-y border-line sm:divide-x sm:divide-y-0",
        className,
      )}
    >
      {items.map((item) => {
        const external = item.href.startsWith("http");
        const classNameItem =
          "group flex min-h-[4.5rem] min-w-0 flex-1 basis-[140px] items-center px-4 py-3 font-sans text-[14px] font-medium tracking-[-0.01em] text-ink no-underline transition-colors duration-150 hover:bg-surface sm:px-5";
        const label = (
          <span className="relative pl-0 transition-[padding] duration-200 group-hover:pl-2">
            <span
              className="absolute left-0 top-1/2 h-3 w-[2px] -translate-y-1/2 scale-y-0 bg-brick transition-transform duration-200 group-hover:scale-y-100"
              aria-hidden
            />
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
