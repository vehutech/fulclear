
// ================================================================
// FILE: src/lib/validation/clearance-schemas.ts
// PURPOSE: Zod validation schemas for clearances
// ================================================================
import { z } from 'zod';

export const initiateClearanceSchema = z.object({
  officialType: z.string().min(1, 'Official type is required'),
  documents: z.array(z.string().url()).min(1, 'At least one document is required'),
});

export const updateClearanceSchema = z.object({
  clearanceId: z.string().uuid('Invalid clearance ID'),
  status: z.enum(['cleared', 'rejected']),
  issueDescription: z.string().optional(),
});