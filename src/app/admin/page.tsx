import Link from "next/link";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { db } from "@/db";
import { documents, employees, news, pages } from "@/db/schema";
import { getSession } from "@/server/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [[pagesCount], [newsCount], [docsCount], [staffCount]] =
    await Promise.all([
      db.select({ value: count() }).from(pages),
      db.select({ value: count() }).from(news),
      db.select({ value: count() }).from(documents),
      db.select({ value: count() }).from(employees),
    ]);

  const cards = [
    {
      title: "Страницы",
      count: pagesCount.value,
      href: "/admin/pages",
      hint: "Block-редактор CMS",
    },
    {
      title: "Новости",
      count: newsCount.value,
      href: "/admin/news",
      hint: "Новости, объявления, мероприятия",
    },
    {
      title: "Документы",
      count: docsCount.value,
      href: "/admin/documents",
      hint: "PDF и DOCX для реестра",
    },
    {
      title: "Сотрудники",
      count: staffCount.value,
      href: "/admin/employees",
      hint: "Педагогический состав",
    },
  ];

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Обзор</h1>
          <p className="mt-1 text-sm text-muted">
            Управление контентом сайта {session.role === "admin" ? "· администратор" : "· редактор"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block border border-line bg-surface p-5 no-underline transition-colors hover:border-line-strong hover:bg-paper-muted/30"
            >
              <p className="text-sm text-muted">{card.hint}</p>
              <p className="mt-2 font-serif text-xl font-semibold text-ink group-hover:text-brick">
                {card.title}
              </p>
              <p className="mt-3 font-sans text-3xl font-semibold tabular-nums text-brick">
                {card.count}
              </p>
            </Link>
          ))}
        </div>

        <div className="border border-line bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold">Быстрые действия</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            <li>
              <Link href="/admin/news/new" className="text-brick no-underline hover:underline">
                + Новость
              </Link>
            </li>
            <li>
              <Link href="/admin/documents/new" className="text-brick no-underline hover:underline">
                + Документ
              </Link>
            </li>
            <li>
              <Link href="/admin/employees/new" className="text-brick no-underline hover:underline">
                + Сотрудник
              </Link>
            </li>
            <li>
              <Link href="/admin/migration" className="text-graphite no-underline hover:text-brick">
                Статус переноса →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </AdminChrome>
  );
}
