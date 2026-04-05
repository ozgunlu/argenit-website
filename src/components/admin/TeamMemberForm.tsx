"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Upload, X, User } from "lucide-react";

export default function TeamMemberForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "team");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.get("fullName"),
        titleTr: data.get("titleTr"),
        titleEn: data.get("titleEn") || null,
        image: imageUrl,
        type: data.get("type"),
        order: data.get("order") ? Number(data.get("order")) : null,
      }),
    });

    if (res.ok) {
      form.reset();
      setImageUrl(null);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Photo upload */}
        <div className="shrink-0">
          <label className="block text-xs font-medium text-gray-500 mb-1">Fotoğraf</label>
          <div className="relative">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-gray-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : imageUrl ? (
                <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="80px" />
              ) : (
                <Upload size={20} className="text-gray-400" />
              )}
            </div>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X size={12} />
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Ad Soyad *</label>
          <input
            name="fullName"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Görevi (TR) *</label>
          <input
            name="titleTr"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Title (EN)</label>
          <input
            name="titleEn"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="w-[140px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Tür *</label>
          <select
            name="type"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="expert">Uzman</option>
            <option value="consultant">Danışman</option>
          </select>
        </div>
        <div className="w-[80px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Sıra</label>
          <input
            name="order"
            type="number"
            placeholder="Oto"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {loading ? "Ekleniyor..." : "Ekle"}
        </button>
      </div>
    </form>
  );
}
