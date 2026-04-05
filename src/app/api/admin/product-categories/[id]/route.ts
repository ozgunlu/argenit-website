import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
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

  const trName = (translations.tr as { name: string }).name;
  const slug = slugify(trName);

  // Shift others if order changed
  const current = await prisma.productCategory.findUnique({ where: { id } });
  if (current && order !== undefined && order !== current.order) {
    await shiftOrder("productCategory", Number(order), {}, id);
  }

  await prisma.productCategory.update({
    where: { id },
    data: { slug, order, isActive },
  });

  for (const [locale, data] of Object.entries(translations)) {
    const t = data as { name: string };
    await prisma.productCategoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: id, locale } },
      update: { name: t.name },
      create: { categoryId: id, locale, name: t.name },
    });
  }

  const updated = await prisma.productCategory.findUnique({
    where: { id },
    include: { translations: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.productCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
