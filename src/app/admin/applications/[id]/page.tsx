import { notFound, redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { ApplicationEditor } from "@/components/admin/application-editor";
import { getSession } from "@/server/auth";
import { getApplicationAdmin } from "@/server/crud";

type Props = { params: Promise<{ id: string }> };

export default async function AdminApplicationPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  let item;
  try {
    item = await getApplicationAdmin(id);
  } catch {
    notFound();
  }

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Заявка</h1>
          <p className="mt-1 text-sm text-muted">{item.childName}</p>
        </div>
        <ApplicationEditor
          initial={{
            id: item.id,
            applicantName: item.applicantName,
            classGrade: item.classGrade,
            classLetter: item.classLetter,
            phone: item.phone,
            childName: item.childName,
            status: item.status,
            adminNotes: item.adminNotes,
            createdAt: item.createdAt.toISOString(),
          }}
        />
      </div>
    </AdminChrome>
  );
}
