import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import type { News } from "@/db/schema";
import { getSession } from "@/server/auth";
import { listNewsAdmin } from "@/server/crud";

function statusLabel(status: string) {
  if (status === "published") return "Опубликовано";
  if (status === "draft") return "Черновик";
  return "В архиве";
}

export default async function AdminNewsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const result = await listNewsAdmin({ page: 1, perPage: 100 });
  const items = result.items as News[];

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold">Новости</h1>
            <p className="mt-1 text-sm text-muted">
              Новости, объявления и мероприятия школы
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-brick px-4 text-[15px] font-medium text-white no-underline hover:bg-brick-hover"
          >
            Добавить
          </Link>
        </div>

        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Заголовок</th>
                <th className="px-4 py-3 font-medium">Тип</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="font-medium text-brick no-underline hover:underline"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-graphite">{item.kind}</td>
                  <td className="px-4 py-3 text-muted">{statusLabel(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminChrome>
  );
}
