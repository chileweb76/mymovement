import { NextResponse } from "next/server";
import { resetPassword } from "../../../../models/user.js";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

    const ok = await resetPassword(token, password);
    if (!ok) return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
