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

/**
 * Строка в каталоге педагогов / блок директора на главной.
 */
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
        "group flex items-center gap-4 border-b border-line py-4 no-underline last:border-b-0 hover:bg-paper-muted/50",
        className,
      )}
    >
      {photoSrc ? (
        <OptimizedImage
          src={photoSrc}
          alt={name}
          width={56}
          height={56}
          className="size-14 rounded-[var(--radius-sm)] object-cover"
          sizes="56px"
        />
      ) : (
        <div
          className="flex size-14 items-center justify-center rounded-[var(--radius-sm)] bg-brick-tint font-sans text-sm font-medium text-brick"
          aria-hidden
        >
          {initials(name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[15px] font-medium text-ink group-hover:text-brick">
          {name}
        </p>
        <p className="text-sm text-graphite">{role}</p>
        {subjects?.length ? (
          <p className="mt-0.5 truncate text-sm text-muted">
            {subjects.join(", ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/**
 * Горизонтальная панель директора на главной — не grid портретов.
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
        "flex flex-col gap-4 border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {photoSrc ? (
          <OptimizedImage
            src={photoSrc}
            alt={name}
            width={56}
            height={56}
            className="size-14 rounded-[var(--radius-sm)] object-cover"
            sizes="56px"
            priority={priority}
          />
        ) : (
          <div
            className="flex size-14 items-center justify-center rounded-[var(--radius-sm)] bg-brick-tint font-sans text-sm font-medium text-brick"
            aria-hidden
          >
            {initials(name)}
          </div>
        )}
        <div>
          <p className="text-sm text-graphite">{role}</p>
          <p className="font-serif text-xl font-semibold text-ink">{name}</p>
          <p className="mt-1 text-sm text-graphite">
            {[
              receptionHours ? `Приём ${receptionHours}` : null,
              phone,
              email,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="shrink-0 font-sans text-[15px] font-medium text-brick no-underline hover:underline"
      >
        Педагогический состав →
      </Link>
    </div>
  );
}

/**
 * Карточка персоны на странице профиля (приказ 1493).
 */
function StaffProfileHeader({
  name,
  role,
  subjects,
  photoSrc,
  className,
}: Omit<StaffCardProps, "href"> & { className?: string }) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:gap-6", className)}>
      {photoSrc ? (
        <OptimizedImage
          src={photoSrc}
          alt={name}
          width={112}
          height={112}
          className="size-28 rounded-[var(--radius-md)] object-cover"
          sizes="112px"
          priority
        />
      ) : (
        <div
          className="flex size-28 items-center justify-center rounded-[var(--radius-md)] bg-brick-tint font-serif text-2xl text-brick"
          aria-hidden
        >
          {initials(name)}
        </div>
      )}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">{name}</h1>
        <p className="mt-1 text-[15px] text-graphite">{role}</p>
        {subjects?.length ? (
          <p className="mt-3 text-sm text-ink">
            <span className="text-muted">Предметы: </span>
            {subjects.join(", ")}
          </p>
        ) : null}
      </div>
    </header>
  );
}

export { StaffRow, StaffHighlight, StaffProfileHeader };
