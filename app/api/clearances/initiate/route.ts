// ================================================================
// FILE: src/app/api/clearances/initiate/route.ts
// PURPOSE: Initiate clearance (Student only)
// ================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import sql from '@/lib/database/neon-connection';
import { initiateClearanceSchema } from '@/lib/validation/clearance-schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { officialType, documents } = initiateClearanceSchema.parse(body);

    await sql`
      UPDATE clearances
      SET status = 'initiated',
          documents = ${documents},
          updated_at = CURRENT_TIMESTAMP
      WHERE student_id = ${session.id}
      AND official_type = ${officialType}
    `;

    return NextResponse.json({
      success: true,
      message: 'Clearance initiated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Initiate clearance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}