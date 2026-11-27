import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/storeDb";
import { StoreDatabase } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await readStore();
    return NextResponse.json(store, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("GET /api/store error:", err);
    return NextResponse.json(
      { error: "Failed to load store data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<StoreDatabase>;
    const current = await readStore();
    const updated: StoreDatabase = {
      ...current,
      ...body,
      storeInfo: body.storeInfo
        ? { ...current.storeInfo, ...body.storeInfo }
        : current.storeInfo,
      goldRates: body.goldRates
        ? {
            ...current.goldRates,
            ...body.goldRates,
            updatedAt: new Date().toISOString(),
          }
        : current.goldRates,
    };
    const saved = await writeStore(updated);
    return NextResponse.json(saved);
  } catch (err) {
    console.error("PUT /api/store error:", err);
    return NextResponse.json(
      { error: "Failed to save store data" },
      { status: 500 }
    );
  }
}
