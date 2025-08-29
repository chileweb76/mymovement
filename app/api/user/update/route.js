import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth.js";
import { updateUserProfileByEmail } from "../../../../models/user.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email: newEmail, image } = body;

    try {
      const updated = await updateUserProfileByEmail(session.user.email, { name, newEmail, image });
      if (!updated) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
      return NextResponse.json({ user: { id: updated._id.toString(), email: updated.email, name: updated.name, image: updated.image || null } });
    } catch (err) {
      if (err && err.code === 'email_in_use') {
        return NextResponse.json({ error: 'email_in_use' }, { status: 409 });
      }
      throw err;
    }
  } catch (err) {
    console.error('update profile error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
