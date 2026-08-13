import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

export type NewsCardProps = {
  title: string;
  href: string;
  date: string;
  dateTime?: string;
  category?: string;
  excerpt?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

function NewsFeatured({
  title,
  href,
  date,
  dateTime,
  category,
  excerpt,
  imageSrc,
  imageAlt,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid no-underline lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch",
        className,
      )}
    >
      <div className="media-zoom relative min-h-[220px] overflow-hidden bg-paper-muted sm:min-h-[280px] lg:min-h-[320px]">
        {imageSrc ? (
          <OptimizedImage
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e3a34_0%,#8f3329_100%)] opacity-90" />
        )}
      </div>
      <div className="flex flex-col justify-end border border-t-0 border-line bg-surface p-6 sm:p-8 lg:border-l-0 lg:border-t">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
          {category ? <span className="text-brick">{category}</span> : null}
          <time dateTime={dateTime ?? date}>{date}</time>
        </div>
        <h3 className="mt-3 font-serif text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink transition-colors duration-200 group-hover:text-brick sm:text-[1.75rem]">
          {title}
        </h3>
        {excerpt ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-graphite">
            {excerpt}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-brick">
          Читать
          <span
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function NewsRow({
  title,
  href,
  date,
  dateTime,
  category,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid gap-2 border-b border-line py-5 no-underline last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px] font-medium uppercase tracking-[0.06em] text-muted sm:flex-col sm:gap-1">
        <time dateTime={dateTime ?? date} className="text-graphite">
          {date}
        </time>
        {category ? <span className="text-brick">{category}</span> : null}
      </div>
      <p className="font-serif text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors duration-200 group-hover:text-brick sm:text-[1.2rem]">
        {title}
      </p>
    </Link>
  );
}

function NewsUrgentBanner({
  title,
  href,
  date,
  dateTime,
  category = "Объявление",
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "accent-bar group flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border border-line border-l-0 bg-surface py-3.5 pl-5 pr-5 no-underline transition-colors duration-150 hover:bg-brick-tint/50",
        className,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-brick">
        {category}
      </span>
      <time className="text-sm text-graphite" dateTime={dateTime ?? date}>
        {date}
      </time>
      <span className="font-sans text-[15px] font-medium tracking-[-0.01em] text-ink">
        {title}
      </span>
      <span className="ml-auto text-sm text-brick transition-transform duration-200 group-hover:translate-x-0.5">
        Читать →
      </span>
    </Link>
  );
}

function EventCard({
  title,
  href,
  date,
  dateTime,
  excerpt,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block border-t border-line pt-5 no-underline first:border-t-0 first:pt-0",
        className,
      )}
    >
      <time
        className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-brick"
        dateTime={dateTime ?? date}
      >
        {date}
      </time>
      <p className="mt-2 font-serif text-lg font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-brick">
        {title}
      </p>
      {excerpt ? (
        <p className="mt-1.5 line-clamp-2 text-[15px] text-graphite">{excerpt}</p>
      ) : null}
    </Link>
  );
}

export { NewsRow, NewsFeatured, NewsUrgentBanner, EventCard };
