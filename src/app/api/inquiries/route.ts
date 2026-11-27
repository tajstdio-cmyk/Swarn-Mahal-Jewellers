import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/storeDb";
import { Inquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { error: "Name, phone, and message are required." },
        { status: 400 }
      );
    }

    const store = await readStore();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      type: body.type || "appointment",
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: body.email ? String(body.email).trim() : undefined,
      preferredDate: body.preferredDate
        ? String(body.preferredDate).trim()
        : undefined,
      productName: body.productName
        ? String(body.productName).trim()
        : undefined,
      message: String(body.message).trim(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    store.inquiries = [newInquiry, ...(store.inquiries || [])];
    await writeStore(store);

    return NextResponse.json({ inquiry: newInquiry }, { status: 201 });
  } catch (err) {
    console.error("POST /api/inquiries error:", err);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
