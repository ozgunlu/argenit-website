"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleClick() {
    await fetch(`/api/admin/messages/${id}/read`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
    >
      <Check size={14} />
      Okundu
    </button>
  );
}
