import type { Metadata } from "next";
import { absoluteUrl, normalizePath } from "@/lib/site-url";

export function buildPageMetadata(input: {
  title: string;
  description?: string | null;
  path: string;
  absoluteTitle?: boolean;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const path = normalizePath(input.path);
  const url = absoluteUrl(path);
  const description =
    input.description?.trim() ||
    "Официальный сайт МОАУ «СОШ №37 г. Орска»";
  const image = input.image
    ? absoluteUrl(input.image)
    : absoluteUrl("/uploads/images/mto-avgust.jpg");

  return {
    title: input.absoluteTitle
      ? { absolute: input.title }
      : input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      locale: "ru_RU",
      url,
      title: input.title,
      description,
      images: [{ url: image, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
