import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { shiftOrder } from "@/lib/order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      translations: true,
      category: { include: { translations: true } },
      images: { orderBy: { order: "asc" } },
      models: { include: { translations: true }, orderBy: { order: "asc" } },
      catalogs: { orderBy: { order: "asc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { categoryId, order, isActive, showOnHome, homeImage, translations, models, images, catalogs } = body;

  // Auto-generate slug from Turkish name
  const trName = (translations.tr as { name: string }).name;
  const slug = slugify(trName);

  // Shift others if order changed
  const current = await prisma.product.findUnique({ where: { id } });
  if (current && order !== undefined && order !== current.order) {
    await shiftOrder("product", Number(order), { categoryId: categoryId || null }, id);
  }

  // Update product base
  await prisma.product.update({
    where: { id },
    data: { slug, categoryId: categoryId || null, order, isActive, showOnHome: showOnHome ?? false, homeImage: homeImage || null },
  });

  // Upsert translations
  for (const [locale, data] of Object.entries(translations)) {
    const t = data as { name: string; shortDescription?: string; description: string; features?: string };
    const localeSlug = slugify(t.name);
    await prisma.productTranslation.upsert({
      where: { productId_locale: { productId: id, locale } },
      update: {
        slug: localeSlug,
        name: t.name,
        shortDescription: t.shortDescription || null,
        description: t.description,
        features: t.features || null,
      },
      create: {
        productId: id,
        locale,
        slug: localeSlug,
        name: t.name,
        shortDescription: t.shortDescription || null,
        description: t.description,
        features: t.features || null,
      },
    });
  }

  // Replace images
  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: { url: string; altTr?: string; altEn?: string; order?: number; isMain?: boolean }) => ({
          productId: id,
          url: img.url,
          altTr: img.altTr || null,
          altEn: img.altEn || null,
          order: img.order || 0,
          isMain: img.isMain || false,
        })),
      });
    }
  }

  // Replace models
  if (models) {
    await prisma.productModel.deleteMany({ where: { productId: id } });
    for (const model of models) {
      await prisma.productModel.create({
        data: {
          productId: id,
          order: model.order || 0,
          translations: {
            create: Object.entries(model.translations).map(([locale, data]) => {
              const t = data as { name: string; description: string };
              return { locale, name: t.name, description: t.description };
            }),
          },
        },
      });
    }
  }

  // Replace catalogs
  if (catalogs) {
    await prisma.productCatalog.deleteMany({ where: { productId: id } });
    if (catalogs.length > 0) {
      await prisma.productCatalog.createMany({
        data: catalogs.map((cat: { title: string; url: string; fileSize?: string; order?: number }) => ({
          productId: id,
          title: cat.title,
          url: cat.url,
          fileSize: cat.fileSize || null,
          order: cat.order || 0,
        })),
      });
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: {
      translations: true,
      images: { orderBy: { order: "asc" } },
      models: { include: { translations: true }, orderBy: { order: "asc" } },
      catalogs: { orderBy: { order: "asc" } },
    },
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
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
