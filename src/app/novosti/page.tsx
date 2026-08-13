import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { NewsRow, EventCard } from "@/components/school/news-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPageMetadata } from "@/lib/seo";
import { getAllNews, getEvents, getSchool } from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  return buildPageMetadata({
    title: "Новости",
    description: `Новости и мероприятия ${school.shortName}.`,
    path: "/novosti/",
  });
}

export default async function NewsPage() {
  const [news, events] = await Promise.all([getAllNews(), getEvents()]);
  const feed = news.filter((item) => item.type !== "federal");

  return (
    <main className="container-site py-8 md:py-10">
      <PageHeader
        title="Новости"
        description="Объявления школы, новости и прошедшие мероприятия."
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Новости" },
        ]}
      />

      <Tabs defaultValue="all">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="news">Новости и объявления</TabsTrigger>
          <TabsTrigger value="events">Мероприятия</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="border border-line bg-surface px-4">
            {feed.map((item) => (
              <NewsRow
                key={item.slug}
                title={item.title}
                href={`/novosti/${item.slug}/`}
                date={item.dateLabel}
                category={item.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="border border-line bg-surface px-4">
            {feed
              .filter((item) => item.type !== "event")
              .map((item) => (
                <NewsRow
                  key={item.slug}
                  title={item.title}
                  href={`/novosti/${item.slug}/`}
                  date={item.dateLabel}
                  category={item.category}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="max-w-prose space-y-0">
            {events.map((item) => (
              <EventCard
                key={item.slug}
                title={item.title}
                href={`/novosti/${item.slug}/`}
                date={item.dateLabel}
                excerpt={item.excerpt}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
