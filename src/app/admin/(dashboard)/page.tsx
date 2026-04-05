import { prisma } from "@/lib/db";
import { Package, AppWindow, MessageSquare, Eye, FolderCheck } from "lucide-react";

export default async function AdminDashboard() {
  const [productCount, applicationCount, messageCount, unreadCount, projectCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.application.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.completedProject.count(),
    ]);

  const stats = [
    {
      label: "Ürünler",
      value: productCount,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
    },
    {
      label: "Uygulamalar",
      value: applicationCount,
      icon: AppWindow,
      href: "/admin/applications",
      color: "bg-green-500",
    },
    {
      label: "Projeler",
      value: projectCount,
      icon: FolderCheck,
      href: "/admin/projects",
      color: "bg-amber-500",
    },
    {
      label: "Toplam Mesaj",
      value: messageCount,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "bg-purple-500",
    },
    {
      label: "Okunmamış Mesaj",
      value: unreadCount,
      icon: Eye,
      href: "/admin/messages",
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hoş Geldiniz
        </h2>
        <p className="text-gray-600">
          Argenit yönetici panelinden ürünlerinizi, uygulamalarınızı, sayfa
          içeriklerinizi ve iletişim mesajlarınızı yönetebilirsiniz.
        </p>
      </div>
    </div>
  );
}
