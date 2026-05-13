import { NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises';
import sharp from 'sharp';
import { getOperatorSession } from '@/lib/auth';
import { verifyAdminToken } from '@/lib/admin-auth';
import {
  uploadFieldsSchema,
  validateUploadFile,
} from '@/lib/api/validate';

export async function POST(request: Request) {
  try {
    // Auth check — only operators and admins can upload
    const operatorSession = await getOperatorSession();
    // Parse admin_token cookie value and verify it as a JWT
    const cookieHeader = request.headers.get("cookie") ?? "";
    const adminTokenMatch = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
    const adminTokenValue = adminTokenMatch ? decodeURIComponent(adminTokenMatch[1]) : null;
    const adminSession = adminTokenValue ? await verifyAdminToken(adminTokenValue) : null;
    if (!operatorSession && !adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawContentType = formData.get('contentType');

    const fieldsParsed = uploadFieldsSchema.safeParse({
      contentType: typeof rawContentType === 'string' ? rawContentType : undefined,
    });
    if (!fieldsParsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: fieldsParsed.error.issues.map(
            (i) => `${i.path.join(".") || "body"}: ${i.message}`
          ),
        },
        { status: 400 }
      );
    }
    const { contentType } = fieldsParsed.data;

    const fileCheck = validateUploadFile(file);
    if (!fileCheck.ok || !file) {
      const message = fileCheck.ok ? "No file provided" : fileCheck.error;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp — resize to max 1920px width
    const processed = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .toBuffer();

    const metadata = await sharp(processed).metadata();

    // Generate filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${contentType}/${timestamp}-${safeName}`;

    // Try Vercel Blob first, fall back to local filesystem
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(filename, processed, {
        access: 'public',
        contentType: file.type,
      });

      return NextResponse.json({
        url: blob.url,
        width: metadata.width,
        height: metadata.height,
      });
    }

    // Fallback: local filesystem
    const uploadDir = path.join(process.cwd(), 'public', 'images', contentType);
    await mkdir(uploadDir, { recursive: true });

    const localFilename = `${timestamp}-${safeName}`;
    const filepath = path.join(uploadDir, localFilename);

    const info = await sharp(processed).toFile(filepath);

    const url = `/images/${contentType}/${localFilename}`;

    return NextResponse.json({
      url,
      width: info.width,
      height: info.height,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
