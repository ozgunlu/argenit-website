import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get("locale") || "tr";

  const subjects = await prisma.contactSubject.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });

  const result = subjects
    .filter((s) => s.translations.length > 0)
    .map((s) => ({
      id: s.id,
      label: s.translations[0].label,
    }));

  return NextResponse.json(result);
}
