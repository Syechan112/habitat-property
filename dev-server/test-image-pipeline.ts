import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import db from './db';

async function testImageResizePipeline() {
  console.log('--- TESTING FASE 7: LOCAL IMAGE UPLOAD & RESIZE PIPELINE ---');

  // 1. Generate a large high-resolution mock image (3000 x 2000 px) in memory
  console.log('1. Menyiapkan gambar uji resolusi tinggi (3000 x 2000 px)...');
  const largeBuffer = await sharp({
    create: {
      width: 3000,
      height: 2000,
      channels: 3,
      background: { r: 15, g: 30, b: 60 },
    },
  })
    .composite([
      {
        input: Buffer.from(`
          <svg width="3000" height="2000">
            <rect width="3000" height="2000" fill="none" stroke="#00e5ff" stroke-width="40" />
            <text x="1500" y="900" font-size="140" fill="#ffffff" text-anchor="middle" font-family="sans-serif" font-weight="bold">HABITAT RESIDENCES</text>
            <text x="1500" y="1100" font-size="80" fill="#00e5ff" text-anchor="middle" font-family="sans-serif">High Resolution Architectural Blueprint 3000x2000</text>
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  const originalSize = largeBuffer.length;
  console.log(`   Ukuran buffer gambar mentah: ${(originalSize / 1024).toFixed(1)} KB`);

  // 2. Simulasi pipeline resizing server
  console.log('2. Menjalankan pipeline resizing Sharp...');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const mainFilename = `prop-test-${timestamp}.webp`;
  const thumbFilename = `thumb-test-${timestamp}.webp`;

  const mainPath = path.join(uploadDir, mainFilename);
  const thumbPath = path.join(uploadDir, thumbFilename);

  // Resize Main (max 1600x1600, WebP quality 82)
  const mainMeta = await sharp(largeBuffer)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(mainPath);

  // Resize Thumbnail (600x400 cover, WebP quality 78)
  const thumbMeta = await sharp(largeBuffer)
    .resize({ width: 600, height: 400, fit: 'cover', position: 'center' })
    .webp({ quality: 78, effort: 3 })
    .toFile(thumbPath);

  const savedPercent = Math.round((1 - mainMeta.size / originalSize) * 100);

  console.log('   Hasil Resizing Gambar Utama:');
  console.log(`   - File: ${mainFilename}`);
  console.log(`   - Dimensi: ${mainMeta.width} x ${mainMeta.height} px (Diresize dari 3000 x 2000)`);
  console.log(`   - Format: WebP`);
  console.log(`   - Ukuran Baru: ${(mainMeta.size / 1024).toFixed(1)} KB`);
  console.log(`   - Efisiensi Penghematan: ${savedPercent}% lebih ringan!`);

  console.log('   Hasil Pembuatan Thumbnail:');
  console.log(`   - File: ${thumbFilename}`);
  console.log(`   - Dimensi: ${thumbMeta.width} x ${thumbMeta.height} px`);
  console.log(`   - Ukuran: ${(thumbMeta.size / 1024).toFixed(1)} KB`);

  // 3. Simpan metadata ke database SQLite
  console.log('3. Mencatat metadata gambar ke database SQLite (dev.db)...');
  const insertStmt = db.prepare(`
    INSERT INTO images (property_id, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    1, // Mock property ID 1
    `/uploads/${mainFilename}`,
    `/uploads/${thumbFilename}`,
    'mock-villa-blueprint.png',
    'image/webp',
    mainMeta.size,
    mainMeta.width,
    mainMeta.height
  );

  const insertedId = result.lastInsertRowid;
  console.log(`   Record berhasil dicatat ke tabel images dengan ID: ${insertedId}`);

  // 4. Verifikasi query dari database SQLite
  console.log('4. Membaca kembali data dari SQLite...');
  const savedRow = db.prepare('SELECT * FROM images WHERE id = ?').get(insertedId) as any;
  console.log('   Data tersimpan di SQLite:', {
    id: savedRow.id,
    file_path: savedRow.file_path,
    thumbnail_path: savedRow.thumbnail_path,
    mime_type: savedRow.mime_type,
    width: savedRow.width,
    height: savedRow.height,
    size_bytes: savedRow.size_bytes,
  });

  console.log('--- SEMUA PENGUJIAN LOKAL FASE 7 BERHASIL 100% ---');
}

testImageResizePipeline().catch((err) => {
  console.error('Test gagal:', err);
  process.exit(1);
});
