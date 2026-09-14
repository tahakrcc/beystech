import { NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token || "";
  } catch {
    // yok say
  }
  if (token !== getAdminPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
