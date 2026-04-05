import { prisma } from "@/lib/db";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import TeamMemberRow from "@/components/admin/TeamMemberRow";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });

  const experts = members.filter((m) => m.type === "expert");
  const consultants = members.filter((m) => m.type === "consultant");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ekip Yönetimi</h1>
      </div>

      {/* Add new member form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Üye Ekle</h2>
        <TeamMemberForm />
      </div>

      {/* Experts */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Uzman Kadro</h2>
        <MemberTable members={experts} />
      </div>

      {/* Consultants */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Danışman Kadro</h2>
        <MemberTable members={consultants} />
      </div>
    </div>
  );
}

interface Member {
  id: string;
  fullName: string;
  titleTr: string;
  titleEn: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  type: string;
}

function MemberTable({ members }: { members: Member[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sıra</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fotoğraf</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Görevi (TR/EN)</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Durum</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                Henüz üye eklenmemiş.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
