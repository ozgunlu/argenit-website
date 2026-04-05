import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { order, isActive, translations } = body;

  // Shift others if order changed
  const current = await prisma.contactSubject.findUnique({ where: { id } });
  if (current && order !== undefined && order !== current.order) {
    await shiftOrder("contactSubject", Number(order), {}, id);
  }

  const subject = await prisma.contactSubject.update({
    where: { id },
    data: { order, isActive },
  });

  for (const [locale, data] of Object.entries(translations)) {
    const t = data as { label: string };
    await prisma.contactSubjectTranslation.upsert({
      where: { subjectId_locale: { subjectId: id, locale } },
      update: { label: t.label },
      create: { subjectId: id, locale, label: t.label },
    });
  }

  return NextResponse.json(subject);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.contactSubject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
