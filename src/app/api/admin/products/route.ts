import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { shiftOrder } from "@/lib/order";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: {
      translations: true,
      category: { include: { translations: true } },
      images: { orderBy: { order: "asc" } },
      models: { include: { translations: true }, orderBy: { order: "asc" } },
      catalogs: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { categoryId, order, isActive, showOnHome, homeImage, translations, models, images, catalogs } = body;

  // Auto-generate slug from Turkish name
  const trName = (translations.tr as { name: string }).name;
  const slug = slugify(trName);

  // Auto-assign next order within category if not provided, otherwise shift existing
  let finalOrder = order;
  if (finalOrder === undefined || finalOrder === null || finalOrder === "") {
    const last = await prisma.product.findFirst({
      where: { categoryId: categoryId || null },
      orderBy: { order: "desc" },
    });
    finalOrder = last ? last.order + 1 : 0;
  } else {
    finalOrder = Number(finalOrder);
    await shiftOrder("product", finalOrder, { categoryId: categoryId || null });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      categoryId: categoryId || null,
      order: Number(finalOrder),
      isActive: isActive ?? true,
      showOnHome: showOnHome ?? false,
      homeImage: homeImage || null,
      translations: {
        create: Object.entries(translations).map(([locale, data]) => {
          const t = data as { name: string; shortDescription?: string; description: string; features?: string };
          return {
            locale,
            slug: slugify(t.name),
            name: t.name,
            shortDescription: t.shortDescription || null,
            description: t.description,
            features: t.features || null,
          };
        }),
      },
      ...(images?.length && {
        images: {
          create: images.map((img: { url: string; altTr?: string; altEn?: string; order?: number; isMain?: boolean }) => ({
            url: img.url,
            altTr: img.altTr || null,
            altEn: img.altEn || null,
            order: img.order || 0,
            isMain: img.isMain || false,
          })),
        },
      }),
      ...(catalogs?.length && {
        catalogs: {
          create: catalogs.map((cat: { title: string; url: string; fileSize?: string; order?: number }) => ({
            title: cat.title,
            url: cat.url,
            fileSize: cat.fileSize || null,
            order: cat.order || 0,
          })),
        },
      }),
    },
    include: { translations: true, images: true, catalogs: true },
  });

  // Create models separately (they have their own translations)
  if (models?.length) {
    for (const model of models) {
      await prisma.productModel.create({
        data: {
          productId: product.id,
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

  return NextResponse.json(product);
}
