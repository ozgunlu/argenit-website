"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  endpoint,
}: {
  id: string;
  endpoint: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
    >
      <Trash2 size={16} />
    </button>
  );
}
