import { NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises';
import sharp from 'sharp';
import { getOperatorSession } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = [
  'regions',
  'activities',
  'accommodation',
  'operators',
  'itineraries',
  'events',
  'ads',
];

export async function POST(request: Request) {
  try {
    // Auth check — only operators and admins can upload
    const session = await getOperatorSession();
    const adminToken = request.headers.get("cookie")?.includes("admin_token");
    if (!session && !adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const contentType = formData.get('contentType') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!contentType) {
      return NextResponse.json(
        { error: 'No contentType provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FOLDERS.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid contentType. Allowed values: ' + ALLOWED_FOLDERS.join(', ') },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp
    // Auto-resize to max 1920px width
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata) {
       return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    // Prepare directory
    const uploadDir = path.join(process.cwd(), 'public', 'images', contentType);
    await mkdir(uploadDir, { recursive: true });

    // Generate filename
    // Using timestamp + sanitized original name to avoid collisions
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${safeName}`;
    const filepath = path.join(uploadDir, filename);

    // Resize and save
    const info = await image
      .resize({ width: 1920, withoutEnlargement: true })
      .toFile(filepath);

    const url = `/images/${contentType}/${filename}`;

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
