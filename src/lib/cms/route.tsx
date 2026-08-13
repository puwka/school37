import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import {
  PedagogamLayout,
  RoditelyamLayout,
  SvedeniyaLayout,
} from "@/components/layout/content";
import { CmsBlocks } from "@/components/cms/blocks";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import { getMenuTree, getPublishedPage, type PublicPage } from "@/server/queries";

function breadcrumbs(page: PublicPage) {
  const items: { label: string; href?: string }[] = [
    { label: "Главная", href: "/" },
  ];
  if (page.layout === "svedeniya" && page.path !== "/svedeniya/") {
    items.push({ label: "Сведения об ОО", href: "/svedeniya/" });
  }
  if (page.layout === "roditelyam" && page.path !== "/roditelyam/") {
    items.push({ label: "Родителям", href: "/roditelyam/" });
  }
  if (page.layout === "pedagogam" && page.path !== "/pedagogam/") {
    items.push({ label: "Педагогам", href: "/pedagogam/" });
  }
  items.push({ label: page.title });
  return items;
}

function breadcrumbJsonLd(page: PublicPage) {
  const crumbs = breadcrumbs(page);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

async function HubLinks({ page }: { page: PublicPage }) {
  const location =
    page.layout === "svedeniya"
      ? "svedeniya"
      : page.layout === "roditelyam"
        ? "roditelyam"
        : page.layout === "pedagogam"
          ? "pedagogam"
          : null;
  const items = location ? await getMenuTree(location) : [];
  const list =
    page.path === "/svedeniya/" ||
    page.path === "/roditelyam/" ||
    page.path === "/pedagogam/"
      ? items
      : items.find((item) => item.href === page.path)?.children ?? [];

  return (
    <nav aria-label="Подразделы" className="mt-8">
      <ol className="grid gap-0 border border-line bg-surface sm:grid-cols-2">
        {list.map((item, index) => (
          <li
            key={item.href}
            className="border-b border-line p-4 last:border-b-0 sm:odd:border-r"
          >
            <p className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
            <Link
              href={item.href}
              className="mt-1 block font-medium text-ink no-underline hover:text-brick"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export async function CmsPageView({ page }: { page: PublicPage }) {
  const header = (
    <PageHeader
      title={page.title}
      description={page.description ?? undefined}
      breadcrumbs={breadcrumbs(page)}
    />
  );

  const body = (
    <>
      <JsonLd data={breadcrumbJsonLd(page)} />
      {header}
      {page.blocks.length ? <CmsBlocks blocks={page.blocks} /> : null}
      {page.template === "hub" ? <HubLinks page={page} /> : null}
    </>
  );

  if (page.layout === "svedeniya") {
    return <SvedeniyaLayout currentPath={page.path}>{body}</SvedeniyaLayout>;
  }
  if (page.layout === "roditelyam") {
    return <RoditelyamLayout currentPath={page.path}>{body}</RoditelyamLayout>;
  }
  if (page.layout === "pedagogam") {
    return <PedagogamLayout currentPath={page.path}>{body}</PedagogamLayout>;
  }
  return <main className="container-site py-8 md:py-10">{body}</main>;
}

export function createCmsPage(path: string) {
  async function generateMetadata(): Promise<Metadata> {
    const page = await getPublishedPage(path);
    if (!page) return { title: "Страница не найдена", robots: { index: false } };
    return buildPageMetadata({
      title: page.seoTitle ?? page.title,
      description: page.seoDescription ?? page.description,
      path: page.path,
    });
  }

  async function Page() {
    const page = await getPublishedPage(path);
    if (!page) notFound();
    return <CmsPageView page={page} />;
  }

  return { generateMetadata, Page };
}

export function createCmsSlugPage(prefix: string) {
  async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPublishedPage(`${prefix}${slug}/`);
    if (!page) return { title: "Страница не найдена", robots: { index: false } };
    return buildPageMetadata({
      title: page.seoTitle ?? page.title,
      description: page.seoDescription ?? page.description,
      path: page.path,
    });
  }

  async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPublishedPage(`${prefix}${slug}/`);
    if (!page) notFound();
    return <CmsPageView page={page} />;
  }

  return { generateMetadata, Page };
}
