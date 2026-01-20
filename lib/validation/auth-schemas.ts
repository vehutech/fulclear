// PURPOSE: Zod validation schemas for authentication
// ================================================================
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerStudentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  matricNumber: z.string().min(5, 'Invalid matric number'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  department: z.string().min(2, 'Department is required'),
});
