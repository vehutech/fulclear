
// ================================================================
// FILE: src/app/api/auth/session/route.ts
// PURPOSE: Get current session user
// ================================================================
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';

export async function GET() {
  const user = await getSessionUser();
  
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}