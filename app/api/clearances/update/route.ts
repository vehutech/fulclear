// ================================================================
// FILE: src/app/api/clearances/update/route.ts
// PURPOSE: Update clearance status (Official only)
// ================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import sql from '@/lib/database/neon-connection';
import { updateClearanceSchema } from '@/lib/validation/clearance-schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'official') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clearanceId, status, issueDescription } = updateClearanceSchema.parse(body);

    // Verify official owns this clearance type
    const [official] = await sql`
      SELECT official_type FROM official_profiles WHERE user_id = ${session.id}
    `;

    if (!official) {
      return NextResponse.json(
        { error: 'Official profile not found' },
        { status: 404 }
      );
    }

    const [clearance] = await sql`
      SELECT * FROM clearances 
      WHERE id = ${clearanceId} AND official_type = ${official.official_type}
    `;

    if (!clearance) {
      return NextResponse.json(
        { error: 'Clearance not found or unauthorized' },
        { status: 404 }
      );
    }

    await sql`
      UPDATE clearances
      SET status = ${status},
          issue_description = ${issueDescription || null},
          reviewed_by = ${session.id},
          reviewed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${clearanceId}
    `;

    return NextResponse.json({
      success: true,
      message: `Clearance ${status} successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update clearance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}