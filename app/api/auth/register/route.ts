// ================================================================
// FILE: src/app/api/auth/register/route.ts
// PURPOSE: Student registration API endpoint (Admin only)
// ================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import { hashPassword } from '@/lib/auth/password-utils';
import sql from '@/lib/database/neon-connection';
import { registerStudentSchema } from '@/lib/validation/auth-schemas';
import { OFFICIAL_TYPES } from '@/lib/types/user-types';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getSessionUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can register students.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = registerStudentSchema.parse(body);

    // Check if email or matric number already exists
    const [existing] = await sql`
      SELECT u.email, sp.matric_number 
      FROM users u
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.email = ${data.email} OR sp.matric_number = ${data.matricNumber}
    `;

    if (existing) {
      return NextResponse.json(
        { error: 'Email or matric number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user and profile in a transaction
    const [newUser] = await sql.begin(async (sql) => {
      const [user] = await sql`
        INSERT INTO users (email, password_hash, role)
        VALUES (${data.email}, ${passwordHash}, 'student')
        RETURNING id, email, role
      `;

      await sql`
        INSERT INTO student_profiles (user_id, full_name, matric_number, phone_number, department)
        VALUES (${user.id}, ${data.fullName}, ${data.matricNumber}, ${data.phoneNumber}, ${data.department})
      `;

      // Initialize clearances for all officials
      for (const officialType of OFFICIAL_TYPES) {
        await sql`
          INSERT INTO clearances (student_id, official_type, status)
          VALUES (${user.id}, ${officialType}, 'pending')
        `;
      }

      return [user];
    });

    return NextResponse.json({
      success: true,
      message: 'Student registered successfully',
      student: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
