import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { DocumentEditor } from "@/components/admin/document-editor";
import { db } from "@/db";
import { categories, media } from "@/db/schema";
import { documents as staticDocuments } from "@/data/documents";
import { getSession } from "@/server/auth";
import { getDocumentAdmin } from "@/server/crud";

type Props = { params: Promise<{ id: string }> };

export default async function AdminDocumentEditPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  let item;
  try {
    item = await getDocumentAdmin(id);
  } catch {
    notFound();
  }

  const [docCategories, fileRow] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.type, "document"))
      .orderBy(categories.sortOrder),
    item.fileId
      ? db.select({ url: media.url }).from(media).where(eq(media.id, item.fileId)).limit(1)
      : Promise.resolve([]),
  ]);

  const staticHref = staticDocuments.find((doc) => doc.slug === item.slug)?.href;

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Редактирование</h1>
          <p className="mt-1 text-sm text-muted">{item.title}</p>
        </div>
        <DocumentEditor
          categories={docCategories}
          initial={{
            id: item.id,
            slug: item.slug,
            title: item.title,
            categoryId: item.categoryId,
            fileId: item.fileId,
            fileUrl: fileRow[0]?.url ?? staticHref ?? null,
            documentDate: item.documentDate,
            sizeLabel: item.sizeLabel,
            isSigned: item.isSigned,
            status: item.status,
          }}
        />
      </div>
    </AdminChrome>
  );
}
