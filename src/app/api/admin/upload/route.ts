import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "team";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const imageTypes = ["image/jpeg", "image/png", "image/webp"];
  const docTypes = ["application/pdf"];
  const allowedTypes = [...imageTypes, ...docTypes];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Validate file size (images: 5MB, PDFs: 20MB)
  const maxSize = docTypes.includes(file.type) ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Use /documents/ for PDFs, /images/ for images
  const baseDir = docTypes.includes(file.type) ? "documents" : "images";
  const relativePath = `/${baseDir}/${folder}/${filename}`;
  const dir = join(process.cwd(), "public", baseDir, folder);
  const absolutePath = join(dir, filename);

  await mkdir(dir, { recursive: true });
  await writeFile(absolutePath, buffer);

  return NextResponse.json({ url: relativePath });
}
