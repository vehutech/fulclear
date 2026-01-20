// ================================================================
// FILE: src/app/api/auth/logout/route.ts
// PURPOSE: Logout API endpoint
// ================================================================
import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth/session-manager';

export async function POST() {
  await deleteSessionCookie();
  return NextResponse.json({ success: true });
}
