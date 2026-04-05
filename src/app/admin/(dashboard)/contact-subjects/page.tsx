import { prisma } from "@/lib/db";
import ContactSubjectForm from "@/components/admin/ContactSubjectForm";
import ContactSubjectRow from "@/components/admin/ContactSubjectRow";

export default async function AdminContactSubjectsPage() {
  const subjects = await prisma.contactSubject.findMany({
    include: { translations: true },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        İletişim Konu Seçenekleri
      </h1>

      {/* Add new */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Yeni Seçenek Ekle
        </h2>
        <ContactSubjectForm />
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Sıra
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Türkçe
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                English
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Durum
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Henüz seçenek eklenmemiş.
                </td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <ContactSubjectRow key={subject.id} subject={subject} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
