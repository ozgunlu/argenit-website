import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-full">
      <AdminSidebar user={session.user} />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
