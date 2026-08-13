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
    <footer className="mt-auto border-t border-line bg-paper-muted">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <p className="font-serif text-lg font-semibold text-ink">
            {school.brandName}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-graphite">
            {school.address.full}
          </p>
          <p className="mt-3 text-sm text-ink">
            <a href={`tel:${school.phoneTel}`} className="hover:text-brick">
              {school.phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a
              href={`mailto:${school.email}`}
              className="break-all text-ink hover:text-brick"
            >
              {school.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-graphite">{school.workHours}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
            Официально
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {official.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink no-underline hover:text-brick"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
            Ещё
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {more.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink no-underline hover:text-brick"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.04em] text-muted">
            Ссылки
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={school.founder.site}
                className="text-ink no-underline hover:text-brick"
                rel="noopener noreferrer"
                target="_blank"
              >
                Управление образования г. Орска
              </a>
            </li>
            <li>
              <a
                href={school.external.minpros}
                className="text-ink no-underline hover:text-brick"
                rel="noopener noreferrer"
                target="_blank"
              >
                Минпросвещения России
              </a>
            </li>
            <li>
              <a
                href={school.external.obrnadzor}
                className="text-ink no-underline hover:text-brick"
                rel="noopener noreferrer"
                target="_blank"
              >
                Рособрнадзор
              </a>
            </li>
            <li>
              <a
                href={school.enrollmentUrl}
                className="text-ink no-underline hover:text-brick"
                rel="noopener noreferrer"
                target="_blank"
              >
                Госуслуги — запись в школу
              </a>
            </li>
            <li className="flex gap-4 pt-1">
              {school.social.vk ? (
                <a
                  href={school.social.vk}
                  className="text-graphite no-underline hover:text-brick"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  VK
                </a>
              ) : null}
              {school.social.ok ? (
                <a
                  href={school.social.ok}
                  className="text-graphite no-underline hover:text-brick"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  OK
                </a>
              ) : null}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {school.shortName}</p>
          <p>
            Сайт использует Яндекс Метрику.{" "}
            <Link href="/policy/" className="text-graphite hover:text-brick">
              Политика обработки персональных данных
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
