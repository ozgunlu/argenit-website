"use client";

import Image from "next/image";
import ScrollReveal from "@/components/home/ScrollReveal";
import { User } from "lucide-react";

interface TeamMember {
  id: string;
  fullName: string;
  titleTr: string;
  titleEn: string | null;
  image: string | null;
}

export default function TeamGrid({ members, locale = "tr" }: { members: TeamMember[]; locale?: string }) {
  if (members.length === 0) {
    return (
      <p className="text-slate-400 text-sm">Henüz kayıt eklenmemiş.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
      {members.map((member, i) => (
        <ScrollReveal key={member.id} delay={i * 0.06}>
          <div className="group">
            <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-xl">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.fullName}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <User size={48} className="text-slate-300" />
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-slate-900">
                {member.fullName}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {locale === "en" ? (member.titleEn || member.titleTr) : member.titleTr}
              </p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
