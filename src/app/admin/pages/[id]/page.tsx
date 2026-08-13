import { notFound, redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { PageBlockEditor } from "@/components/admin/page-block-editor";
import { getSession } from "@/server/auth";
import { getPage } from "@/server/crud";

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  let page;
  try {
    page = await getPage(id);
  } catch {
    notFound();
  }

  return (
    <AdminChrome userName={session.name}>
      <PageBlockEditor
        pageId={page.id}
        pageTitle={page.title}
        pagePath={page.path}
        initialBlocks={page.blocks.map((block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
          sortOrder: block.sortOrder,
          isVisible: block.isVisible,
        }))}
      />
    </AdminChrome>
  );
}
