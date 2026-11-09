import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

type DecodedToken = { id: number; email: string; role: string };

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

app.get('/api/properties', optionalAuth, (req, res) => {
  const query = buildPropertyQuery(req.query, req.user?.role);
  const params = query.params;
  let rows = db.prepare(query.sql).all(...params) as any[];
  rows = rows.map((property) => ({
    ...property,
    propertyType: property.property_type,
    areaSqft: property.area_sqft,
    images: db.prepare('SELECT file_path AS url, file_path AS publicId FROM images WHERE property_id = ?').all(property.id),
  }));
  res.json(rows);
});

app.get('/api/properties/my', optionalAuth, (req, res) => {
  if (!req.user || (req.user.role !== 'seller' && req.user.role !== 'admin')) return res.status(403).json({ error: 'Forbidden' });
  const rows = db.prepare(`SELECT p.*, u.email AS seller_email FROM properties p JOIN users u ON p.seller_id = u.id WHERE p.seller_id = ? ORDER BY p.created_at DESC`).all(req.user.id) as any[];
  return res.json(rows.map((r) => ({ ...r, propertyType: r.property_type, areaSqft: r.area_sqft, images: [] })));
});

app.get('/api/properties/:id', optionalAuth, (req, res) => {
  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(Number(req.params.id)) as any;
  if (!property) return res.status(404).json({ error: 'Not found' });
  const seller = db.prepare('SELECT id, email, phone, role FROM users WHERE id = ?').get(property.seller_id) as any;
  const images = db.prepare('SELECT file_path AS url, file_path AS publicId FROM images WHERE property_id = ?').all(property.id);
  return res.json({ property: { ...property, propertyType: property.property_type, areaSqft: property.area_sqft }, seller, images });
});

app.post('/api/properties', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, images } = req.body;
  const info = db.prepare(`INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area_sqft, seller_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`).run(title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, req.user.id);
  const propertyId = Number(info.lastInsertRowid);
  if (Array.isArray(images)) {
    const insertImage = db.prepare('INSERT INTO images (property_id, file_path) VALUES (?, ?)');
    for (const img of images) insertImage.run(propertyId, typeof img === 'string' ? img : img.url);
  }
  return res.json({ id: propertyId, success: true });
});

app.get('/api/properties/my', auth, (req, res) => {
  if (req.user.role !== 'seller' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const rows = db.prepare(`SELECT p.*, u.email AS seller_email FROM properties p JOIN users u ON p.seller_id = u.id WHERE p.seller_id = ? ORDER BY p.created_at DESC`).all(req.user.id) as any[];
  return res.json(rows.map((r) => ({ ...r, propertyType: r.property_type, areaSqft: r.area_sqft, images: [] })));
});

app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  return res.json({ url: `/uploads/${req.file.filename}`, publicId: req.file.filename });
});

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

function buildPropertyQuery(query: any, role?: string) {
  let sql = `
    SELECT p.*, u.email AS seller_email
    FROM properties p
    JOIN users u ON p.seller_id = u.id
    WHERE 1 = 1
  `;
  const params: Array<string | number> = [];

  if (role === 'buyer') sql += ' AND p.status = "available"';
  else if (query.status) { params.push(query.status); sql += ' AND p.status = ?'; }

  if (query.search) {
    params.push(`%${query.search}%`);
    sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ? OR p.city LIKE ?)';
    params.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }
  if (query.city) { params.push(query.city); sql += ' AND p.city = ?'; }
  if (query.type) { params.push(query.type); sql += ' AND p.property_type = ?'; }
  if (typeof query.minPrice === 'number') { params.push(query.minPrice); sql += ' AND p.price >= ?'; }
  if (typeof query.maxPrice === 'number') { params.push(query.maxPrice); sql += ' AND p.price <= ?'; }
  if (query.sortBy === 'price_desc') sql += ' ORDER BY p.price DESC';
  else if (query.sortBy === 'price_asc') sql += ' ORDER BY p.price ASC';
  else sql += ' ORDER BY p.created_at DESC';

  return { sql, params };
}

app.listen(port, () => console.log(`Development SQLite API running on http://localhost:${port}`));
