import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentRow } from "@/components/school/document-card";
import { NewsRow } from "@/components/school/news-card";
import { StaffRow } from "@/components/school/staff-card";
import { Prose, TextLink } from "@/components/layout/content";
import {
  getAllDocuments,
  getAllNews,
  getLeadership,
  getSchool,
  getTeachers,
} from "@/server/queries";

export async function CmsBlocks({
  blocks,
}: {
  blocks: { id: string; type: string; data: Record<string, unknown> }[];
}) {
  const types = new Set(blocks.map((block) => block.type));
  const [documents, news, leadership, teachers, school] = await Promise.all([
    types.has("documents") ? getAllDocuments() : Promise.resolve([]),
    types.has("news") ? getAllNews() : Promise.resolve([]),
    types.has("employees") ? getLeadership() : Promise.resolve([]),
    types.has("employees") ? getTeachers() : Promise.resolve([]),
    types.has("contacts") ? getSchool() : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <CmsBlock
          key={block.id}
          block={block}
          documents={documents}
          news={news}
          leadership={leadership}
          teachers={teachers}
          school={school}
        />
      ))}
    </div>
  );
}

function CmsBlock({
  block,
  documents,
  news,
  leadership,
  teachers,
  school,
}: {
  block: { type: string; data: Record<string, unknown> };
  documents: Awaited<ReturnType<typeof getAllDocuments>>;
  news: Awaited<ReturnType<typeof getAllNews>>;
  leadership: Awaited<ReturnType<typeof getLeadership>>;
  teachers: Awaited<ReturnType<typeof getTeachers>>;
  school: Awaited<ReturnType<typeof getSchool>> | null;
}) {
  const data = block.data;
  const type = block.type === "prose" ? "text" : block.type === "link_list" ? "links" : block.type;

  switch (type) {
    case "text": {
      const paragraphs = (data.paragraphs as string[]) ?? [];
      return (
        <Prose>
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </Prose>
      );
    }
    case "heading": {
      const text = String(data.text ?? "");
      const anchor = data.anchor ? String(data.anchor) : undefined;
      const level = Number(data.level) === 3 ? 3 : 2;
      if (level === 3) {
        return (
          <h3 id={anchor} className="scroll-mt-28 font-serif text-lg font-semibold">
            {text}
          </h3>
        );
      }
      return (
        <h2 id={anchor} className="scroll-mt-28 font-serif text-xl font-semibold">
          {text}
        </h2>
      );
    }
    case "image": {
      const src = String(data.src ?? "");
      if (!src) return null;
      const alt = String(data.alt ?? "");
      return (
        <figure className="space-y-2">
          <OptimizedImage
            src={src}
            alt={alt || "Иллюстрация"}
            width={1200}
            height={675}
            className="max-h-[480px] w-full border border-line object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
          {data.caption ? (
            <figcaption className="text-sm text-muted">{String(data.caption)}</figcaption>
          ) : null}
        </figure>
      );
    }
    case "gallery": {
      const items = (data.items as { src: string; alt?: string }[]) ?? [];
      const visible = items.filter((item) => item.src);
      if (!visible.length) return null;
      return (
        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 md:grid-cols-3">
          {visible.map((item, index) => (
            <li key={`${item.src}-${index}`}>
              <OptimizedImage
                src={item.src}
                alt={item.alt || `Фото ${index + 1}`}
                width={640}
                height={480}
                className="aspect-[4/3] w-full border border-line object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </li>
          ))}
        </ul>
      );
    }
    case "cta": {
      return (
        <div className="border border-line bg-surface px-5 py-6 sm:px-8">
          <h2 className="font-serif text-xl font-semibold">{String(data.title ?? "")}</h2>
          {data.body ? (
            <p className="mt-2 max-w-prose text-[15px] text-graphite">
              {String(data.body)}
            </p>
          ) : null}
          <Button asChild className="mt-4">
            <Link href={String(data.href ?? "/")}>{String(data.buttonLabel ?? "Подробнее")}</Link>
          </Button>
        </div>
      );
    }
    case "news": {
      const limit = Number(data.limit) || 5;
      const kind = String(data.kind ?? "all");
      const filtered = news
        .filter((item) => (kind === "all" ? true : item.type === kind))
        .slice(0, limit);
      if (!filtered.length) {
        return <p className="text-sm text-muted">Новостей пока нет.</p>;
      }
      return (
        <div className="border border-line bg-surface px-4">
          {filtered.map((item) => (
            <NewsRow
              key={item.slug}
              title={item.title}
              href={`/novosti/${item.slug}/`}
              date={item.date}
              category={item.category}
              excerpt={item.excerpt}
            />
          ))}
        </div>
      );
    }
    case "employees": {
      const mode = String(data.mode ?? "all");
      const limit = Number(data.limit) || 12;
      const list =
        mode === "leadership"
          ? leadership
          : mode === "teachers"
            ? teachers
            : [...leadership, ...teachers];
      const sliced = list.slice(0, limit);
      if (!sliced.length) {
        return <p className="text-sm text-muted">Сотрудники не найдены.</p>;
      }
      return (
        <div className="divide-y divide-line border border-line bg-surface">
          {sliced.map((person) => (
            <StaffRow
              key={person.slug}
              name={person.name}
              role={person.role}
              href={
                person.isLeadership
                  ? "/svedeniya/rukovodstvo/"
                  : `/svedeniya/pedagogicheskiy-sostav/${person.slug}/`
              }
              subjects={person.subjects}
              phone={person.phone}
              email={person.email}
              photoSrc={person.photoSrc}
            />
          ))}
        </div>
      );
    }
    case "table": {
      const columns = (data.columns as string[]) ?? [];
      const rows = (data.rows as string[][]) ?? [];
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={`${index}-${cellIndex}`}
                      className="whitespace-normal"
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    case "alert": {
      return (
        <Alert
          variant={(data.variant as "info" | "warning" | "success" | "danger") ?? "info"}
          title={data.title ? String(data.title) : undefined}
        >
          {String(data.body ?? "")}
        </Alert>
      );
    }
    case "links": {
      const items = (data.items as { label: string; href: string }[]) ?? [];
      return (
        <ul className="space-y-2 text-[15px]">
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              {item.href.startsWith("http") ? (
                <TextLink href={item.href} external>
                  {item.label} →
                </TextLink>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-brick no-underline hover:underline"
                >
                  {item.label} →
                </Link>
              )}
            </li>
          ))}
        </ul>
      );
    }
    case "definition_list": {
      const items =
        (data.items as { term: string; definition: string }[]) ?? [];
      return (
        <dl className="space-y-3 border border-line bg-surface p-5 text-[15px]">
          {items.map((item) => (
            <div key={item.term}>
              <dt className="text-graphite">{item.term}</dt>
              <dd className="break-words text-ink">{item.definition}</dd>
            </div>
          ))}
        </dl>
      );
    }
    case "documents": {
      const categorySlug = data.categorySlug as string | undefined;
      const slugs = data.slugs as string[] | undefined;
      const filtered = documents.filter((doc) => {
        if (slugs?.length) return slugs.includes(doc.slug);
        if (categorySlug) {
          const map: Record<string, string> = {
            obrazovanie: "Образование",
            fhd: "ФХД",
            sout: "СОУТ",
            otchety: "Отчёты",
            lager: "Лагерь",
            pitanie: "Питание",
          };
          return doc.category === map[categorySlug];
        }
        return true;
      });
      return (
        <div className="border border-line bg-surface px-4">
          {filtered.map((doc) => (
            <DocumentRow
              key={doc.slug}
              title={doc.title}
              href={doc.href}
              downloadable={doc.downloadable}
              category={doc.category}
              date={doc.date}
              sizeLabel={doc.sizeLabel}
              signed={doc.signed}
            />
          ))}
        </div>
      );
    }
    case "accordion": {
      const items =
        (data.items as { question: string; answer: string[] }[]) ?? [];
      return (
        <Accordion type="single" collapsible className="max-w-prose border-t border-line">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {item.answer.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }
    case "tabs": {
      const items =
        (data.items as { label: string; paragraphs: string[] }[]) ?? [];
      if (!items.length) return null;
      return (
        <Tabs defaultValue="0">
          <TabsList>
            {items.map((item, index) => (
              <TabsTrigger key={item.label} value={String(index)}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((item, index) => (
            <TabsContent key={item.label} value={String(index)}>
              <Prose>
                {item.paragraphs.map((paragraph, pIndex) => (
                  <p key={`${pIndex}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </Prose>
            </TabsContent>
          ))}
        </Tabs>
      );
    }
    case "contacts": {
      if (!school) return null;
      const rows: { label: string; value: string }[] = [];
      if (data.showAddress !== false) {
        rows.push({ label: "Адрес", value: school.address.full });
      }
      if (data.showPhone !== false) {
        rows.push({ label: "Телефон", value: school.phone });
      }
      if (data.showEmail !== false) {
        rows.push({ label: "Email", value: school.email });
      }
      if (data.showHours !== false && school.workHours) {
        rows.push({ label: "Режим работы", value: school.workHours });
      }
      return (
        <div className="space-y-4">
          <dl className="space-y-3 border border-line bg-surface p-5 text-[15px]">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-graphite">{row.label}</dt>
                <dd className="break-words text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          {data.note ? (
            <p className="text-[15px] text-graphite">{String(data.note)}</p>
          ) : null}
        </div>
      );
    }
    case "html": {
      const html = String(data.html ?? "");
      if (!html.trim()) return null;
      return (
        <div
          className="cms-html prose-school max-w-none text-[15px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    case "facts": {
      const items = (data.items as { label: string; value: string }[]) ?? [];
      return (
        <dl className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-[0.04em] text-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      );
    }
    default:
      return null;
  }
}
