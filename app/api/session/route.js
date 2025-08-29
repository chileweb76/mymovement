<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({ email: session?.user?.email });
=======
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
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
}
