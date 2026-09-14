import { NextResponse } from "next/server";
import { readContent, writeContent, getAdminPassword } from "@/lib/content-server";
import type { Content } from "@/lib/content-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readContent());
}

export async function PUT(request: Request) {
  const token = request.headers.get("x-admin-token") || "";
  if (token !== getAdminPassword()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let body: Content;
  try {
    body = (await request.json()) as Content;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  if (!body || !Array.isArray(body.works) || !Array.isArray(body.team)) {
    return NextResponse.json({ error: "Geçersiz içerik yapısı" }, { status: 400 });
  }

  try {
    await writeContent(body);
  } catch {
    return NextResponse.json({ error: "Kaydedilemedi" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
