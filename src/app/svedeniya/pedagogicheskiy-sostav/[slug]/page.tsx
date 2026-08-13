import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { SvedeniyaLayout, TextLink } from "@/components/layout/content";
import { StaffProfileHeader } from "@/components/school/staff-card";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import { getStaffBySlug } from "@/server/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getStaffBySlug(slug);
  if (!person) return { title: "Сотрудник не найден", robots: { index: false } };
  return buildPageMetadata({
    title: person.name,
    description: `${person.role} — ${person.name}`,
    path: `/svedeniya/pedagogicheskiy-sostav/${person.slug}/`,
    image: person.photoSrc,
  });
}

export default async function StaffPersonPage({ params }: Props) {
  const { slug } = await params;
  const person = await getStaffBySlug(slug);
  if (!person) notFound();

  return (
    <SvedeniyaLayout currentPath="/svedeniya/pedagogicheskiy-sostav/">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
          url: absoluteUrl(`/svedeniya/pedagogicheskiy-sostav/${person.slug}/`),
          ...(person.email ? { email: person.email } : {}),
          ...(person.phone ? { telephone: person.phone } : {}),
          ...(person.photoSrc
            ? { image: absoluteUrl(person.photoSrc) }
            : {}),
        }}
      />
      <PageHeader
        title={person.name}
        hideTitle
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Сведения об ОО", href: "/svedeniya/" },
          {
            label: "Педагогический состав",
            href: "/svedeniya/pedagogicheskiy-sostav/",
          },
          { label: person.name },
        ]}
      />

      <StaffProfileHeader
        name={person.name}
        role={person.role}
        subjects={person.subjects}
        photoSrc={person.photoSrc}
      />

      <dl className="mt-8 space-y-4 border border-line bg-surface p-5 text-[15px]">
        {person.phone ? (
          <div>
            <dt className="text-graphite">Телефон</dt>
            <dd className="text-ink">{person.phone}</dd>
          </div>
        ) : null}
        {person.email ? (
          <div>
            <dt className="text-graphite">Электронная почта</dt>
            <dd className="break-all text-ink">{person.email}</dd>
          </div>
        ) : null}
        {person.receptionHours ? (
          <div>
            <dt className="text-graphite">Часы приёма</dt>
            <dd className="text-ink">{person.receptionHours}</dd>
          </div>
        ) : null}
        {person.education ? (
          <div>
            <dt className="text-graphite">Образование</dt>
            <dd className="text-ink">{person.education}</dd>
          </div>
        ) : null}
        {person.qualification ? (
          <div>
            <dt className="text-graphite">Квалификация</dt>
            <dd className="text-ink">{person.qualification}</dd>
          </div>
        ) : null}
        {person.experienceYears ? (
          <div>
            <dt className="text-graphite">Стаж работы</dt>
            <dd className="text-ink">{person.experienceYears} лет</dd>
          </div>
        ) : null}
        {person.development?.length ? (
          <div>
            <dt className="text-graphite">Повышение квалификации</dt>
            <dd>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-ink">
                {person.development.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        {person.programs?.length ? (
          <div>
            <dt className="text-graphite">Образовательные программы</dt>
            <dd className="text-ink">{person.programs.join(", ")}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-6">
        <TextLink href="/svedeniya/pedagogicheskiy-sostav/">
          ← К списку сотрудников
        </TextLink>
      </p>
    </SvedeniyaLayout>
  );
}
