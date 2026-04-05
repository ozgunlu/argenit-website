import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { shiftOrder } from "@/lib/order";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.productCategory.findMany({
    include: { translations: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { order, isActive, translations } = body;

  // Auto-generate slug from Turkish name
  const trName = (translations.tr as { name: string }).name;
  const slug = slugify(trName);

  // Auto-assign next order if not provided, otherwise shift existing
  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === "") {
    const last = await prisma.productCategory.findFirst({
      orderBy: { order: "desc" },
    });
    finalOrder = last ? last.order + 1 : 0;
  } else {
    finalOrder = Number(finalOrder);
    await shiftOrder("productCategory", finalOrder);
  }

  const category = await prisma.productCategory.create({
    data: {
      slug,
      order: Number(finalOrder),
      isActive: isActive ?? true,
      translations: {
        create: Object.entries(translations).map(([locale, data]) => ({
          locale,
          name: (data as { name: string }).name,
        })),
      },
    },
    include: { translations: true },
  });

  return NextResponse.json(category);
}
