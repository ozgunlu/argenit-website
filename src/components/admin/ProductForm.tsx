"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  FileText,
  GripVertical,
  ImageIcon,
  Star,
} from "lucide-react";
import Link from "next/link";

interface Translation {
  name: string;
  shortDescription: string;
  description: string;
  features: string;
}

interface ModelTranslation {
  name: string;
  description: string;
}

interface ProductModelData {
  order: number;
  translations: { tr: ModelTranslation; en: ModelTranslation };
}

interface ImageData {
  url: string;
  altTr: string;
  altEn: string;
  order: number;
  isMain: boolean;
  file?: File;
  preview?: string;
}

interface CatalogData {
  title: string;
  url: string;
  fileSize: string;
  order: number;
  file?: File;
}

interface Category {
  id: string;
  slug: string;
  translations: { locale: string; name: string }[];
}

interface Props {
  productId?: string;
}

export default function ProductForm({ productId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!productId);
  const [categories, setCategories] = useState<Category[]>([]);

  // Basic info
  const [categoryId, setCategoryId] = useState("");
  const [order, setOrder] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [showOnHome, setShowOnHome] = useState(false);
  const [homeImage, setHomeImage] = useState<string>("");
  const [homeImageFile, setHomeImageFile] = useState<File | null>(null);
  const [homeImagePreview, setHomeImagePreview] = useState<string>("");

  // Translations
  const [trContent, setTrContent] = useState<Translation>({
    name: "",
    shortDescription: "",
    description: "",
    features: "",
  });
  const [enContent, setEnContent] = useState<Translation>({
    name: "",
    shortDescription: "",
    description: "",
    features: "",
  });

  // Models
  const [models, setModels] = useState<ProductModelData[]>([]);

  // Images
  const [images, setImages] = useState<ImageData[]>([]);

  // Catalogs
  const [catalogs, setCatalogs] = useState<CatalogData[]>([]);

  // Load categories
  useEffect(() => {
    fetch("/api/admin/product-categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Load existing product
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((p) => {
        setCategoryId(p.categoryId || "");
        setOrder(String(p.order));
        setIsActive(p.isActive);
        setShowOnHome(p.showOnHome || false);
        setHomeImage(p.homeImage || "");

        const tr = p.translations.find((t: { locale: string }) => t.locale === "tr");
        const en = p.translations.find((t: { locale: string }) => t.locale === "en");

        if (tr)
          setTrContent({
            name: tr.name,
            shortDescription: tr.shortDescription || "",
            description: tr.description,
            features: tr.features || "",
          });
        if (en)
          setEnContent({
            name: en.name,
            shortDescription: en.shortDescription || "",
            description: en.description,
            features: en.features || "",
          });

        if (p.models?.length) {
          setModels(
            p.models.map(
              (m: {
                order: number;
                translations: { locale: string; name: string; description: string }[];
              }) => {
                const mtr = m.translations.find((t) => t.locale === "tr");
                const men = m.translations.find((t) => t.locale === "en");
                return {
                  order: m.order,
                  translations: {
                    tr: { name: mtr?.name || "", description: mtr?.description || "" },
                    en: { name: men?.name || "", description: men?.description || "" },
                  },
                };
              }
            )
          );
        }

        if (p.images?.length) {
          setImages(
            p.images.map(
              (img: { url: string; altTr?: string; altEn?: string; order: number; isMain: boolean }) => ({
                url: img.url,
                altTr: img.altTr || "",
                altEn: img.altEn || "",
                order: img.order,
                isMain: img.isMain,
              })
            )
          );
        }

        if (p.catalogs?.length) {
          setCatalogs(
            p.catalogs.map(
              (c: { title: string; url: string; fileSize: string; order: number }) => ({
                title: c.title,
                url: c.url,
                fileSize: c.fileSize || "",
                order: c.order,
              })
            )
          );
        }

        setInitialLoading(false);
      });
  }, [productId]);

  async function uploadFile(file: File, folder: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload new images
      const processedImages = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const url = await uploadFile(img.file, "products");
            return { url, altTr: img.altTr, altEn: img.altEn, order: img.order, isMain: img.isMain };
          }
          return { url: img.url, altTr: img.altTr, altEn: img.altEn, order: img.order, isMain: img.isMain };
        })
      );

      // Upload new catalogs
      const processedCatalogs = await Promise.all(
        catalogs.map(async (cat) => {
          if (cat.file) {
            const url = await uploadFile(cat.file, "documents");
            const fileSize = formatFileSize(cat.file.size);
            return { title: cat.title, url, fileSize, order: cat.order };
          }
          return { title: cat.title, url: cat.url, fileSize: cat.fileSize, order: cat.order };
        })
      );

      // Upload homepage image if new file
      let finalHomeImage = homeImage;
      if (homeImageFile) {
        finalHomeImage = await uploadFile(homeImageFile, "products");
      }

      const payload = {
        categoryId: categoryId || null,
        order: order !== "" ? Number(order) : undefined,
        isActive,
        showOnHome,
        homeImage: showOnHome ? finalHomeImage || null : null,
        translations: { tr: trContent, en: enContent },
        models,
        images: processedImages,
        catalogs: processedCatalogs,
      };

      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/products");
      }
    } finally {
      setLoading(false);
    }
  }

  function addModel() {
    setModels([
      ...models,
      {
        order: models.length,
        translations: {
          tr: { name: "", description: "" },
          en: { name: "", description: "" },
        },
      },
    ]);
  }

  function removeModel(index: number) {
    setModels(models.filter((_, i) => i !== index));
  }

  function updateModel(
    index: number,
    locale: "tr" | "en",
    field: "name" | "description",
    value: string
  ) {
    const updated = [...models];
    updated[index].translations[locale][field] = value;
    setModels(updated);
  }

  function addImage() {
    setImages([
      ...images,
      { url: "", altTr: "", altEn: "", order: images.length, isMain: images.length === 0, preview: "" },
    ]);
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    // If removed image was main, make first one main
    if (images[index].isMain && updated.length > 0) {
      updated[0].isMain = true;
    }
    setImages(updated);
  }

  function setMainImage(index: number) {
    setImages(
      images.map((img, i) => ({ ...img, isMain: i === index }))
    );
  }

  function handleImageFile(index: number, file: File) {
    const updated = [...images];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setImages(updated);
  }

  function addCatalog() {
    setCatalogs([
      ...catalogs,
      { title: "", url: "", fileSize: "", order: catalogs.length },
    ]);
  }

  function removeCatalog(index: number) {
    setCatalogs(catalogs.filter((_, i) => i !== index));
  }

  function handleCatalogFile(index: number, file: File) {
    const updated = [...catalogs];
    updated[index].file = file;
    updated[index].title = updated[index].title || file.name.replace(/\.pdf$/i, "");
    updated[index].fileSize = formatFileSize(file.size);
    setCatalogs(updated);
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {productId ? "Ürün Düzenle" : "Yeni Ürün"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">Kategori seçin...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.translations.find((t) => t.locale === "tr")?.name || cat.slug}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sıralama</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="Oto"
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Homepage Display ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Anasayfa Gorunumu</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnHome}
                onChange={(e) => setShowOnHome(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Anasayfada Goster</span>
                <p className="text-xs text-gray-400">Bu urun anasayfadaki slider'da gorunecektir.</p>
              </div>
            </label>

            {showOnHome && (
              <div className="pt-2">
                <label className={labelClass}>
                  Anasayfa Gorseli *
                  <span className="font-normal text-gray-400 ml-1">(Onerilen: 800×729px, yatay)</span>
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-64 aspect-[800/729] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                    {homeImagePreview || homeImage ? (
                      <img
                        src={homeImagePreview || homeImage}
                        alt="Anasayfa gorseli"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">800 × 729px</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setHomeImageFile(f);
                          setHomeImagePreview(URL.createObjectURL(f));
                        }
                      }}
                      className="w-full text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Bu gorsel anasayfadaki urun slider'inda buyuk gorsel olarak kullanilacaktir.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Turkish Content ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Turkce Icerik</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Urun Adi *</label>
              <input
                type="text"
                required
                value={trContent.name}
                onChange={(e) => setTrContent({ ...trContent, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kisa Aciklama (liste icin)</label>
              <div className="relative">
                <textarea
                  value={trContent.shortDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 160)
                      setTrContent({ ...trContent, shortDescription: e.target.value });
                  }}
                  maxLength={160}
                  rows={2}
                  className={inputClass + " resize-none"}
                />
                <span className={`absolute bottom-2 right-3 text-[11px] ${trContent.shortDescription.length >= 160 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  {trContent.shortDescription.length}/160
                </span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Urun Hakkinda *</label>
              <textarea
                required
                value={trContent.description}
                onChange={(e) => setTrContent({ ...trContent, description: e.target.value })}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Ozellikler (her satir bir ozellik)</label>
              <textarea
                value={trContent.features}
                onChange={(e) => setTrContent({ ...trContent, features: e.target.value })}
                rows={5}
                placeholder="Otomatik slayt tarama&#10;Yapay zeka destekli analiz&#10;Uzaktan erisim"
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* ── English Content ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">English Content</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                required
                value={enContent.name}
                onChange={(e) => setEnContent({ ...enContent, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Short Description (for listing)</label>
              <div className="relative">
                <textarea
                  value={enContent.shortDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 160)
                      setEnContent({ ...enContent, shortDescription: e.target.value });
                  }}
                  maxLength={160}
                  rows={2}
                  className={inputClass + " resize-none"}
                />
                <span className={`absolute bottom-2 right-3 text-[11px] ${enContent.shortDescription.length >= 160 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  {enContent.shortDescription.length}/160
                </span>
              </div>
            </div>
            <div>
              <label className={labelClass}>About Product *</label>
              <textarea
                required
                value={enContent.description}
                onChange={(e) => setEnContent({ ...enContent, description: e.target.value })}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Features (one per line)</label>
              <textarea
                value={enContent.features}
                onChange={(e) => setEnContent({ ...enContent, features: e.target.value })}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Gorseller</h2>
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light"
            >
              <Plus size={16} /> Gorsel Ekle
            </button>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Henuz gorsel eklenmemis.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`relative border rounded-xl overflow-hidden ${
                    img.isMain ? "ring-2 ring-primary" : "border-gray-200"
                  }`}
                >
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                    {img.preview || img.url ? (
                      <img
                        src={img.preview || img.url}
                        alt={img.altTr || img.altEn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-2 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageFile(i, f);
                      }}
                      className="w-full text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Alt metin (TR)"
                      value={img.altTr}
                      onChange={(e) => {
                        const updated = [...images];
                        updated[i].altTr = e.target.value;
                        setImages(updated);
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Alt text (EN)"
                      value={img.altEn}
                      onChange={(e) => {
                        const updated = [...images];
                        updated[i].altEn = e.target.value;
                        setImages(updated);
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setMainImage(i)}
                        className={`inline-flex items-center gap-1 text-xs ${
                          img.isMain
                            ? "text-primary font-medium"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <Star size={12} fill={img.isMain ? "currentColor" : "none"} />
                        {img.isMain ? "Ana" : "Ana yap"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Models ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Urun Modelleri</h2>
            <button
              type="button"
              onClick={addModel}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light"
            >
              <Plus size={16} /> Model Ekle
            </button>
          </div>

          {models.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Henuz model eklenmemis.
            </p>
          ) : (
            <div className="space-y-4">
              {models.map((model, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-gray-300" />
                      <span className="text-sm font-medium text-gray-700">
                        Model {i + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModel(i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* TR */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">Turkce</p>
                      <input
                        type="text"
                        placeholder="Model adi"
                        value={model.translations.tr.name}
                        onChange={(e) => updateModel(i, "tr", "name", e.target.value)}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="Model aciklamasi"
                        value={model.translations.tr.description}
                        onChange={(e) =>
                          updateModel(i, "tr", "description", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    {/* EN */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">English</p>
                      <input
                        type="text"
                        placeholder="Model name"
                        value={model.translations.en.name}
                        onChange={(e) => updateModel(i, "en", "name", e.target.value)}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="Model description"
                        value={model.translations.en.description}
                        onChange={(e) =>
                          updateModel(i, "en", "description", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Catalogs ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kataloglar (PDF)</h2>
            <button
              type="button"
              onClick={addCatalog}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light"
            >
              <Plus size={16} /> Katalog Ekle
            </button>
          </div>

          {catalogs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Henuz katalog eklenmemis.
            </p>
          ) : (
            <div className="space-y-3">
              {catalogs.map((cat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border border-gray-200 rounded-lg p-4"
                >
                  <FileText size={24} className="text-red-400 shrink-0" />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Katalog adi"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...catalogs];
                          updated[i].title = e.target.value;
                          setCatalogs(updated);
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCatalogFile(i, f);
                        }}
                        className="w-full text-sm"
                      />
                      {cat.fileSize && (
                        <span className="text-xs text-gray-400 mt-1">{cat.fileSize}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCatalog(i)}
                    className="text-red-400 hover:text-red-600 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
