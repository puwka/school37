import { unstable_cache, unstable_noStore } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  documents,
  employees,
  media,
  menuItems,
  news,
  pageBlocks,
  pages,
  redirects,
  settings,
  type MenuItem,
} from "@/db/schema";
import { school as defaultSchool } from "@/data/school";
import { footerColumns, mainNav } from "@/data/navigation";

export type SchoolSettings = {
  fullName: string;
  shortName: string;
  brandName: string;
  founded: string;
  foundedAlt: string;
  motto: string;
  address: {
    postal: string;
    region: string;
    city: string;
    street: string;
    full: string;
  };
  phone: string;
  phoneTel: string;
  email: string;
  workHours: string;
  workHoursShort: string;
  lessonsStart: string;
  weekDays: string;
  shifts: string;
  lessonDuration: string;
  language: string;
  howToGet: string;
  routes: string[];
  stop: string;
  director: {
    name: string;
    role: string;
    reception: string;
    slug: string;
  };
  founder: {
    name: string;
    authority: string;
    address: string;
    phone: string;
    email: string;
    site: string;
    workHours: string;
  };
  requisites: Record<string, string>;
  license: { number: string; series: string };
  accreditation: { number: string; series: string };
  enrollmentUrl: string;
  gosuslugiProblemUrl: string;
  social: { vk: string; ok: string };
  external: { minpros: string; minobrnauki: string; obrnadzor: string };
  map?: { lon: number; lat: number; yandexUrl: string };
  aboutShort: string[];
  timeline: { year: string; text: string }[];
};

export type MenuNode = {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: { label: string; href: string }[];
};

export type PublicNews = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  type: "news" | "announcement" | "event" | "federal";
  category: string;
  excerpt: string;
  body: string[];
  urgent?: boolean;
};

export type PublicDocument = {
  slug: string;
  title: string;
  category: string;
  date?: string;
  sizeLabel?: string;
  signed?: boolean;
  href?: string;
  downloadable: boolean;
};

export type PublicEmployee = {
  slug: string;
  name: string;
  role: string;
  subjects?: string[];
  phone?: string;
  email?: string;
  receptionHours?: string;
  education?: string;
  qualification?: string;
  experienceYears?: number;
  professionalExperienceYears?: number;
  development?: string[];
  programs?: string[];
  isLeadership?: boolean;
  photoSrc?: string;
};

export type PublicPage = {
  id: string;
  path: string;
  slug: string;
  title: string;
  description: string | null;
  layout: "default" | "svedeniya" | "roditelyam" | "pedagogam";
  template:
    | "page"
    | "hub"
    | "homepage"
    | "news_index"
    | "documents_index"
    | "employees_index"
    | "contacts";
  seoTitle: string | null;
  seoDescription: string | null;
  blocks: { id: string; type: string; data: Record<string, unknown> }[];
};

function formatDateLabel(value: Date | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function isoDate(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

export const getSchool = unstable_cache(
  async (): Promise<SchoolSettings> => {
    try {
      const [row] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, "school"))
        .limit(1);
      if (row) return row.value as SchoolSettings;
    } catch {
      // Fallback при пустой БД или недоступности во время сборки
    }
    return defaultSchool as unknown as SchoolSettings;
  },
  ["cms-school-v2"],
  { tags: ["cms"] },
);

export const getSetting = unstable_cache(
  async (key: string) => {
    const [row] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    return row?.value ?? null;
  },
  ["cms-setting"],
  { tags: ["cms"] },
);

function buildMenuTree(items: MenuItem[]): MenuNode[] {
  const visible = items.filter((item) => item.isVisible);
  const childrenOf = (parentId: string | null): MenuNode[] =>
    visible
      .filter((item) => item.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        label: item.label,
        href: item.href,
        isExternal: item.isExternal,
        children: childrenOf(item.id).map((child) => ({
          label: child.label,
          href: child.href,
        })),
      }));
  return childrenOf(null);
}

export const getMenuTree = unstable_cache(
  async (location: MenuItem["location"]): Promise<MenuNode[]> => {
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.location, location))
      .orderBy(asc(menuItems.sortOrder));
    return buildMenuTree(items);
  },
  ["cms-menu"],
  { tags: ["cms"] },
);

export const getPublishedPagePaths = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db
      .select({ path: pages.path })
      .from(pages)
      .where(eq(pages.status, "published"))
      .orderBy(asc(pages.path));
    return rows.map((row) => row.path);
  },
  ["cms-page-paths"],
  { tags: ["cms"] },
);

export const getPublishedPage = unstable_cache(
  async (path: string): Promise<PublicPage | null> => {
    const normalized = path.endsWith("/") ? path : `${path}/`;
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.path, normalized), eq(pages.status, "published")))
      .limit(1);
    if (!page) return null;
    const blocks = await db
      .select()
      .from(pageBlocks)
      .where(and(eq(pageBlocks.pageId, page.id), eq(pageBlocks.isVisible, true)))
      .orderBy(asc(pageBlocks.sortOrder));
    return {
      id: page.id,
      path: page.path,
      slug: page.slug,
      title: page.title,
      description: page.description,
      layout: page.layout,
      template: page.template,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      blocks: blocks.map((block) => ({
        id: block.id,
        type: block.type,
        data: block.data,
      })),
    };
  },
  ["cms-page"],
  { tags: ["cms"] },
);

export const findRedirect = unstable_cache(
  async (path: string) => {
    const [row] = await db
      .select()
      .from(redirects)
      .where(and(eq(redirects.fromPath, path), eq(redirects.isActive, true)))
      .limit(1);
    return row ?? null;
  },
  ["cms-redirect"],
  { tags: ["cms"] },
);

function mapNews(
  row: typeof news.$inferSelect,
  categoryName: string,
): PublicNews {
  return {
    slug: row.slug,
    title: row.title,
    date: isoDate(row.publishedAt),
    dateLabel: formatDateLabel(row.publishedAt),
    type: row.kind,
    category: categoryName,
    excerpt: row.excerpt,
    body: row.body,
    urgent: row.isUrgent || undefined,
  };
}

async function publishedNews() {
  const rows = await db
    .select({
      news,
      categoryName: categories.name,
    })
    .from(news)
    .leftJoin(categories, eq(news.categoryId, categories.id))
    .where(eq(news.status, "published"))
    .orderBy(desc(news.publishedAt));
  return rows.map((row) => mapNews(row.news, row.categoryName ?? "Новость"));
}

export const getAllNews = unstable_cache(publishedNews, ["cms-news-v2"], {
  tags: ["cms"],
});

export async function getNewsBySlug(slug: string) {
  const items = await getAllNews();
  return items.find((item) => item.slug === slug) ?? null;
}

/** Без кэша — баннер на главной должен обновляться сразу после правок в CMS. */
export async function getUrgentNews() {
  unstable_noStore();
  const [row] = await db
    .select({
      news,
      categoryName: categories.name,
    })
    .from(news)
    .leftJoin(categories, eq(news.categoryId, categories.id))
    .where(and(eq(news.status, "published"), eq(news.isUrgent, true)))
    .orderBy(desc(news.publishedAt))
    .limit(1);
  if (!row) return null;
  return mapNews(row.news, row.categoryName ?? "Объявление");
}

export async function getLatestNews(limit = 3) {
  const items = await getAllNews();
  return items
    .filter((item) => item.type === "news" || item.type === "announcement")
    .slice(0, limit);
}

export async function getAnnouncements(limit = 3) {
  const items = await getAllNews();
  return items
    .filter((item) => item.type === "announcement" && !item.urgent)
    .slice(0, limit);
}

export async function getEvents(limit = 6) {
  const items = await getAllNews();
  return items.filter((item) => item.type === "event").slice(0, limit);
}

export const getAllDocuments = unstable_cache(
  async (): Promise<PublicDocument[]> => {
    const rows = await db
      .select({
        document: documents,
        categoryName: categories.name,
        fileUrl: media.url,
      })
      .from(documents)
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .leftJoin(media, eq(documents.fileId, media.id))
      .where(eq(documents.status, "published"))
      .orderBy(asc(documents.title));
    return rows.map((row) => ({
      slug: row.document.slug,
      title: row.document.title,
      category: row.categoryName ?? "Документы",
      date: row.document.documentDate ?? undefined,
      sizeLabel: row.document.sizeLabel ?? undefined,
      signed: row.document.isSigned || undefined,
      href: row.fileUrl ?? undefined,
      downloadable: Boolean(row.fileUrl),
    }));
  },
  ["cms-documents"],
  { tags: ["cms"] },
);

export async function getDocumentsByCategory(category?: string) {
  const items = await getAllDocuments();
  if (!category || category === "Все") return items;
  return items.filter((item) => item.category === category);
}

export const getDocumentCategories = unstable_cache(
  async () => {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.type, "document"))
      .orderBy(asc(categories.sortOrder));
    return rows.map((row) => row.name);
  },
  ["cms-document-categories"],
  { tags: ["cms"] },
);

export const getAllEmployees = unstable_cache(
  async (): Promise<PublicEmployee[]> => {
    const rows = await db
      .select({
        employee: employees,
        photoUrl: media.url,
      })
      .from(employees)
      .leftJoin(media, eq(employees.photoId, media.id))
      .where(eq(employees.status, "published"))
      .orderBy(asc(employees.sortOrder), asc(employees.name));
    return rows.map((row) => ({
      slug: row.employee.slug,
      name: row.employee.name,
      role: row.employee.role,
      subjects: row.employee.subjects.length ? row.employee.subjects : undefined,
      phone: row.employee.phone ?? undefined,
      email: row.employee.email ?? undefined,
      receptionHours: row.employee.receptionHours ?? undefined,
      education: row.employee.education ?? undefined,
      qualification: row.employee.qualification ?? undefined,
      experienceYears: row.employee.experienceYears ?? undefined,
      professionalExperienceYears:
        row.employee.professionalExperienceYears ?? undefined,
      development: row.employee.development.length
        ? row.employee.development
        : undefined,
      programs: row.employee.programs.length ? row.employee.programs : undefined,
      isLeadership: row.employee.isLeadership || undefined,
      photoSrc: row.photoUrl ?? undefined,
    }));
  },
  ["cms-employees"],
  { tags: ["cms"] },
);

export async function getStaffBySlug(slug: string) {
  const items = await getAllEmployees();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getLeadership() {
  const items = await getAllEmployees();
  return items.filter((item) => item.isLeadership);
}

export async function getTeachers() {
  const items = await getAllEmployees();
  return items.filter((item) => !item.isLeadership || item.subjects?.length);
}

export const getSiteChrome = unstable_cache(
  async () => {
    const [school, header, footerOfficial, footerMore] = await Promise.all([
      getSchool(),
      getMenuTree("header"),
      getMenuTree("footer_official"),
      getMenuTree("footer_more"),
    ]);
    return {
      school,
      header: header.length > 0 ? header : mainNav,
      footerOfficial:
        footerOfficial.length > 0
          ? footerOfficial
          : [...footerColumns.official],
      footerMore:
        footerMore.length > 0 ? footerMore : [...footerColumns.more],
    };
  },
  ["cms-chrome-v2"],
  { tags: ["cms"] },
);

export type SearchResult = {
  title: string;
  href: string;
  excerpt?: string;
  typeLabel: string;
};

export async function searchSite(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [newsItems, docs, pageRows] = await Promise.all([
    getAllNews(),
    getAllDocuments(),
    db
      .select({ title: pages.title, path: pages.path })
      .from(pages)
      .where(eq(pages.status, "published"))
      .orderBy(asc(pages.title)),
  ]);

  const results: SearchResult[] = [];

  for (const item of newsItems) {
    if (
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q)
    ) {
      results.push({
        title: item.title,
        href: `/novosti/${item.slug}/`,
        excerpt: item.excerpt,
        typeLabel: "Новость",
      });
    }
  }

  for (const doc of docs) {
    if (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    ) {
      results.push({
        title: doc.title,
        href: doc.href ?? `/svedeniya/dokumenty/`,
        excerpt: doc.category,
        typeLabel: "Документ",
      });
    }
  }

  for (const page of pageRows) {
    if (page.title.toLowerCase().includes(q)) {
      results.push({
        title: page.title,
        href: page.path,
        typeLabel: "Страница",
      });
    }
  }

  return results.slice(0, 40);
}
