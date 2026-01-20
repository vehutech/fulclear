// ================================================================
// FILE: src/app/api/auth/login/route.ts
// PURPOSE: Login API endpoint
// ================================================================
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/authenticate-user';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session-manager';
import { loginSchema } from '@/lib/validation/auth-schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}