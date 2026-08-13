import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { TextLink } from "@/components/layout/content";
import { buildPageMetadata } from "@/lib/seo";
import { searchSite } from "@/server/queries";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return buildPageMetadata({
    title: q ? `Поиск: ${q}` : "Поиск",
    description: "Поиск по страницам, новостям и документам сайта школы.",
    path: "/poisk/",
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchSite(query) : [];

  return (
    <main className="container-site py-8 md:py-10">
      <PageHeader
        title="Поиск"
        description="Страницы, новости и документы школы."
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Поиск" },
        ]}
      />

      <form action="/poisk/" method="get" className="mt-6 max-w-xl">
        <label className="sr-only" htmlFor="site-search">
          Поисковый запрос
        </label>
        <div className="flex gap-2">
          <input
            id="site-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Введите запрос…"
            className="h-11 min-w-0 flex-1 rounded-[var(--radius-md)] border border-line bg-surface px-3 font-sans text-[15px]"
            autoFocus={!query}
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-[var(--radius-md)] bg-brick px-5 font-sans text-[15px] font-medium text-white hover:bg-brick-hover"
          >
            Найти
          </button>
        </div>
      </form>

      {query ? (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-graphite">
            По запросу «{query}» найдено: {results.length}
          </p>

          {results.length === 0 ? (
            <p className="text-[15px] text-ink">
              Ничего не найдено. Попробуйте другие слова или перейдите в{" "}
              <TextLink href="/svedeniya/dokumenty/">реестр документов</TextLink>.
            </p>
          ) : (
            <ul className="divide-y divide-line border border-line bg-surface">
              {results.map((item) => (
                <li key={`${item.typeLabel}-${item.href}-${item.title}`}>
                  <Link
                    href={item.href}
                    className="block px-4 py-4 no-underline transition-colors hover:bg-paper-muted/50"
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">
                      {item.typeLabel}
                    </span>
                    <p className="mt-1 font-serif text-lg font-semibold text-ink">
                      {item.title}
                    </p>
                    {item.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-graphite">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </main>
  );
}
