import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { EmployeeEditor } from "@/components/admin/employee-editor";
import { db } from "@/db";
import { media } from "@/db/schema";
import { getSession } from "@/server/auth";
import { getEmployeeAdmin } from "@/server/crud";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEmployeeEditPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  let item;
  try {
    item = await getEmployeeAdmin(id);
  } catch {
    notFound();
  }

  const photoRow = item.photoId
    ? await db.select({ url: media.url }).from(media).where(eq(media.id, item.photoId)).limit(1)
    : [];

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Редактирование</h1>
          <p className="mt-1 text-sm text-muted">{item.name}</p>
        </div>
        <EmployeeEditor
          initial={{
            id: item.id,
            slug: item.slug,
            name: item.name,
            role: item.role,
            subjects: item.subjects,
            phone: item.phone,
            email: item.email,
            receptionHours: item.receptionHours,
            education: item.education,
            qualification: item.qualification,
            experienceYears: item.experienceYears,
            isLeadership: item.isLeadership,
            photoId: item.photoId,
            photoUrl: photoRow[0]?.url ?? null,
            sortOrder: item.sortOrder,
            status: item.status,
          }}
        />
      </div>
    </AdminChrome>
  );
}
