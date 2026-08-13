import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuickNav } from "@/components/layout/site-header";
import { TextLink } from "@/components/layout/content";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { NewsRow, NewsUrgentBanner } from "@/components/school/news-card";
import { StaffHighlight } from "@/components/school/staff-card";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAnnouncements,
  getLatestNews,
  getMenuTree,
  getSchool,
  getSetting,
  getUrgentNews,
} from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  return buildPageMetadata({
    title: school.shortName,
    absoluteTitle: true,
    description: `${school.fullName}. Основана ${school.founded}. ${school.address.full}.`,
    path: "/",
  });
}

export default async function HomePage() {
  const [school, urgent, latest, announcements, quickActions, levels] =
    await Promise.all([
      getSchool(),
      getUrgentNews(),
      getLatestNews(3),
      getAnnouncements(3),
      getMenuTree("quick"),
      getSetting("education.levels") as Promise<
        | {
            short: string;
            level: string;
            grades: string;
            form: string;
            years: string;
            href: string;
            note?: string;
          }[]
        | null
      >,
    ]);
  const educationLevels = levels ?? [];
  const map = school.map ?? {
    lon: 58.474556,
    lat: 51.229361,
    yandexUrl:
      "https://yandex.ru/maps/?ll=58.474556%2C51.229361&z=17&pt=58.474556%2C51.229361%2Cpm2rdm",
  };

  return (
    <main>
      {urgent ? (
        <div className="border-b border-line bg-surface">
          <div className="container-site py-3">
            <NewsUrgentBanner
              title={urgent.title}
              href={`/novosti/${urgent.slug}/`}
              date={urgent.dateLabel}
              dateTime={urgent.date}
              category={urgent.category}
            />
          </div>
        </div>
      ) : null}

      <section
        className="border-b border-line bg-surface"
        aria-labelledby="home-title"
      >
        <div className="container-site py-8 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-brick">
                С 1963 года · {school.motto}
              </p>
              <h1
                id="home-title"
                className="mt-3 max-w-[42rem] break-words font-serif text-[clamp(1.625rem,3.2vw,2.5rem)] font-semibold leading-[1.15] text-ink"
              >
                {school.fullName}
              </h1>
              <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-graphite">
                {school.aboutShort[0]}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                <TextLink href="/o-shkole/">О школе</TextLink>
                <TextLink href="/roditelyam/priem/">Поступление</TextLink>
                <TextLink href="/roditelyam/zayavka/">Заявка в школу</TextLink>
                <TextLink href="/svedeniya/dokumenty/">Документы</TextLink>
              </div>
            </div>

            <figure className="relative min-w-0 overflow-hidden border border-line bg-paper-muted">
              <OptimizedImage
                src="/uploads/images/school.jpg"
                alt="Здание МОАУ СОШ №37 г. Орска"
                width={720}
                height={480}
                className="aspect-[3/2] w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
              <figcaption className="border-t border-line bg-surface px-4 py-3 text-sm text-graphite">
                {school.address.street}, {school.address.city}
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 grid gap-6 border-t border-line pt-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            <div className="min-w-0 md:pr-6">
              <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Учреждение
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                Основана {school.founded}. Учредитель — {school.founder.name}.
                Полномочия учредителя осуществляет{" "}
                {school.founder.authority}.
              </p>
            </div>
            <div className="min-w-0 md:px-6">
              <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Режим
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                {school.weekDays}, {school.shifts}, урок{" "}
                {school.lessonDuration}. Обучение на {school.language.slice(0, -2)}ом
                языке. График: {school.workHoursShort}.
              </p>
            </div>
            <div className="min-w-0 md:pl-6">
              <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Как добраться
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                Маршруты {school.routes.join(", ")}, остановка «{school.stop}».
              </p>
              <p className="mt-2">
                <TextLink href="/kontakty/">Контакты и карта →</TextLink>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-6 md:py-8">
        <QuickNav items={[...quickActions]} />
      </section>

      <section className="container-site pb-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Новости
              </h2>
              <TextLink href="/novosti/">Все новости</TextLink>
            </div>
            <div className="border border-line bg-surface px-4">
              {latest.map((item) => (
                <NewsRow
                  key={item.slug}
                  title={item.title}
                  href={`/novosti/${item.slug}/`}
                  date={item.dateLabel}
                  dateTime={item.date}
                  category={item.category}
                />
              ))}
            </div>
          </div>

          {announcements.length > 0 ? (
            <div className="min-w-0">
              <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
                Объявления
              </h2>
              <Accordion
                type="single"
                collapsible
                defaultValue={announcements[0]?.slug}
                className="border-t border-line"
              >
                {announcements.map((item) => (
                  <AccordionItem key={item.slug} value={item.slug}>
                    <AccordionTrigger>
                      <span className="pr-2 text-left">
                        <span className="block text-xs font-normal text-graphite">
                          {item.dateLabel}
                        </span>
                        {item.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{item.excerpt}</p>
                      <p className="mt-3">
                        <TextLink href={`/novosti/${item.slug}/`}>
                          Читать полностью →
                        </TextLink>
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-site grid gap-10 py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              О школе
            </h2>
            <div className="mt-4 max-w-prose space-y-4 text-[17px] leading-relaxed text-ink">
              {school.aboutShort.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
              <TextLink href="/o-shkole/istoriya/">История</TextLink>
              <TextLink href="/o-shkole/">О школе</TextLink>
              <TextLink href="/o-shkole/dostizheniya/">Достижения</TextLink>
            </div>
          </div>
          <ol className="min-w-0 space-y-0 border-l border-line pl-5">
            {school.timeline.map((item) => (
              <li key={item.year} className="relative pb-6 last:pb-0">
                <span
                  className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-brick"
                  aria-hidden
                />
                <p className="font-sans text-sm font-medium text-brick">
                  {item.year}
                </p>
                <p className="mt-1 text-[15px] text-ink">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site py-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Образование
          </h2>
          <TextLink href="/svedeniya/obrazovanie/">
            Все программы и учебные планы →
          </TextLink>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Уровень</TableHead>
                <TableHead>Классы</TableHead>
                <TableHead>Форма</TableHead>
                <TableHead>Срок</TableHead>
                <TableHead>Программа</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educationLevels.map((row) => (
                <TableRow key={row.short}>
                  <TableCell className="min-w-[10rem] font-medium">
                    {row.level}
                    {"note" in row && row.note ? (
                      <span className="mt-1 block text-sm font-normal text-graphite">
                        {row.note}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>{row.grades}</TableCell>
                  <TableCell>{row.form}</TableCell>
                  <TableCell>{row.years}</TableCell>
                  <TableCell>
                    <Link
                      href={row.href}
                      className="text-brick no-underline hover:underline"
                    >
                      Открыть {row.short}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="container-site pb-10">
        <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
          Руководство
        </h2>
        <StaffHighlight
          name={school.director.name}
          role={school.director.role}
          href={`/svedeniya/pedagogicheskiy-sostav/${school.director.slug}/`}
          phone={school.phone}
          email={school.email}
          receptionHours={school.director.reception}
          photoSrc="/uploads/staff/person-2.jpg"
        />
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-site grid gap-10 py-10 md:grid-cols-2">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Родителям
            </h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              {[
                ["/roditelyam/priem/", "Поступление и закреплённая территория"],
                ["/svedeniya/pitanie/", "Питание и меню"],
                ["/roditelyam/uchebniki/", "Обеспечение учебниками"],
                ["/roditelyam/lager/", "Лагерь «Дорогою добра»"],
                ["/roditelyam/ovz/", "Детям с ОВЗ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <TextLink href={href}>{label} →</TextLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              Официально
            </h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              {[
                ["/svedeniya/", "Сведения об образовательной организации"],
                ["/svedeniya/dokumenty/", "Документы"],
                ["/svedeniya/noko/", "Независимая оценка качества"],
                ["/roditelyam/servisy/", "Электронные сервисы"],
              ].map(([href, label]) => (
                <li key={href}>
                  <TextLink href={href}>{label} →</TextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-site py-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">Контакты</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <dl className="min-w-0 space-y-4 text-[15px]">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Адрес
              </dt>
              <dd className="mt-1 text-ink">{school.address.full}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Телефон
              </dt>
              <dd className="mt-1">
                <a
                  href={`tel:${school.phoneTel}`}
                  className="text-ink hover:text-brick"
                >
                  {school.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${school.email}`}
                  className="break-all text-ink hover:text-brick"
                >
                  {school.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Как добраться
              </dt>
              <dd className="mt-1 text-ink">
                Маршруты {school.routes.join(", ")}, остановка «{school.stop}».
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
                Учредитель
              </dt>
              <dd className="mt-1 text-ink">
                {school.founder.authority}
                <br />
                <a
                  href={school.founder.site}
                  className="text-brick hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {school.founder.site.replace("https://", "")}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-4">
            <TextLink href={school.enrollmentUrl} external>
              Запись в школу на Госуслугах →
            </TextLink>
            <TextLink href="/kontakty/">Все контакты →</TextLink>
          </div>

          <div className="min-w-0 overflow-hidden border border-line bg-surface">
            {map ? (
              <iframe
                title={`Карта: ${school.address.full}`}
                src={`https://yandex.ru/map-widget/v1/?ll=${map.lon}%2C${map.lat}&z=16&l=map&pt=${map.lon}%2C${map.lat}%2Cpm2rdm`}
                className="aspect-[16/10] w-full border-0 sm:aspect-[16/9]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-paper-muted p-6 text-center text-sm text-graphite">
                <TextLink href="/kontakty/">Карта и схема проезда на странице контактов →</TextLink>
              </div>
            )}
            <p className="border-t border-line px-4 py-3 text-sm">
              <a
                href={map.yandexUrl}
                className="text-brick no-underline hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть в Яндекс.Картах →
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
