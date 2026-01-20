// FILE: src/lib/types/clearance-types.ts
// PURPOSE: TypeScript type definitions for clearances
// ================================================================
import type { OfficialType } from './user-types';

export type ClearanceStatus = 'pending' | 'initiated' | 'cleared' | 'rejected';

export interface Clearance {
  id: string;
  studentId: string;
  officialType: OfficialType;
  status: ClearanceStatus;
  documents?: string[];
  issueDescription?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClearanceWithStudentInfo extends Clearance {
  fullName: string;
  matricNumber: string;
  department: string;
  phoneNumber: string;
}