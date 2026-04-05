import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { fullName, titleTr, titleEn, image, type, order, isActive } = body;

  // Shift others if order changed
  const current = await prisma.teamMember.findUnique({ where: { id } });
  if (current && order !== undefined && order !== current.order) {
    await shiftOrder("teamMember", Number(order), { type }, id);
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      fullName,
      titleTr,
      titleEn: titleEn || null,
      image: image || null,
      type,
      order: order ?? 0,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
