import { prisma } from "@/lib/db";
import { Mail, MailOpen } from "lucide-react";
import MarkReadButton from "@/components/admin/MarkReadButton";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        İletişim Mesajları
      </h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            Henüz mesaj yok.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl p-6 shadow-sm border ${
                msg.isRead ? "border-gray-100" : "border-primary/30 bg-blue-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {msg.isRead ? (
                      <MailOpen size={18} className="text-gray-400" />
                    ) : (
                      <Mail size={18} className="text-primary" />
                    )}
                    <h3 className="font-semibold text-gray-900">
                      {msg.subject}
                    </h3>
                  </div>
                  {msg.message && (
                    <p className="text-sm text-gray-600 mb-3">{msg.message}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>{msg.name}</span>
                    <span>{msg.organization}</span>
                    <span>{msg.email}</span>
                    {msg.phone && <span>{msg.phone}</span>}
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {!msg.isRead && <MarkReadButton id={msg.id} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
