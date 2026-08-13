import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export type StaffCardProps = {
  name: string;
  role: string;
  href: string;
  subjects?: string[];
  phone?: string;
  email?: string;
  receptionHours?: string;
  photoSrc?: string;
  className?: string;
};

function StaffRow({
  name,
  role,
  href,
  subjects,
  photoSrc,
  className,
}: StaffCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 border-b border-line py-5 no-underline last:border-b-0 transition-colors duration-150 hover:bg-surface/80 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5",
        className,
      )}
    >
      {photoSrc ? (
        <div className="media-zoom relative aspect-[4/5] overflow-hidden bg-paper-muted">
          <OptimizedImage
            src={photoSrc}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="104px"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[4/5] items-center justify-center bg-pine font-sans text-sm font-medium text-white"
          aria-hidden
        >
          {initials(name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-serif text-[1.05rem] font-semibold tracking-[-0.02em] text-ink transition-colors duration-200 group-hover:text-brick sm:text-lg">
          {name}
        </p>
        <p className="mt-1 text-[14px] leading-snug text-graphite">{role}</p>
        {subjects?.length ? (
          <p className="mt-1.5 truncate text-[13px] text-muted">
            {subjects.join(", ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/**
 * Портрет директора на главной — фото в приоритете.
 */
function StaffHighlight({
  name,
  role,
  href,
  phone,
  email,
  receptionHours,
  photoSrc,
  className,
  priority = false,
}: StaffCardProps & { priority?: boolean }) {
  return (
    <div
      className={cn(
        "grid overflow-hidden border border-line bg-surface lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="media-zoom relative min-h-[260px] bg-paper-muted sm:min-h-[300px]">
        {photoSrc ? (
          <OptimizedImage
            src={photoSrc}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 420px"
            priority={priority}
          />
        ) : (
          <div
            className="flex h-full min-h-[260px] items-center justify-center bg-pine font-serif text-4xl text-white"
            aria-hidden
          >
            {initials(name)}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
        <div>
          <p className="eyebrow">{role}</p>
          <p className="mt-3 font-serif text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-[-0.03em] text-ink">
            {name}
          </p>
          <dl className="mt-6 space-y-3 text-[15px]">
            {receptionHours ? (
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                  Приём
                </dt>
                <dd className="mt-1 text-ink">{receptionHours}</dd>
              </div>
            ) : null}
            {phone ? (
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                  Телефон
                </dt>
                <dd className="mt-1">
                  <a href={`tel:${phone.replace(/\D/g, "")}`} className="text-ink hover:text-brick">
                    {phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {email ? (
              <div>
                <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a href={`mailto:${email}`} className="break-all text-ink hover:text-brick">
                    {email}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 border-b border-brick pb-1 font-sans text-[14px] font-medium text-brick no-underline transition-colors hover:text-brick-hover"
        >
          Педагогический состав
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function StaffProfileHeader({
  name,
  role,
  subjects,
  photoSrc,
  className,
}: Omit<StaffCardProps, "href"> & { className?: string }) {
  return (
    <header
      className={cn(
        "grid gap-6 border-b border-line pb-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8",
        className,
      )}
    >
      {photoSrc ? (
        <div className="relative aspect-[4/5] w-40 overflow-hidden bg-paper-muted sm:w-full">
          <OptimizedImage
            src={photoSrc}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="160px"
            priority
          />
        </div>
      ) : (
        <div
          className="flex aspect-[4/5] w-40 items-center justify-center bg-pine font-serif text-3xl text-white sm:w-full"
          aria-hidden
        >
          {initials(name)}
        </div>
      )}
      <div className="flex flex-col justify-end">
        <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-ink">
          {name}
        </h1>
        <p className="mt-2 text-[16px] text-graphite">{role}</p>
        {subjects?.length ? (
          <p className="mt-4 text-sm text-ink">
            <span className="text-muted">Предметы: </span>
            {subjects.join(", ")}
          </p>
        ) : null}
      </div>
    </header>
  );
}

export { StaffRow, StaffHighlight, StaffProfileHeader };
