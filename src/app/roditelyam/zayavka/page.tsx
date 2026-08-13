import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RoditelyamLayout } from "@/components/layout/content";
import { EnrollmentForm } from "@/components/school/enrollment-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Заявка в школу",
  description:
    "Подать заявку на зачисление или перевод ребёнка в МОАУ СОШ №37 г. Орска.",
  path: "/roditelyam/zayavka/",
});

export default function EnrollmentApplicationPage() {
  return (
    <RoditelyamLayout currentPath="/roditelyam/zayavka/">
      <PageHeader
        title="Заявка в школу"
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Родителям", href: "/roditelyam/" },
          { label: "Заявка в школу" },
        ]}
      />
      <div className="prose-site max-w-none">
        <p className="text-[17px] leading-relaxed text-graphite">
          Заполните форму — заявка поступит в администрацию школы. Мы свяжемся с
          вами по указанному телефону.
        </p>
        <div className="mt-8">
          <EnrollmentForm />
        </div>
      </div>
    </RoditelyamLayout>
  );
}
