// ================================================================
// FILE: src/app/api/students/route.ts
// PURPOSE: Get all students (Admin only)
// ================================================================
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import sql from '@/lib/database/neon-connection';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await sql`
      SELECT u.id, u.email, sp.full_name, sp.matric_number, sp.department, sp.phone_number, u.created_at
      FROM users u
      JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.role = 'student'
      ORDER BY sp.full_name
    `;

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}