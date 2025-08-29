import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth.js";
import { findUserByEmail } from "../../../../models/user.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }

    return NextResponse.json({ provider: user.provider || null });
  } catch (err) {
    console.error('provider route error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
