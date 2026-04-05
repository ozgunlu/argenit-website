"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Check, X } from "lucide-react";
import DeleteButton from "./DeleteButton";

interface Translation {
  id: string;
  locale: string;
  label: string;
}

interface Subject {
  id: string;
  order: number;
  isActive: boolean;
  translations: Translation[];
}

export default function ContactSubjectRow({ subject }: { subject: Subject }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const trLabel = subject.translations.find((t) => t.locale === "tr")?.label || "";
  const enLabel = subject.translations.find((t) => t.locale === "en")?.label || "";

  const [labelTr, setLabelTr] = useState(trLabel);
  const [labelEn, setLabelEn] = useState(enLabel);
  const [order, setOrder] = useState(subject.order);
  const [isActive, setIsActive] = useState(subject.isActive);

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/admin/contact-subjects/${subject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order,
        isActive,
        translations: {
          tr: { label: labelTr },
          en: { label: labelEn || labelTr },
        },
      }),
    });
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
    setLoading(false);
  }

  function handleCancel() {
    setLabelTr(trLabel);
    setLabelEn(enLabel);
    setOrder(subject.order);
    setIsActive(subject.isActive);
    setEditing(false);
  }

  if (editing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-6 py-3">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </td>
        <td className="px-6 py-3">
          <input
            value={labelTr}
            onChange={(e) => setLabelTr(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </td>
        <td className="px-6 py-3">
          <input
            value={labelEn}
            onChange={(e) => setLabelEn(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </td>
        <td className="px-6 py-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
              isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {isActive ? "Aktif" : "Pasif"}
          </button>
        </td>
        <td className="px-6 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-500">{subject.order}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{trLabel}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{enLabel}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            subject.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {subject.isActive ? "Aktif" : "Pasif"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100"
          >
            <Edit size={16} />
          </button>
          <DeleteButton id={subject.id} endpoint="/api/admin/contact-subjects" />
        </div>
      </td>
    </tr>
  );
}
