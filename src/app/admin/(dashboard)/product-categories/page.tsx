"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, Edit, X } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  order: number;
  isActive: boolean;
  translations: { locale: string; name: string }[];
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [order, setOrder] = useState<string>("");
  const [nameTr, setNameTr] = useState("");
  const [nameEn, setNameEn] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const res = await fetch("/api/admin/product-categories");
    if (res.ok) setCategories(await res.json());
  }

  function resetForm() {
    setOrder("");
    setNameTr("");
    setNameEn("");
    setEditing(null);
  }

  function startEdit(cat: Category) {
    setEditing(cat.id);
    setOrder(String(cat.order));
    setNameTr(cat.translations.find((t) => t.locale === "tr")?.name || "");
    setNameEn(cat.translations.find((t) => t.locale === "en")?.name || "");
  }

  async function handleSave() {
    setLoading(true);
    const payload = {
      order: order !== "" ? Number(order) : undefined,
      isActive: true,
      translations: { tr: { name: nameTr }, en: { name: nameEn } },
    };

    const url = editing
      ? `/api/admin/product-categories/${editing}`
      : "/api/admin/product-categories";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      loadCategories();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediginize emin misiniz?")) return;
    await fetch(`/api/admin/product-categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Urun Kategorileri</h1>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          {editing ? "Kategori Duzenle" : "Yeni Kategori"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Turkce Ad *
            </label>
            <input
              type="text"
              value={nameTr}
              onChange={(e) => setNameTr(e.target.value)}
              placeholder="Sitogenetik"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              English Name *
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Cytogenetics"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sira</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Oto"
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading || !nameTr}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {editing ? "Guncelle" : "Ekle"}
            </button>
            {editing && (
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Sira
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Turkce
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                English
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Islemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Henuz kategori eklenmemis.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.order}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.translations.find((t) => t.locale === "tr")?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cat.translations.find((t) => t.locale === "en")?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
