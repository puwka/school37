"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardDescription,
  CardTitle,
  DocumentRow,
  DocumentTile,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  EventCard,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  NewsRow,
  NewsUrgentBanner,
  Pagination,
  QuickNav,
  Search,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarNav,
  SiteHeader,
  StaffHighlight,
  StaffRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";

const NAV = [
  {
    label: "О школе",
    href: "/o-shkole/",
    children: [
      { label: "История", href: "/o-shkole/istoriya/" },
      { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
      { label: "Педагоги", href: "/svedeniya/pedagogicheskiy-sostav/" },
    ],
  },
  { label: "Сведения об ОО", href: "/svedeniya/" },
  { label: "Родителям", href: "/roditelyam/" },
  { label: "Документы", href: "/svedeniya/dokumenty/" },
  { label: "Новости", href: "/novosti/" },
  { label: "Контакты", href: "/kontakty/" },
];

const SIDEBAR = [
  { label: "Основные сведения", href: "/svedeniya/osnovnye-svedeniya/" },
  {
    label: "Структура",
    href: "/svedeniya/struktura/",
    children: [
      { label: "Педагогический совет", href: "/svedeniya/struktura/pedsovet/" },
      { label: "Родительский совет", href: "/svedeniya/struktura/roditelskiy-sovet/" },
    ],
  },
  { label: "Документы", href: "/svedeniya/dokumenty/" },
  { label: "Образование", href: "/svedeniya/obrazovanie/" },
  { label: "Руководство", href: "/svedeniya/rukovodstvo/" },
  { label: "Педагогический состав", href: "/svedeniya/pedagogicheskiy-sostav/" },
  { label: "Организация питания", href: "/svedeniya/pitanie/" },
];

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-line py-12 last:border-b-0">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      {note ? <p className="mt-2 max-w-prose text-[15px] text-graphite">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-paper-muted">
        <div className="container-site flex h-10 items-center justify-between gap-4 text-sm text-graphite">
          <span>ул. Спортивная, 12</span>
          <span className="hidden sm:inline">8 (3537) 373-550 · schkool-370rs.k@yandex.ru</span>
          <span>Пн–Пт 8:00–18:30</span>
        </div>
      </div>

      <SiteHeader items={NAV} currentPath="/design-system" />

      <main className="container-site py-10">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Дизайн-система" },
          ]}
        />

        <header className="mt-6 max-w-prose">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.06em] text-muted">
            Design system
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
            Кирпич и бумага
          </h1>
          <p className="mt-3 text-[17px] text-graphite">
            Компоненты для официального сайта МОАУ «СОШ №37 г. Орска». Основаны на
            Radix/shadcn-паттернах доступности, но визуально адаптированы: без
            pill-кнопок, glow и SaaS-карточек.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="hidden lg:block">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.04em] text-muted">
              На этой странице
            </p>
            <ul className="space-y-1 text-sm text-graphite">
              {[
                ["tokens", "Токены"],
                ["buttons", "Buttons"],
                ["forms", "Inputs / Select / Search"],
                ["feedback", "Badge / Alert"],
                ["cards", "Cards"],
                ["disclosure", "Accordion / Tabs / Modal"],
                ["data", "Table / Pagination"],
                ["nav", "Navigation / Sidebar"],
                ["domain", "Документы / Новости / Сотрудники"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={`#${href}`} className="hover:text-brick">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Section
              id="tokens"
              title="Токены"
              note="Бумага, чернила, кирпич здания 1963 года. Один акцентный цвет."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["paper", "#F7F5F0", "bg-paper"],
                  ["surface", "#FFFFFF", "bg-surface"],
                  ["ink", "#1A1A18", "bg-ink"],
                  ["brick", "#9B3D32", "bg-brick"],
                  ["graphite", "#5C5C58", "bg-graphite"],
                  ["line", "#E3E0D8", "bg-line"],
                  ["brick-tint", "#F3EBEA", "bg-brick-tint"],
                  ["success", "#2F6B4F", "bg-success"],
                ].map(([name, hex, bg]) => (
                  <div key={name} className="border border-line bg-surface p-3">
                    <div className={`mb-2 h-12 border border-line ${bg}`} />
                    <p className="text-sm font-medium text-ink">{name}</p>
                    <p className="text-xs text-graphite">{hex}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-graphite">
                Типографика: заголовки — Literata (serif), интерфейс — Golos Text.
                Радиусы: 4 / 6 / 8 px. Тени почти отсутствуют.
              </p>
            </Section>

            <Section id="buttons" title="Buttons" note="Одна primary на viewport. Radius 4px.">
              <div className="flex flex-wrap gap-3">
                <Button>Скачать документ</Button>
                <Button variant="secondary">Все документы</Button>
                <Button variant="soft">Мягкий акцент</Button>
                <Button variant="ghost">Отмена</Button>
                <Button variant="link">Подробнее</Button>
              </div>
            </Section>

            <Section id="forms" title="Inputs, Select, Search">
              <div className="grid max-w-xl gap-4">
                <Input label="Электронная почта" placeholder="name@example.ru" hint="Для обратной связи" />
                <Input label="С ошибкой" error="Обязательное поле" />
                <Select>
                  <SelectTrigger label="Категория документа">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ustav">Основные</SelectItem>
                    <SelectItem value="local">Локальные акты</SelectItem>
                    <SelectItem value="food">Питание</SelectItem>
                    <SelectItem value="finance">ФХД</SelectItem>
                  </SelectContent>
                </Select>
                <Search
                  placeholder="Поиск по документам…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClear={() => setQuery("")}
                />
              </div>
            </Section>

            <Section id="feedback" title="Badges и Alerts" note="Метки — uppercase, не rounded-full.">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge>Новость</Badge>
                <Badge variant="brick">Объявление</Badge>
                <Badge variant="outline">Документ</Badge>
                <Badge variant="success">ЭП</Badge>
                <Badge variant="warning">Срок</Badge>
              </div>
              <div className="grid gap-3">
                <Alert variant="info" title="Информация">
                  Расписание на учебный год публикуется в разделе «Родителям».
                </Alert>
                <Alert variant="warning" title="Срок приёма">
                  Приём в 1 класс для закреплённой территории завершается 1 июля.
                </Alert>
                <Alert variant="danger" title="Важно">
                  21 апреля 2026 — нерабочий день (Радоница).
                </Alert>
              </div>
            </Section>

            <Section
              id="cards"
              title="Cards — разные типы"
              note="Не один шаблон. Surface / panel / accent / plain."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Card variant="surface">
                  <CardTitle>Surface</CardTitle>
                  <CardDescription>
                    Белая панель с рамкой — служебные факты, контакты.
                  </CardDescription>
                </Card>
                <Card variant="panel">
                  <CardTitle>Panel</CardTitle>
                  <CardDescription>
                    Приглушённый фон без рамки — вторичные блоки.
                  </CardDescription>
                </Card>
                <Card variant="accent" className="md:col-span-2">
                  <CardTitle>Accent</CardTitle>
                  <CardDescription>
                    Кирпичная полоса слева — срочные объявления и официальные
                    предупреждения.
                  </CardDescription>
                </Card>
              </div>
            </Section>

            <Section id="disclosure" title="Accordion, Tabs, Modal, Dropdown">
              <Accordion type="single" collapsible className="mb-8 max-w-xl border-t border-line">
                <AccordionItem value="1">
                  <AccordionTrigger>Что такое «освобождение от физкультуры»?</AccordionTrigger>
                  <AccordionContent>
                    Справка освобождает от нагрузок, но не от присутствия на уроке —
                    предмет должен быть в аттестате.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger>Как записаться в 1 класс?</AccordionTrigger>
                  <AccordionContent>
                    Через Госуслуги или лично в школе. Подробности — в разделе
                    «Поступление».
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Tabs defaultValue="docs" className="mb-8 max-w-xl">
                <TabsList>
                  <TabsTrigger value="docs">Документы</TabsTrigger>
                  <TabsTrigger value="food">Питание</TabsTrigger>
                  <TabsTrigger value="camp">Лагерь</TabsTrigger>
                </TabsList>
                <TabsContent value="docs">Реестр устава и локальных актов.</TabsContent>
                <TabsContent value="food">Меню и акты контроля качества.</TabsContent>
                <TabsContent value="camp">Программа лагеря «Дорогою добра».</TabsContent>
              </Tabs>

              <div className="flex flex-wrap gap-3">
                <Dropdown>
                  <DropdownTrigger asChild>
                    <Button variant="secondary">Dropdown ▾</Button>
                  </DropdownTrigger>
                  <DropdownContent>
                    <DropdownLabel>Действия</DropdownLabel>
                    <DropdownItem>Скачать PDF</DropdownItem>
                    <DropdownItem>Открыть в браузере</DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem>Скопировать ссылку</DropdownItem>
                  </DropdownContent>
                </Dropdown>

                <Modal>
                  <ModalTrigger asChild>
                    <Button>Открыть modal</Button>
                  </ModalTrigger>
                  <ModalContent>
                    <ModalHeader>
                      <ModalTitle>Подтверждение</ModalTitle>
                      <ModalDescription>
                        Документ будет открыт в новой вкладке.
                      </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                      <ModalClose asChild>
                        <Button variant="ghost">Отмена</Button>
                      </ModalClose>
                      <Button>Открыть</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
            </Section>

            <Section id="data" title="Table и Pagination">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Уровень</TableHead>
                    <TableHead>Классы</TableHead>
                    <TableHead>Форма</TableHead>
                    <TableHead>Программа</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>НОО</TableCell>
                    <TableCell>1–4</TableCell>
                    <TableCell>очная</TableCell>
                    <TableCell>
                      <a href="/svedeniya/obrazovanie/" className="text-brick underline">
                        ООП НОО
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ООО</TableCell>
                    <TableCell>5–9</TableCell>
                    <TableCell>очная</TableCell>
                    <TableCell>
                      <a href="/svedeniya/obrazovanie/" className="text-brick underline">
                        ООП ООО
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>СОО</TableCell>
                    <TableCell>10–11</TableCell>
                    <TableCell>очная</TableCell>
                    <TableCell>
                      <a href="/svedeniya/obrazovanie/" className="text-brick underline">
                        ООП СОО
                      </a>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-6">
                <Pagination page={page} pageCount={12} onPageChange={setPage} />
              </div>
            </Section>

            <Section id="nav" title="Navigation и Sidebar">
              <p className="mb-4 text-sm text-graphite">
                Header и utility-полоса — выше на странице. Ниже: быстрые действия и
                оглавление «Сведений».
              </p>
              <QuickNav
                className="mb-8"
                items={[
                  { label: "Поступление", href: "/roditelyam/priem/" },
                  { label: "Расписание", href: "/roditelyam/raspisanie/" },
                  { label: "Питание", href: "/svedeniya/pitanie/" },
                  { label: "Документы", href: "/svedeniya/dokumenty/" },
                  { label: "Госуслуги", href: "https://www.gosuslugi.ru/600412/1/form/" },
                ]}
              />
              <div className="max-w-xs border border-line bg-surface p-4">
                <SidebarNav
                  items={SIDEBAR}
                  currentPath="/svedeniya/dokumenty/"
                />
              </div>
            </Section>

            <Section
              id="domain"
              title="Доменные компоненты"
              note="Документы — строки реестра. Новости — список. Сотрудники — строки и highlight директора."
            >
              <NewsUrgentBanner
                className="mb-8"
                title="Приём в 1 класс!!!!!!!! Приём в 2025–2026 уч. г. окончен"
                href="/novosti/priem-1-klass"
                date="12 августа 2025"
              />

              <div className="mb-8 border border-line bg-surface px-4">
                <NewsRow
                  title="Приём граждан по вопросам коррупционных правонарушений"
                  href="/novosti/priem-grazhdan"
                  date="26 июня 2025"
                  category="Объявление"
                />
                <NewsRow
                  title="Сдаем вместе. День сдачи ЕГЭ родителями"
                  href="/novosti/sdaem-vmeste"
                  date="12 февраля 2025"
                  category="Новость"
                />
              </div>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div>
                  <EventCard
                    title="Мой Додыр"
                    href="/novosti/moy-dodyr"
                    date="14–18 октября 2024"
                    excerpt="Акция чистых рук среди учащихся."
                  />
                  <EventCard
                    title="Мы за здоровый образ жизни"
                    href="/novosti/zozh"
                    date="12–13 сентября 2024"
                    excerpt="Конкурс рисунков учащихся 5–6 классов."
                  />
                </div>
                <DocumentTile
                  title="Устав образовательной организации"
                  href="/svedeniya/dokumenty/ustav"
                  category="Основные"
                  date="01.02.2016"
                />
              </div>

              <div className="mb-8 border border-line bg-surface px-4">
                <DocumentRow
                  title="Перечень учебников на 2025–2026 учебный год"
                  href="/files/uchebniki.docx"
                  category="Образование"
                  date="2025"
                  sizeLabel="25 КБ"
                />
                <DocumentRow
                  title="Устав МОАУ «СОШ №37 г. Орска»"
                  href="/files/ustav.pdf"
                  category="Основные"
                  date="01.02.2016"
                  sizeLabel="1,2 МБ"
                  signed
                />
              </div>

              <StaffHighlight
                className="mb-6"
                name="Ожерельева Елена Геннадьевна"
                role="Директор школы"
                href="/svedeniya/pedagogicheskiy-sostav/ozherelyeva"
                phone="+7 (3537) 373-550"
                receptionHours="14:00–15:30"
              />

              <div className="border border-line bg-surface px-4">
                <StaffRow
                  name="Соловых Наталья Витальевна"
                  role="Заместитель директора · учитель иностранного языка"
                  href="/svedeniya/pedagogicheskiy-sostav/solovyh"
                  subjects={["Иностранный язык"]}
                />
                <StaffRow
                  name="Черник Оксана Викторовна"
                  role="Учитель информатики"
                  href="/svedeniya/pedagogicheskiy-sostav/chernik"
                  subjects={["Информатика"]}
                />
              </div>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}
