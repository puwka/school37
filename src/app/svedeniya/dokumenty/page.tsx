import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SvedeniyaLayout } from "@/components/layout/content";
import { DocumentsRegistry } from "@/components/school/documents-registry";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAllDocuments,
  getDocumentCategories,
  getSchool,
} from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const school = await getSchool();
  return buildPageMetadata({
    title: "Документы",
    description: `Официальные документы ${school.shortName}.`,
    path: "/svedeniya/dokumenty/",
  });
}

export default async function DocumentsPage() {
  const [documents, categories] = await Promise.all([
    getAllDocuments(),
    getDocumentCategories(),
  ]);

  return (
    <SvedeniyaLayout currentPath="/svedeniya/dokumenty/">
      <PageHeader
        title="Документы"
        description="Реестр официальных документов образовательной организации."
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Сведения об ОО", href: "/svedeniya/" },
          { label: "Документы" },
        ]}
      />
      <DocumentsRegistry documents={documents} categories={categories} />
    </SvedeniyaLayout>
  );
}
