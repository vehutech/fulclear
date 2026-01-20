// ================================================================
// FILE: src/app/api/clearances/list/route.ts
// PURPOSE: Get clearances for current user
// ================================================================
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import sql from '@/lib/database/neon-connection';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role === 'student') {
      const clearances = await sql`
        SELECT c.*, sp.full_name, sp.matric_number, sp.department, sp.phone_number
        FROM clearances c
        JOIN student_profiles sp ON c.student_id = sp.user_id
        WHERE c.student_id = ${session.id}
        ORDER BY c.official_type
      `;

      return NextResponse.json({ clearances });
    }

    if (session.role === 'official') {
      const [official] = await sql`
        SELECT official_type FROM official_profiles WHERE user_id = ${session.id}
      `;

      if (!official) {
        return NextResponse.json(
          { error: 'Official profile not found' },
          { status: 404 }
        );
      }

      const clearances = await sql`
        SELECT c.*, sp.full_name, sp.matric_number, sp.department, sp.phone_number
        FROM clearances c
        JOIN student_profiles sp ON c.student_id = sp.user_id
        WHERE c.official_type = ${official.official_type}
        AND c.status IN ('initiated', 'cleared', 'rejected')
        ORDER BY c.created_at DESC
      `;

      return NextResponse.json({
        clearances,
        officialType: official.official_type,
      });
    }

    if (session.role === 'admin') {
      const clearances = await sql`
        SELECT c.*, sp.full_name, sp.matric_number, sp.department
        FROM clearances c
        JOIN student_profiles sp ON c.student_id = sp.user_id
        ORDER BY c.created_at DESC
      `;

      return NextResponse.json({ clearances });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('List clearances error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}