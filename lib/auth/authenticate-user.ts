// PURPOSE: User authentication logic
// ================================================================
import sql from '../database/neon-connection';
import { verifyPassword } from './password-utils';
import type { User } from '../types/user-types';

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const [user] = await sql`
      SELECT id, email, password_hash, role 
      FROM users 
      WHERE email = ${email}
    `;

    if (!user) return null;

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}