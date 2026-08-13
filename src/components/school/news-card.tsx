import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

function NewsRow({
  title,
  href,
  date,
  dateTime,
  category,
  imageSrc,
  imageAlt,
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex gap-4 border-b border-line py-4 no-underline last:border-b-0",
        className,
      )}
    >
      {imageSrc ? (
        <OptimizedImage
          src={imageSrc}
          alt={imageAlt || title}
          width={96}
          height={72}
          className="size-20 shrink-0 object-cover sm:h-[72px] sm:w-24"
          sizes="96px"
        />
      ) : (
        <div
          className="hidden h-[72px] w-24 shrink-0 bg-paper-muted sm:block"
          aria-hidden
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm text-graphite">
          {category ? <Badge variant="brick">{category}</Badge> : null}
          <time dateTime={dateTime ?? date}>{date}</time>
        </div>
        <p className="mt-1.5 font-serif text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brick">
          {title}
        </p>
      </div>
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
        "accent-bar flex flex-wrap items-baseline gap-x-4 gap-y-1 border border-line border-l-0 bg-surface py-3.5 pl-5 pr-5 no-underline transition-colors hover:bg-brick-tint/40",
        className,
      )}
    >
      <Badge variant="brick">{category}</Badge>
      <time className="text-sm text-graphite" dateTime={dateTime ?? date}>
        {date}
      </time>
      <span className="font-sans text-[15px] font-medium text-ink">{title}</span>
      <span className="ml-auto text-sm text-brick">Читать →</span>
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
        "block border-t border-line pt-4 no-underline first:border-t-0 first:pt-0",
        className,
      )}
    >
      <time className="font-sans text-sm text-brick" dateTime={dateTime ?? date}>
        {date}
      </time>
      <p className="mt-1 font-serif text-lg font-semibold text-ink">{title}</p>
      {excerpt ? (
        <p className="mt-1 line-clamp-2 text-[15px] text-graphite">{excerpt}</p>
      ) : null}
    </Link>
  );
}

export { NewsRow, NewsUrgentBanner, EventCard };
