"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    id: string;
    titleTr: string;
    titleEn: string | null;
    sourceTr: string;
    sourceEn: string | null;
    order: number;
    isActive: boolean;
  };
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [titleTr, setTitleTr] = useState(initialData?.titleTr || "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || "");
  const [sourceTr, setSourceTr] = useState(initialData?.sourceTr || "");
  const [sourceEn, setSourceEn] = useState(initialData?.sourceEn || "");
  const [order, setOrder] = useState<string>(initialData ? String(initialData.order) : "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEditing
      ? `/api/admin/projects/${initialData.id}`
      : "/api/admin/projects";

    const res = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titleTr, titleEn: titleEn || null, sourceTr, sourceEn: sourceEn || null, order: order !== "" ? Number(order) : undefined, isActive }),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      setLoading(false);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Proje Adi (TR) *
          </label>
          <textarea
            value={titleTr}
            onChange={(e) => setTitleTr(e.target.value)}
            required
            rows={3}
            className={inputClass + " resize-none"}
            placeholder="Proje basligini girin..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Project Title (EN)
          </label>
          <textarea
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            rows={3}
            className={inputClass + " resize-none"}
            placeholder="Enter project title..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kaynak (TR) *
          </label>
          <input
            type="text"
            value={sourceTr}
            onChange={(e) => setSourceTr(e.target.value)}
            required
            className={inputClass}
            placeholder="Orn: TÜBİTAK 1507 – 2010"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Source (EN)
          </label>
          <input
            type="text"
            value={sourceEn}
            onChange={(e) => setSourceEn(e.target.value)}
            className={inputClass}
            placeholder="e.g. TUBITAK 1507 – 2010"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Sira
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Oto"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Durum
          </label>
          <select
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className={inputClass}
          >
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
      >
        <Save size={18} />
        {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Kaydet"}
      </button>
    </form>
  );
}
