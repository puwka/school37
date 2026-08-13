import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { EmployeeEditor } from "@/components/admin/employee-editor";
import { getSession } from "@/server/auth";

export default async function AdminEmployeeNewPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-semibold">Новый сотрудник</h1>
        <EmployeeEditor />
      </div>
    </AdminChrome>
  );
}
