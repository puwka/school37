import type { MetadataRoute } from "next";
import { getSiteUrl, normalizePath } from "@/lib/site-url";
import {
  getAllEmployees,
  getAllNews,
  getPublishedPagePaths,
} from "@/server/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const [paths, news, employees] = await Promise.all([
    getPublishedPagePaths(),
    getAllNews(),
    getAllEmployees(),
  ]);

  const pageEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${normalizePath(path)}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/svedeniya") ? 0.9 : 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${base}/novosti/${item.slug}/`,
    lastModified: item.date ? new Date(item.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staffEntries: MetadataRoute.Sitemap = employees.map((person) => ({
    url: `${base}/svedeniya/pedagogicheskiy-sostav/${person.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Deduplicate by URL
  const map = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...pageEntries, ...newsEntries, ...staffEntries]) {
    map.set(entry.url, entry);
  }
  return [...map.values()];
}
