import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { NewsEditor } from "@/components/admin/news-editor";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/server/auth";
import { getNewsAdmin } from "@/server/crud";

type Props = { params: Promise<{ id: string }> };

export default async function AdminNewsEditPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  let item;
  try {
    item = await getNewsAdmin(id);
  } catch {
    notFound();
  }

  const newsCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.type, "news"))
    .orderBy(categories.sortOrder);

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Редактирование</h1>
          <p className="mt-1 text-sm text-muted">{item.title}</p>
        </div>
        <NewsEditor
          categories={newsCategories}
          initial={{
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            body: item.body,
            kind: item.kind,
            categoryId: item.categoryId,
            isUrgent: item.isUrgent,
            status: item.status,
          }}
        />
      </div>
    </AdminChrome>
  );
}
