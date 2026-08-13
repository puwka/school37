import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Prose, TextLink } from "@/components/layout/content";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import { getNewsBySlug } from "@/server/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Новость не найдена", robots: { index: false } };
  return buildPageMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/novosti/${item.slug}/`,
    type: "article",
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <main className="container-site py-8 md:py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          datePublished: item.date,
          description: item.excerpt,
          mainEntityOfPage: absoluteUrl(`/novosti/${item.slug}/`),
          inLanguage: "ru-RU",
        }}
      />
      <PageHeader
        title={item.title}
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Новости", href: "/novosti/" },
          { label: item.title },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant={item.urgent ? "brick" : "default"}>{item.category}</Badge>
        <time className="text-sm text-graphite" dateTime={item.date}>
          {item.dateLabel}
        </time>
      </div>

      <Prose>
        {item.body.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
        ))}
      </Prose>

      <p className="mt-8">
        <TextLink href="/novosti/">← Все новости</TextLink>
      </p>
    </main>
  );
}
