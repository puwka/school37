import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin/pages");

  return (
    <div className="flex min-h-screen items-center bg-paper px-4 py-12">
      <LoginForm />
    </div>
  );
}
