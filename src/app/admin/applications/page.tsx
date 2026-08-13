import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import {
  applicationStatusLabel,
  formatApplicationClass,
  formatApplicationDate,
} from "@/lib/applications";
import type { Application } from "@/db/schema";
import { getSession } from "@/server/auth";
import { listApplicationsAdmin } from "@/server/crud";

export default async function AdminApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const result = await listApplicationsAdmin({ page: 1, perPage: 100 });
  const items = result.items as Application[];

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Заявки</h1>
          <p className="mt-1 text-sm text-muted">
            Заявки с формы на сайте · всего {result.total}
          </p>
        </div>

        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Ребёнок</th>
                <th className="px-4 py-3 font-medium">Класс</th>
                <th className="px-4 py-3 font-medium">Заявитель</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    Заявок пока нет
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 text-graphite">
                      {formatApplicationDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/applications/${item.id}`}
                        className="font-medium text-brick no-underline hover:underline"
                      >
                        {item.childName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-graphite">
                      {formatApplicationClass(item.classGrade, item.classLetter)}
                    </td>
                    <td className="px-4 py-3 text-graphite">{item.applicantName}</td>
                    <td className="px-4 py-3 text-graphite">{item.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          item.status === "new"
                            ? "font-medium text-brick"
                            : "text-muted"
                        }
                      >
                        {applicationStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminChrome>
  );
}
