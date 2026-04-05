import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.completedProject.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { titleTr, titleEn, sourceTr, sourceEn, order, isActive } = body;

  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === "") {
    const last = await prisma.completedProject.findFirst({ orderBy: { order: "desc" } });
    finalOrder = last ? last.order + 1 : 0;
  } else {
    finalOrder = Number(finalOrder);
    await shiftOrder("completedProject", finalOrder);
  }

  const project = await prisma.completedProject.create({
    data: {
      titleTr,
      titleEn: titleEn || null,
      sourceTr,
      sourceEn: sourceEn || null,
      order: Number(finalOrder),
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(project);
}
