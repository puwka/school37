import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SvedeniyaLayout, TextLink } from "@/components/layout/content";
import { StaffRow } from "@/components/school/staff-card";
import { getAllEmployees, getLeadership, getSchool } from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  return {
    title: "Руководство",
    description: `Руководство ${school.shortName}.`,
  };
}

export default async function RukovodstvoPage() {
  const [leaders, staff] = await Promise.all([
    getLeadership(),
    getAllEmployees(),
  ]);

  return (
    <SvedeniyaLayout currentPath="/svedeniya/rukovodstvo/">
      <PageHeader
        title="Руководство"
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Сведения об ОО", href: "/svedeniya/" },
          { label: "Руководство" },
        ]}
      />

      <div className="border border-line bg-surface px-4">
        {leaders.map((person) => (
          <StaffRow
            key={person.slug}
            name={person.name}
            role={person.role}
            href={`/svedeniya/pedagogicheskiy-sostav/${person.slug}/`}
            subjects={person.subjects}
            phone={person.phone}
            email={person.email}
            receptionHours={person.receptionHours}
            photoSrc={person.photoSrc}
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-graphite">
        Полный педагогический состав —{" "}
        <TextLink href="/svedeniya/pedagogicheskiy-sostav/">
          в отдельном разделе
        </TextLink>
        . Всего в каталоге: {staff.length} сотрудников.
      </p>
    </SvedeniyaLayout>
  );
}
