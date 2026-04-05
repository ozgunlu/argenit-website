"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Edit, Check, X, Upload } from "lucide-react";
import DeleteButton from "./DeleteButton";

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

export default function TeamMemberRow({ member }: { member: Member }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(member.fullName);
  const [titleTr, setTitleTr] = useState(member.titleTr);
  const [titleEn, setTitleEn] = useState(member.titleEn || "");
  const [order, setOrder] = useState(member.order);
  const [isActive, setIsActive] = useState(member.isActive);
  const [imageUrl, setImageUrl] = useState(member.image);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "team");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    }
    setUploading(false);
  }

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/admin/team/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, titleTr, titleEn: titleEn || null, image: imageUrl, type: member.type, order, isActive }),
    });
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
    setLoading(false);
  }

  function handleCancel() {
    setFullName(member.fullName);
    setTitleTr(member.titleTr);
    setTitleEn(member.titleEn || "");
    setOrder(member.order);
    setIsActive(member.isActive);
    setImageUrl(member.image);
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
          <div
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all relative"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : imageUrl ? (
              <Image src={imageUrl} alt={fullName} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <Upload size={14} className="text-gray-400" />
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />
        </td>
        <td className="px-6 py-3">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
          />
        </td>
        <td className="px-6 py-3">
          <input
            value={titleTr}
            onChange={(e) => setTitleTr(e.target.value)}
            placeholder="Görevi (TR)"
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm mb-1"
          />
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Title (EN)"
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
      <td className="px-6 py-4 text-sm text-gray-500">{member.order}</td>
      <td className="px-6 py-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {member.image ? (
            <Image src={member.image} alt={member.fullName} width={40} height={40} className="object-cover w-full h-full" />
          ) : (
            <User size={18} className="text-gray-400" />
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.fullName}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div>{member.titleTr}</div>
        {member.titleEn && <div className="text-xs text-gray-400">{member.titleEn}</div>}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          member.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}>
          {member.isActive ? "Aktif" : "Pasif"}
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
          <DeleteButton id={member.id} endpoint="/api/admin/team" />
        </div>
      </td>
    </tr>
  );
}
