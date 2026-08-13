export function UtilityBar({
  street,
  city,
  phone,
  phoneTel,
  email,
  workHoursShort,
}: {
  street: string;
  city: string;
  phone: string;
  phoneTel: string;
  email: string;
  workHoursShort: string;
}) {
  return (
    <div className="border-b border-line bg-paper-muted">
      <div className="container-site flex min-h-10 flex-col gap-1 py-2 text-sm text-graphite sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <p className="min-w-0 truncate">
          {street}, {city}
        </p>
        <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={`tel:${phoneTel}`}
            className="whitespace-nowrap text-ink no-underline hover:text-brick"
          >
            {phone}
          </a>
          <span className="hidden text-line-strong sm:inline" aria-hidden>
            ·
          </span>
          <a
            href={`mailto:${email}`}
            className="break-all text-ink no-underline hover:text-brick sm:break-normal"
          >
            {email}
          </a>
        </p>
        <p className="whitespace-nowrap">{workHoursShort}</p>
      </div>
    </div>
  );
}
