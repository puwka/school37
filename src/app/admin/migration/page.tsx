import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { migrationGaps, sourceBaseUrl } from "@/data/migration-gaps";
import { getSession } from "@/server/auth";

export default async function AdminMigrationPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const statusLabel = {
    done: "Готово",
    partial: "Частично",
    manual: "Вручную",
  } as const;

  return (
    <AdminChrome userName={session.name}>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Перенос с исходного сайта</h1>
          <p className="mt-1 text-sm text-muted">
            Источник:{" "}
            <a
              href={sourceBaseUrl}
              className="text-brick no-underline hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {sourceBaseUrl}
            </a>
          </p>
          <p className="mt-2 max-w-prose text-[15px] text-graphite">
            Ниже — сверка: что уже в CMS, а что нельзя было надёжно выгрузить
            автоматически (JS-пагинация документов, пустые шаблоны Госвеба).
            Факты не выдумывались.
          </p>
        </div>

        <div className="overflow-x-auto border border-line bg-surface">
          <table className="w-full text-left text-[15px]">
            <thead className="border-b border-line text-sm text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Раздел</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {migrationGaps.map((gap) => (
                <tr key={gap.area} className="border-b border-line last:border-b-0 align-top">
                  <td className="px-4 py-3 font-medium">{gap.area}</td>
                  <td className="px-4 py-3 text-graphite">{statusLabel[gap.status]}</td>
                  <td className="px-4 py-3 text-graphite">{gap.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted">
          Файлы лежат в{" "}
          <code className="text-ink">public/uploads/documents</code>, фото — в{" "}
          <code className="text-ink">public/uploads/staff</code> и{" "}
          <code className="text-ink">public/uploads/images</code>.{" "}
          <Link href="/admin/pages" className="text-brick no-underline hover:underline">
            К страницам
          </Link>
        </p>
      </div>
    </AdminChrome>
  );
}
