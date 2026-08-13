import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { NewsEditor } from "@/components/admin/news-editor";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/server/auth";

export default async function AdminNewsNewPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const newsCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(eq(categories.type, "news"))
    .orderBy(categories.sortOrder);

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Новая новость</h1>
        </div>
        <NewsEditor categories={newsCategories} />
      </div>
    </AdminChrome>
  );
}
