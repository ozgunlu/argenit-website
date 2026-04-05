import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const trMap: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};

function slugify(text: string): string {
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (ch) => trMap[ch] || ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const prisma = new PrismaClient();

async function main() {
  const translations = await prisma.productTranslation.findMany();
  console.log("Total translations:", translations.length);
  for (const t of translations) {
    const slug = slugify(t.name);
    await prisma.productTranslation.update({
      where: { id: t.id },
      data: { slug },
    });
    console.log(`${t.locale}: ${t.name} -> ${slug}`);
  }
  await prisma.$disconnect();
}

main();
