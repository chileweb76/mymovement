import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.js';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({ email: session?.user?.email ?? null });
  } catch (err) {
    return NextResponse.json({ email: null });
  }
}
