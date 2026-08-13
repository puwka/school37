import type { Metadata, Viewport } from "next";
import { Literata, Golos_Text } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { getSchool, getSiteChrome } from "@/server/queries";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["cyrillic", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9b3d32",
};

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  const description = `${school.fullName}. Адрес: ${school.address.full}. Телефон: ${school.phone}.`;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: school.shortName,
      template: `%s — ${school.brandName}`,
    },
    description,
    applicationName: school.brandName,
    authors: [{ name: school.shortName }],
    creator: school.shortName,
    publisher: school.shortName,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: absoluteUrl("/"),
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: absoluteUrl("/"),
      siteName: school.shortName,
      title: school.shortName,
      description: school.fullName,
      images: [
        {
          url: absoluteUrl("/uploads/images/mto-avgust.jpg"),
          alt: school.shortName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: school.shortName,
      description,
      images: [absoluteUrl("/uploads/images/mto-avgust.jpg")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const school = await getSchool();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.fullName,
    alternateName: [school.shortName, school.brandName],
    url: absoluteUrl("/"),
    email: school.email,
    telephone: school.phone,
    foundingDate: "1963-01-19",
    address: {
      "@type": "PostalAddress",
      streetAddress: school.address.street,
      addressLocality: school.address.city,
      addressRegion: school.address.region,
      postalCode: school.address.postal,
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Approximate Orsk location — optional; omit if uncertain
    },
  };

  // Remove empty geo if no coords
  delete (orgJsonLd as { geo?: unknown }).geo;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: school.shortName,
    url: absoluteUrl("/"),
    inLanguage: "ru-RU",
    publisher: {
      "@type": "School",
      name: school.fullName,
    },
  };

  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${literata.variable} ${golos.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans text-ink">
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
        <a href="#main-content" className="skip-link">
          Перейти к содержимому
        </a>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}

async function PublicShell({ children }: { children: React.ReactNode }) {
  // Admin routes render without public chrome via nested layout check on client path —
  // server layout always wraps; admin layout is separate and we detect via parallel.
  // Use chrome for all; admin pages have their own full-screen chrome and ignore parent visually
  // by being under /admin which we branch here using headers only when needed.
  const { headers } = await import("next/headers");
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return children;
  }

  const chrome = await getSiteChrome();
  return (
    <SiteShell
      school={chrome.school}
      nav={chrome.header}
      footerOfficial={chrome.footerOfficial}
      footerMore={chrome.footerMore}
    >
      {children}
    </SiteShell>
  );
}
