"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Обзор", exact: true },
  { href: "/admin/pages", label: "Страницы" },
  { href: "/admin/news", label: "Новости" },
  { href: "/admin/documents", label: "Документы" },
  { href: "/admin/employees", label: "Сотрудники" },
  { href: "/admin/applications", label: "Заявки" },
  { href: "/admin/migration", label: "Перенос" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "no-underline transition-colors",
              active ? "font-medium text-brick" : "text-graphite hover:text-brick",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Link href="/" className="text-graphite no-underline hover:text-brick">
        Сайт
      </Link>
    </nav>
  );
}
