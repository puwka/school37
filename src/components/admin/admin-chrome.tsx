"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/server/actions";

export function AdminChrome({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            href="/admin"
            className="font-serif text-lg font-semibold text-ink no-underline"
          >
            Админка · СОШ №37
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-3 text-sm text-muted">
            <span>{userName}</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await logoutAction();
                  router.replace("/admin/login");
                  router.refresh();
                })
              }
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
