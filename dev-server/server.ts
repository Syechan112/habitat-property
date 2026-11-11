import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import db from './db';

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_jwt_habitat_properties_key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads and demo properties
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use('/properties', express.static(path.join(process.cwd(), 'public', 'properties')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

type DecodedToken = { id: number; email: string; role: string };

function optionalAuth(req: any, _res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.slice(7), JWT_SECRET) as DecodedToken;
    } catch {
      req.user = undefined;
    }
  }
  next();
}

function auth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Memory storage for multer so sharp can resize in-memory before disk write
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, PNG, WebP) yang diizinkan'));
    }
  },
});

// Image resizing pipeline with Sharp
interface ProcessedImageResult {
  url: string;
  thumbnailUrl: string;
  filename: string;
  thumbnailFilename: string;
  width: number;
  height: number;
  sizeBytes: number;
  originalSize: number;
  originalName: string;
  mimeType: string;
  savedPercent: number;
}

async function processAndSaveImage(
  buffer: Buffer,
  originalName: string,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<ProcessedImageResult> {
  const maxWidth = options?.maxWidth ?? 1600;
  const maxHeight = options?.maxHeight ?? 1600;
  const quality = options?.quality ?? 82;

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `prop-${uniqueSuffix}.webp`;
  const thumbnailFilename = `thumb-${uniqueSuffix}.webp`;

  const mainFilePath = path.join(uploadDir, filename);
  const thumbFilePath = path.join(uploadDir, thumbnailFilename);

  // 1. Process Main Display Image (Optimized & Resized WebP)
  const mainSharp = sharp(buffer)
    .rotate() // Auto-orient using EXIF
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 4 });

  const mainInfo = await mainSharp.toFile(mainFilePath);

  // 2. Process High-Speed Bento/Card Thumbnail (600x400 cover)
  await sharp(buffer)
    .rotate()
    .resize({
      width: 600,
      height: 400,
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 78, effort: 3 })
    .toFile(thumbFilePath);

  const originalSize = buffer.length;
  const savedPercent = Math.max(0, Math.round((1 - mainInfo.size / originalSize) * 100));

  return {
    url: `/uploads/${filename}`,
    thumbnailUrl: `/uploads/${thumbnailFilename}`,
    filename,
    thumbnailFilename,
    width: mainInfo.width,
    height: mainInfo.height,
    sizeBytes: mainInfo.size,
    originalSize,
    originalName,
    mimeType: 'image/webp',
    savedPercent,
  };
}

// ----------------- AUTH ENDPOINTS -----------------
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Missing required fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, hashed, role);
    const token = jwt.sign({ id: Number(result.lastInsertRowid), email, role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: Number(result.lastInsertRowid), email, role } });
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing required fields' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// ----------------- PROPERTY ENDPOINTS -----------------
app.get('/api/properties', optionalAuth, (req, res) => {
  const query = buildPropertyQuery(req.query, req.user);
  const params = query.params;
  let rows = db.prepare(query.sql).all(...params) as any[];
  rows = rows.map((property) => ({
    ...property,
    propertyType: property.property_type,
    areaSqft: property.area_sqft,
    images: db.prepare('SELECT file_path AS url, thumbnail_path AS thumbnailUrl, file_path AS publicId, width, height, size_bytes AS sizeBytes FROM images WHERE property_id = ?').all(property.id),
  }));
  res.json(rows);
});

app.get('/api/properties/my', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = db.prepare(`SELECT p.*, u.email AS seller_email FROM properties p JOIN users u ON p.seller_id = u.id WHERE p.seller_id = ? ORDER BY p.created_at DESC`).all(req.user.id) as any[];
  return res.json(rows.map((r) => ({
    ...r,
    propertyType: r.property_type,
    areaSqft: r.area_sqft,
    images: db.prepare('SELECT file_path AS url, thumbnail_path AS thumbnailUrl, file_path AS publicId, width, height, size_bytes AS sizeBytes FROM images WHERE property_id = ?').all(r.id),
  })));
});

app.get('/api/properties/:id', optionalAuth, (req, res) => {
  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(Number(req.params.id)) as any;
  if (!property) return res.status(404).json({ error: 'Not found' });

  // Properti pending / non-available hanya boleh dilihat oleh admin atau seller pemiliknya
  const isAvailable = property.status === 'available';
  const isAdmin = req.user?.role === 'admin';
  const isOwnerSeller = req.user && req.user.id === property.seller_id;

  if (!isAvailable && !isAdmin && !isOwnerSeller) {
    return res.status(404).json({ error: 'Properti ini masih dalam status kurasi (pending) dan belum dipublikasikan.' });
  }

  const seller = db.prepare('SELECT id, email, phone, role FROM users WHERE id = ?').get(property.seller_id) as any;
  const images = db.prepare('SELECT file_path AS url, thumbnail_path AS thumbnailUrl, file_path AS publicId, width, height, size_bytes AS sizeBytes FROM images WHERE property_id = ?').all(property.id);
  return res.json({ property: { ...property, propertyType: property.property_type, areaSqft: property.area_sqft }, seller, images });
});

app.post('/api/properties', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, images } = req.body;
  const info = db.prepare(`INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area_sqft, seller_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`).run(title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, req.user.id);
  const propertyId = Number(info.lastInsertRowid);

  if (Array.isArray(images) && images.length > 0) {
    const insertImage = db.prepare(`
      INSERT INTO images (property_id, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const updateImage = db.prepare('UPDATE images SET property_id = ? WHERE file_path = ?');

    for (const img of images) {
      const filePath = typeof img === 'string' ? img : img.url;
      const thumbPath = typeof img === 'object' && img.thumbnailUrl ? img.thumbnailUrl : null;
      const originalName = typeof img === 'object' && img.originalName ? img.originalName : null;
      const mimeType = typeof img === 'object' && img.mimeType ? img.mimeType : 'image/webp';
      const sizeBytes = typeof img === 'object' && img.sizeBytes ? img.sizeBytes : null;
      const width = typeof img === 'object' && img.width ? img.width : null;
      const height = typeof img === 'object' && img.height ? img.height : null;

      // Update existing record if uploaded via /api/upload previously
      const existing = db.prepare('SELECT id FROM images WHERE file_path = ?').get(filePath);
      if (existing) {
        updateImage.run(propertyId, filePath);
      } else {
        insertImage.run(propertyId, filePath, thumbPath, originalName, mimeType, sizeBytes, width, height);
      }
    }
  }

  return res.json({ id: propertyId, success: true });
});

app.patch('/api/properties/:id/status', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya Admin yang berwenang mengubah atau menyetujui status listing.' });
  }
  const property = db.prepare('SELECT id FROM properties WHERE id = ?').get(Number(req.params.id));
  if (!property) return res.status(404).json({ error: 'Not found' });
  const { status } = req.body;
  if (!['draft', 'pending', 'available', 'reserved', 'sold', 'rejected', 'archived'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE properties SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, Number(req.params.id));
  return res.json({ ok: true });
});

app.delete('/api/properties/:id', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const propertyId = Number(req.params.id);
  const property = req.user.role === 'admin'
    ? db.prepare('SELECT id FROM properties WHERE id = ?').get(propertyId)
    : db.prepare('SELECT id FROM properties WHERE id = ? AND seller_id = ?').get(propertyId, req.user.id);
  if (!property) return res.status(404).json({ error: 'Not found' });

  // Clean up physical image files from disk
  const images = db.prepare('SELECT file_path, thumbnail_path FROM images WHERE property_id = ?').all(propertyId) as any[];
  for (const img of images) {
    if (img.file_path && img.file_path.startsWith('/uploads/')) {
      const p = path.join(process.cwd(), 'public', img.file_path);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch {}
      }
    }
    if (img.thumbnail_path && img.thumbnail_path.startsWith('/uploads/')) {
      const tp = path.join(process.cwd(), 'public', img.thumbnail_path);
      if (fs.existsSync(tp)) {
        try { fs.unlinkSync(tp); } catch {}
      }
    }
  }

  db.prepare('DELETE FROM properties WHERE id = ?').run(propertyId);
  return res.json({ ok: true });
});

// ----------------- IMAGE RESIZING & UPLOAD ENDPOINTS (PHASE 7) -----------------

// Single Image Upload with Auto-Resize & WebP Conversion
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah' });

    const maxWidth = req.body.maxWidth ? Number(req.body.maxWidth) : 1600;
    const maxHeight = req.body.maxHeight ? Number(req.body.maxHeight) : 1600;
    const quality = req.body.quality ? Number(req.body.quality) : 82;

    const result = await processAndSaveImage(req.file.buffer, req.file.originalname, { maxWidth, maxHeight, quality });

    // Store in SQLite database
    const row = db.prepare(`
      INSERT INTO images (property_id, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      null,
      result.url,
      result.thumbnailUrl,
      result.originalName,
      result.mimeType,
      result.sizeBytes,
      result.width,
      result.height
    );

    return res.json({
      id: Number(row.lastInsertRowid),
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      publicId: result.filename,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
      originalSize: result.originalSize,
      originalName: result.originalName,
      savedPercent: result.savedPercent,
      format: 'webp',
    });
  } catch (err: any) {
    console.error('Upload processing error:', err);
    return res.status(500).json({ error: err.message ?? 'Gagal memproses dan me-resize gambar' });
  }
});

// Multiple Images Upload with Batch Resizing
app.post('/api/upload/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah' });

    const results = [];
    for (const file of files) {
      const processed = await processAndSaveImage(file.buffer, file.originalname);
      const row = db.prepare(`
        INSERT INTO images (property_id, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        null,
        processed.url,
        processed.thumbnailUrl,
        processed.originalName,
        processed.mimeType,
        processed.sizeBytes,
        processed.width,
        processed.height
      );

      results.push({
        id: Number(row.lastInsertRowid),
        url: processed.url,
        thumbnailUrl: processed.thumbnailUrl,
        publicId: processed.filename,
        width: processed.width,
        height: processed.height,
        sizeBytes: processed.sizeBytes,
        originalSize: processed.originalSize,
        originalName: processed.originalName,
        savedPercent: processed.savedPercent,
        format: 'webp',
      });
    }

    return res.json({ images: results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Gagal memproses batch gambar' });
  }
});

// Delete uploaded image & remove from SQLite
app.delete('/api/upload/:filename', auth, (req, res) => {
  const filename = path.basename(req.params.filename);
  const targetPath = path.join(uploadDir, filename);
  const thumbPath = path.join(uploadDir, filename.replace('prop-', 'thumb-'));

  if (fs.existsSync(targetPath)) {
    try { fs.unlinkSync(targetPath); } catch {}
  }
  if (fs.existsSync(thumbPath)) {
    try { fs.unlinkSync(thumbPath); } catch {}
  }

  db.prepare('DELETE FROM images WHERE file_path LIKE ?').run(`%${filename}%`);
  return res.json({ ok: true, deleted: filename });
});

// List all uploaded images stored in SQLite database
app.get('/api/images', optionalAuth, (_req, res) => {
  const rows = db.prepare('SELECT * FROM images ORDER BY uploaded_at DESC LIMIT 50').all();
  return res.json(rows);
});

// ----------------- FAVORITES & INQUIRIES & USERS -----------------
app.post('/api/favorites', auth, (req, res) => {
  try {
    db.prepare('INSERT INTO favorites (user_id, property_id) VALUES (?, ?)').run(req.user.id, req.body.propertyId);
    return res.json({ ok: true });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT') return res.status(409).json({ error: 'Already saved' });
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/favorites/:propertyId', auth, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE user_id = ? AND property_id = ?').run(req.user.id, Number(req.params.propertyId));
  return res.json({ ok: true });
});

app.get('/api/favorites', auth, (req, res) => {
  const ids = db.prepare('SELECT property_id FROM favorites WHERE user_id = ?').all(req.user.id) as Array<{ property_id: number }>;
  return res.json(ids.map((x) => x.property_id));
});

app.post('/api/inquiries', auth, (req, res) => {
  const { propertyId, message, phone, viewingDate, viewingTime } = req.body;
  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId) as any;
  if (!property) return res.status(404).json({ error: 'Property not found' });
  const row = db.prepare('INSERT INTO inquiries (property_id, buyer_id, message, phone, viewing_date, viewing_time) VALUES (?, ?, ?, ?, ?, ?)').run(propertyId, req.user.id, message, phone, viewingDate, viewingTime);
  return res.json({ id: Number(row.lastInsertRowid), ok: true });
});

app.get('/api/inquiries', auth, (req, res) => {
  if (req.user.role === 'buyer') {
    return res.json(db.prepare("SELECT i.*, p.title, s.email AS seller_email, u.phone AS buyer_phone FROM inquiries i JOIN properties p ON i.property_id = p.id LEFT JOIN users s ON p.seller_id = s.id LEFT JOIN users u ON i.buyer_id = u.id WHERE i.buyer_id = ?").all(req.user.id));
  }
  if (req.user.role === 'seller') {
    return res.json(db.prepare("SELECT i.*, p.title, b.email AS buyer_email FROM inquiries i JOIN properties p ON i.property_id = p.id JOIN users b ON i.buyer_id = b.id WHERE p.seller_id = ? ORDER BY i.created_at DESC").all(req.user.id));
  }
  return res.json(db.prepare("SELECT i.*, p.title, s.email AS seller_email, b.email AS buyer_email FROM inquiries i JOIN properties p ON i.property_id = p.id JOIN users s ON p.seller_id = s.id JOIN users b ON i.buyer_id = b.id ORDER BY i.created_at DESC").all());
});

app.patch('/api/inquiries/:id/status', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  db.prepare('UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.body.status, Number(req.params.id));
  return res.json({ ok: true });
});

app.get('/api/users', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = db.prepare('SELECT id, email, role, phone, created_at FROM users ORDER BY created_at DESC').all() as any[];
  return res.json(rows);
});

app.delete('/api/users/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const userId = Number(req.params.id);
  if (userId === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  return res.json({ ok: true });
});

function buildPropertyQuery(query: any, user?: DecodedToken) {
  let sql = `
    SELECT p.*, u.email AS seller_email
    FROM properties p
    JOIN users u ON p.seller_id = u.id
    WHERE 1 = 1
  `;
  const params: Array<string | number> = [];

  // Proteksi kurasi: Hanya admin yang boleh melihat properti berstatus 'pending',
  // 'rejected', 'draft', dsb. di endpoint publik.
  // Untuk Buyer dan Pengunjung Publik: WAJIB hanya status 'available'!
  if (user?.role === 'admin') {
    if (query.status) {
      params.push(query.status);
      sql += ' AND p.status = ?';
    }
  } else {
    params.push('available');
    sql += ' AND p.status = ?';
  }

  if (query.search) {
    params.push(`%${query.search}%`);
    sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ? OR p.city LIKE ?)';
    params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }
  if (query.city) { params.push(query.city); sql += ' AND LOWER(p.city) = LOWER(?)'; }
  if (query.type) { params.push(query.type); sql += ' AND LOWER(p.property_type) = LOWER(?)'; }
  if (typeof query.minPrice === 'number') { params.push(query.minPrice); sql += ' AND p.price >= ?'; }
  if (typeof query.maxPrice === 'number') { params.push(query.maxPrice); sql += ' AND p.price <= ?'; }
  if (query.sortBy === 'price_desc') sql += ' ORDER BY p.price DESC';
  else if (query.sortBy === 'price_asc') sql += ' ORDER BY p.price ASC';
  else sql += ' ORDER BY p.created_at DESC';

  return { sql, params };
}

app.listen(port, () => console.log(`Development SQLite API running on http://localhost:${port}`));
