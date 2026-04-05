import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shiftOrder } from "@/lib/order";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type");

  const members = await prisma.teamMember.findMany({
    where: type ? { type } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fullName, titleTr, titleEn, image, type, order, isActive } = body;

  // Auto-assign next order if not provided, otherwise shift existing
  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === "") {
    const lastMember = await prisma.teamMember.findFirst({
      where: { type },
      orderBy: { order: "desc" },
    });
    finalOrder = lastMember ? lastMember.order + 1 : 0;
  } else {
    finalOrder = Number(finalOrder);
    await shiftOrder("teamMember", finalOrder, { type });
  }

  const member = await prisma.teamMember.create({
    data: {
      fullName,
      titleTr,
      titleEn: titleEn || null,
      image: image || null,
      type,
      order: Number(finalOrder),
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(member);
}
