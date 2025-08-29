import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.js';
import { getEntriesForDate } from '@/lib/queries/dailySummary.js';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, date, topics } = await request.json();
    
    console.log('[daily-summary API] Request body:', { userEmail, date, topics });
    
    // Validate input
    if (!userEmail || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }    // Ensure user can only access their own data
    if (session.user.email !== userEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If client provided explicit start/end ISO strings, use them. Otherwise fall back to date string.
    const entries = await getEntriesForDate(userEmail, date, topics);    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Daily summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
