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
import { Button } from "@/components/ui/button";
import {
  NewsFeatured,
  NewsRow,
  NewsUrgentBanner,
} from "@/components/school/news-card";
import { StaffHighlight } from "@/components/school/staff-card";
import { EnrollmentForm } from "@/components/school/enrollment-form";
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
      getLatestNews(5),
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
  const featured = latest[0];
  const restNews = latest.slice(1, 4);

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

      {/* Hero — full-bleed photo plane, brand-first */}
      <section
        className="relative isolate min-h-[min(88vh,760px)] overflow-hidden bg-pine text-white"
        aria-labelledby="home-title"
      >
        <div className="absolute inset-0">
          <OptimizedImage
            src="/uploads/images/school.jpg"
            alt=""
            fill
            className="object-cover object-[50%_40%]"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(105deg,rgba(20,19,18,0.88)_0%,rgba(20,19,18,0.55)_42%,rgba(20,19,18,0.22)_100%)]"
            aria-hidden
          />
        </div>

        <div className="container-site relative flex min-h-[min(88vh,760px)] flex-col justify-end pb-10 pt-24 md:pb-14 md:pt-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)] lg:items-end">
            <div className="min-w-0 max-w-3xl">
              <p className="reveal eyebrow !text-white/70">
                Орск · с 1963 года
              </p>
              <p className="reveal reveal-delay-1 mt-4 font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                {school.brandName}
              </p>
              <h1
                id="home-title"
                className="reveal reveal-delay-2 mt-5 max-w-[34rem] text-[clamp(1.05rem,1.8vw,1.25rem)] font-normal leading-relaxed tracking-[-0.01em] text-white/80"
              >
                {school.motto} Муниципальная школа с очным обучением,
                сильным педагогическим коллективом и вниманием к каждому
                ученику.
              </h1>
              <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="!bg-brick hover:!bg-brick-hover">
                  <Link href="#zayavka">Подать заявку</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="!border-white/35 !bg-transparent !text-white hover:!bg-white/10"
                >
                  <Link href="/roditelyam/priem/">Поступление</Link>
                </Button>
              </div>
            </div>

            <dl className="reveal reveal-delay-2 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/20 pt-6 text-sm sm:max-w-sm lg:justify-self-end lg:border-t-0 lg:border-l lg:border-white/20 lg:pl-8 lg:pt-0">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.1em] text-white/50">
                  Основана
                </dt>
                <dd className="mt-1 font-serif text-2xl tracking-[-0.03em]">
                  1963
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.1em] text-white/50">
                  Режим
                </dt>
                <dd className="mt-1 font-medium leading-snug text-white/90">
                  {school.weekDays}
                  <br />
                  {school.shifts}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-[0.1em] text-white/50">
                  Адрес
                </dt>
                <dd className="mt-1 leading-snug text-white/90">
                  {school.address.street}
                  <br />
                  {school.address.city}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="container-site">
          <QuickNav items={[...quickActions]} className="border-0" />
        </div>
      </section>

      {/* Новости — featured + list */}
      <section className="container-site py-14 md:py-16" aria-labelledby="news-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Лента</p>
            <h2 id="news-title" className="mt-2">
              Новости
            </h2>
          </div>
          <TextLink href="/novosti/">Все материалы →</TextLink>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)]">
          <div className="min-w-0">
            {featured ? (
              <NewsFeatured
                title={featured.title}
                href={`/novosti/${featured.slug}/`}
                date={featured.dateLabel}
                dateTime={featured.date}
                category={featured.category}
                excerpt={featured.excerpt}
                imageSrc="/uploads/images/mto-avgust.jpg"
                imageAlt=""
              />
            ) : null}
          </div>

          <div className="min-w-0">
            {announcements.length > 0 ? (
              <div className="mb-8 lg:mb-10">
                <h3 className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-muted">
                  Объявления
                </h3>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={announcements[0]?.slug}
                  className="mt-3 border-t border-line"
                >
                  {announcements.map((item) => (
                    <AccordionItem key={item.slug} value={item.slug}>
                      <AccordionTrigger>
                        <span className="pr-2 text-left">
                          <span className="block text-[12px] font-normal uppercase tracking-[0.06em] text-muted">
                            {item.dateLabel}
                          </span>
                          <span className="mt-1 block font-medium">{item.title}</span>
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

            <div className="border-t border-line">
              {restNews.map((item) => (
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
        </div>
      </section>

      {/* О школе — editorial + timeline */}
      <section
        className="border-y border-line bg-surface"
        aria-labelledby="about-title"
      >
        <div className="container-site py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow">С 1963 года</p>
              <h2 id="about-title" className="mt-2">
                О школе
              </h2>
              <blockquote className="mt-8 border-l-[3px] border-brick pl-5 font-serif text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug tracking-[-0.025em] text-ink">
                «{school.motto}»
              </blockquote>
              <div className="mt-8 max-w-prose space-y-4 text-[16px] leading-relaxed text-graphite">
                {school.aboutShort.slice(0, 2).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                <TextLink href="/o-shkole/istoriya/">История</TextLink>
                <TextLink href="/o-shkole/">О школе</TextLink>
                <TextLink href="/o-shkole/dostizheniya/">Достижения</TextLink>
              </div>
            </div>

            <div className="min-w-0">
              <div className="media-zoom relative mb-10 aspect-[16/10] overflow-hidden bg-paper-muted">
                <OptimizedImage
                  src="/uploads/images/school.jpg"
                  alt="Здание МОАУ СОШ №37"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
              <ol className="space-y-0">
                {school.timeline.map((item, index) => (
                  <li
                    key={item.year}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-t border-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <p className="font-serif text-xl font-semibold tracking-[-0.03em] text-brick sm:text-2xl">
                      {item.year}
                    </p>
                    <p className="pt-1 text-[15px] leading-relaxed text-ink">
                      {item.text}
                    </p>
                    {index === school.timeline.length - 1 ? null : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {[
              { label: "Выпускников", value: "≈11 000" },
              { label: "Медалистов", value: "217" },
              { label: "Средний возраст педагогов", value: "45 лет" },
            ].map((fact) => (
              <div key={fact.label} className="bg-surface px-5 py-6 sm:px-6">
                <p className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] text-ink">
                  {fact.value}
                </p>
                <p className="mt-2 text-[13px] uppercase tracking-[0.08em] text-muted">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Заявка */}
      <section
        id="zayavka"
        className="border-b border-line"
        aria-labelledby="enrollment-title"
      >
        <div className="container-site py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <div className="min-w-0 lg:sticky lg:top-24">
              <p className="eyebrow">Родителям</p>
              <h2 id="enrollment-title" className="mt-2">
                Заявка в школу
              </h2>
              <p className="lead mt-4 max-w-prose">
                Заполните форму — заявка поступит в администрацию. Мы свяжемся с
                вами по указанному телефону.
              </p>
              <p className="mt-5 text-[15px]">
                <TextLink href="/roditelyam/priem/">
                  Условия поступления и закреплённая территория →
                </TextLink>
              </p>
            </div>
            <div className="min-w-0 border border-line bg-surface p-6 sm:p-8">
              <EnrollmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* Образование */}
      <section className="container-site py-14 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Программы</p>
            <h2 className="mt-2">Образование</h2>
          </div>
          <TextLink href="/svedeniya/obrazovanie/">
            Все программы и учебные планы →
          </TextLink>
        </div>
        <div className="overflow-x-auto border-t border-line">
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

      {/* Руководство */}
      <section className="container-site pb-14 md:pb-16">
        <p className="eyebrow">Администрация</p>
        <h2 className="mt-2 mb-8">Руководство</h2>
        <StaffHighlight
          name={school.director.name}
          role={school.director.role}
          href={`/svedeniya/pedagogicheskiy-sostav/${school.director.slug}/`}
          phone={school.phone}
          email={school.email}
          receptionHours={school.director.reception}
          photoSrc="/uploads/staff/person-2.jpg"
          priority
        />
      </section>

      {/* Родителям / официально */}
      <section className="border-t border-line bg-surface">
        <div className="container-site grid gap-0 py-0 md:grid-cols-2">
          <div className="min-w-0 border-b border-line py-12 md:border-b-0 md:border-r md:pr-12 md:py-14">
            <h2>Родителям</h2>
            <ul className="mt-6 space-y-0">
              {[
                ["/roditelyam/priem/", "Поступление и закреплённая территория"],
                ["/svedeniya/pitanie/", "Питание и меню"],
                ["/roditelyam/uchebniki/", "Обеспечение учебниками"],
                ["/roditelyam/lager/", "Лагерь «Дорогою добра»"],
                ["/roditelyam/ovz/", "Детям с ОВЗ"],
              ].map(([href, label]) => (
                <li key={href} className="border-t border-line first:border-t-0">
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink no-underline transition-colors hover:text-brick"
                  >
                    {label}
                    <span
                      className="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brick"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 py-12 md:pl-12 md:py-14">
            <h2>Официально</h2>
            <ul className="mt-6 space-y-0">
              {[
                ["/svedeniya/", "Сведения об образовательной организации"],
                ["/svedeniya/dokumenty/", "Документы"],
                ["/svedeniya/noko/", "Независимая оценка качества"],
                ["/roditelyam/servisy/", "Электронные сервисы"],
              ].map(([href, label]) => (
                <li key={href} className="border-t border-line first:border-t-0">
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink no-underline transition-colors hover:text-brick"
                  >
                    {label}
                    <span
                      className="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brick"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="container-site py-14 md:py-16">
        <p className="eyebrow">Связь</p>
        <h2 className="mt-2">Контакты</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <dl className="min-w-0 space-y-6 text-[15px]">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                Адрес
              </dt>
              <dd className="mt-2 text-ink">{school.address.full}</dd>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  Телефон
                </dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${school.phoneTel}`}
                    className="font-medium text-ink hover:text-brick"
                  >
                    {school.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${school.email}`}
                    className="break-all font-medium text-ink hover:text-brick"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                Как добраться
              </dt>
              <dd className="mt-2 text-ink">
                Маршруты {school.routes.join(", ")}, остановка «{school.stop}».
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                Учредитель
              </dt>
              <dd className="mt-2 text-ink">
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
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              <TextLink href={school.enrollmentUrl} external>
                Запись на Госуслугах →
              </TextLink>
              <TextLink href="/kontakty/">Все контакты →</TextLink>
            </div>
          </dl>

          <div className="min-w-0 overflow-hidden border border-line bg-surface">
            {map ? (
              <iframe
                title={`Карта: ${school.address.full}`}
                src={`https://yandex.ru/map-widget/v1/?ll=${map.lon}%2C${map.lat}&z=16&l=map&pt=${map.lon}%2C${map.lat}%2Cpm2rdm`}
                className="aspect-[16/11] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex aspect-[16/11] items-center justify-center bg-paper-muted p-6 text-center text-sm text-graphite">
                <TextLink href="/kontakty/">
                  Карта и схема проезда на странице контактов →
                </TextLink>
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
