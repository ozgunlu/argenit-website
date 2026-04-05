import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.completedProject.findUnique({ where: { id } });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { titleTr, titleEn, sourceTr, sourceEn, order, isActive } = body;

  // Shift others if order changed
  const current = await prisma.completedProject.findUnique({ where: { id } });
  if (current && order !== undefined && order !== current.order) {
    await shiftOrder("completedProject", Number(order), {}, id);
  }

  const project = await prisma.completedProject.update({
    where: { id },
    data: { titleTr, titleEn: titleEn || null, sourceTr, sourceEn: sourceEn || null, order, isActive },
  });

  return NextResponse.json(project);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.completedProject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
