// ================================================================
// FILE: src/app/api/upload/route.ts
// PURPOSE: Upload document to Cloudinary
// ================================================================
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';
import { uploadDocumentToCloudinary } from '@/lib/cloudinary/upload-document';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const url = await uploadDocumentToCloudinary(file);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
