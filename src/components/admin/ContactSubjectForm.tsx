"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function ContactSubjectForm() {
  const router = useRouter();
  const [labelTr, setLabelTr] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!labelTr.trim()) return;
    setLoading(true);

    const res = await fetch("/api/admin/contact-subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: order !== "" ? Number(order) : null,
        translations: {
          tr: { label: labelTr },
          en: { label: labelEn || labelTr },
        },
      }),
    });

    if (res.ok) {
      setLabelTr("");
      setLabelEn("");
      setOrder("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Türkçe *
        </label>
        <input
          type="text"
          value={labelTr}
          onChange={(e) => setLabelTr(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          placeholder="Örn: Kromozom Analiz Sistemi"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          English
        </label>
        <input
          type="text"
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          placeholder="e.g. Chromosome Analysis System"
        />
      </div>
      <div className="w-[80px]">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Sıra
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="Oto"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        <Plus size={16} />
        {loading ? "Ekleniyor..." : "Ekle"}
      </button>
    </form>
  );
}
