// ================================================================
// FILE: src/lib/types/user-types.ts
// PURPOSE: TypeScript type definitions for users
// ================================================================
export const OFFICIAL_TYPES = [
  'Bursary',
  'Laboratory',
  'Dean of Faculty',
  'Librarian',
  'Health Service',
  'Coordinator Sport Unit',
  'Security Officer',
  'Examination and Records Officer',
  'Alumni and Endowment Unit',
  'Dean of Student Affairs'
] as const;

export type OfficialType = typeof OFFICIAL_TYPES[number];
export type UserRole = 'student' | 'official' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  matricNumber: string;
  phoneNumber: string;
  department: string;
}

export interface OfficialProfile {
  id: string;
  userId: string;
  fullName: string;
  officialType: OfficialType;
}