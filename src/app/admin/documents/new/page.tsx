import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { DocumentEditor } from "@/components/admin/document-editor";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/server/auth";

export default async function AdminDocumentNewPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const docCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.type, "document"))
    .orderBy(categories.sortOrder);

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-semibold">Новый документ</h1>
        <DocumentEditor categories={docCategories} />
      </div>
    </AdminChrome>
  );
}
