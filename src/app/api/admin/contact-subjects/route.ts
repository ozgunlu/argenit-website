import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subjects = await prisma.contactSubject.findMany({
    include: { translations: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { order, isActive, translations } = body;

  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === "") {
    const last = await prisma.contactSubject.findFirst({ orderBy: { order: "desc" } });
    finalOrder = last ? last.order + 1 : 0;
  } else {
    finalOrder = Number(finalOrder);
    await shiftOrder("contactSubject", finalOrder);
  }

  const subject = await prisma.contactSubject.create({
    data: {
      order: Number(finalOrder),
      isActive: isActive ?? true,
      translations: {
        create: Object.entries(translations).map(([locale, data]) => ({
          locale,
          label: (data as { label: string }).label,
        })),
      },
    },
    include: { translations: true },
  });

  return NextResponse.json(subject);
}
