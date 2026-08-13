import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import type { Page } from "@/db/schema";
import { getSession } from "@/server/auth";
import { listPages } from "@/server/crud";

export default async function AdminPagesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const result = await listPages({ page: 1, perPage: 100 });
  const items = result.items as Page[];

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Страницы</h1>
          <p className="mt-1 text-sm text-muted">
            Откройте страницу, чтобы собрать её из блоков
          </p>
        </div>
        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Путь</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {items.map((page) => (
                <tr key={page.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="font-medium text-brick no-underline hover:underline"
                    >
                      {page.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-graphite">{page.path}</td>
                  <td className="px-4 py-3 text-muted">
                    {page.status === "published"
                      ? "Опубликована"
                      : page.status === "draft"
                        ? "Черновик"
                        : "В архиве"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminChrome>
  );
}
