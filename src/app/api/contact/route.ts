import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, organization, email, phone, subject, message, kvkkConsent } = body;

    if (!name || !organization || !email || !subject || !kvkkConsent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        organization,
        email,
        phone: phone || null,
        subject,
        message: message || null,
        kvkkConsent,
      },
    });

    return NextResponse.json({ success: true, id: contact.id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
