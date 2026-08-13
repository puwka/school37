import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SvedeniyaLayout, TextLink } from "@/components/layout/content";
import { Alert } from "@/components/ui/alert";
import { StaffRow } from "@/components/school/staff-card";
import { getAllEmployees, getSchool } from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  return {
    title: "Педагогический состав",
    description: `Педагогический состав ${school.shortName}.`,
  };
}

export default async function PedagogicheskiySostavPage() {
  const staff = await getAllEmployees();

  return (
    <SvedeniyaLayout currentPath="/svedeniya/pedagogicheskiy-sostav/">
      <PageHeader
        title="Педагогический состав"
        description="Информация размещена согласно Приказу Рособрнадзора от 04.08.2023 №1493 с учётом требований Федерального закона от 27.07.2006 №152-ФЗ «О персональных данных»."
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Сведения об ОО", href: "/svedeniya/" },
          { label: "Педагогический состав" },
        ]}
      />

      <Alert variant="info" className="mb-6">
        Сведения публикуются на основании заявления работника и в рамках политики
        обработки персональных данных.
      </Alert>

      <div className="border border-line bg-surface px-4">
        {staff.map((person) => (
          <StaffRow
            key={person.slug}
            name={person.name}
            role={person.role}
            href={`/svedeniya/pedagogicheskiy-sostav/${person.slug}/`}
            subjects={person.subjects}
            photoSrc={person.photoSrc}
          />
        ))}
      </div>

      <p className="mt-6">
        <TextLink href="/svedeniya/rukovodstvo/">Руководство школы →</TextLink>
      </p>
    </SvedeniyaLayout>
  );
}
