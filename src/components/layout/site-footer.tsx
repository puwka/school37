import Link from "next/link";
import type { SchoolSettings } from "@/server/queries";

export function SiteFooter({
  school,
  official,
  more,
}: {
  school: SchoolSettings;
  official: { label: string; href: string }[];
  more: { label: string; href: string }[];
}) {
  return (
    <footer className="mt-auto border-t border-line bg-pine text-white">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <p className="font-serif text-xl font-semibold tracking-[-0.03em]">
            {school.brandName}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {school.address.full}
          </p>
          <p className="mt-4 text-sm">
            <a href={`tel:${school.phoneTel}`} className="text-white hover:text-white/80">
              {school.phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a
              href={`mailto:${school.email}`}
              className="break-all text-white/80 hover:text-white"
            >
              {school.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-white/55">{school.workHours}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/45">
            Официально
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {official.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/80 no-underline transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/45">
            Ещё
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {more.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/80 no-underline transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/45">
            Ссылки
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={school.founder.site}
                className="text-white/80 no-underline transition-colors hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                Управление образования г. Орска
              </a>
            </li>
            <li>
              <a
                href={school.external.minpros}
                className="text-white/80 no-underline transition-colors hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                Минпросвещения России
              </a>
            </li>
            <li>
              <a
                href={school.external.obrnadzor}
                className="text-white/80 no-underline transition-colors hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                Рособрнадзор
              </a>
            </li>
            <li>
              <a
                href={school.enrollmentUrl}
                className="text-white/80 no-underline transition-colors hover:text-white"
                rel="noopener noreferrer"
                target="_blank"
              >
                Госуслуги — запись в школу
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {school.shortName}</p>
          <p>
            <Link href="/policy/" className="text-white/55 hover:text-white">
              Политика обработки персональных данных
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
