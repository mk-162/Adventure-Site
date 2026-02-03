import sharp from 'sharp';

async function testUpload() {
  console.log('Creating dummy image...');
  // 1. Create a dummy image
  const imageBuffer = await sharp({
    create: {
      width: 2000, // Test resizing (should become 1920)
      height: 1000,
      channels: 3,
      background: { r: 255, g: 0, b: 0 }
    }
  })
  .jpeg()
  .toBuffer();

  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
  formData.append('file', blob, 'test-image.jpg');
  formData.append('contentType', 'regions');

  console.log('Uploading image to http://localhost:3000/api/upload ...');
  try {
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} ${text}`);
    }

    const result = await response.json();
    console.log('Upload success:', result);

    if (result.width !== 1920) {
        console.error('Resize check failed: width is', result.width);
        process.exit(1);
    }
     if (!result.url.startsWith('/images/regions/')) {
        console.error('URL check failed:', result.url);
        process.exit(1);
    }
    
    console.log('Verification passed!');

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testUpload();
