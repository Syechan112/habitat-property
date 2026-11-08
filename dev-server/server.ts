import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db';

const app = express();
const port = 3001;
const JWT_SECRET = 'dev_secret_jwt_habitat_properties_key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for Vite frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Origin, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve public static folder for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Image Upload Configuration
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Auth Routes (Mimics basic Supabase response)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const insert = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = insert.run(email, hashedPassword, role);

    const token = jwt.sign({ id: result.lastInsertRowid, email, role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: result.lastInsertRowid, email, role },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    publicId: req.file.filename,
  });
});

// Properties Routes
app.get('/api/properties', (req, res) => {
  const { status, sellerId } = req.query;
  let query = 'SELECT * FROM properties WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (sellerId) {
    query += ' AND seller_id = ?';
    params.push(sellerId);
  }

  const properties = db.prepare(query).all(...params) as any[];

  // Attach images
  const propertiesWithImages = properties.map((prop) => {
    const images = db.prepare('SELECT * FROM images WHERE property_id = ?').all(prop.id) as any[];
    return {
      ...prop,
      images: images.map((img) => ({ url: img.file_path, publicId: img.file_path })),
    };
  });

  res.json(propertiesWithImages);
});

app.post('/api/properties', (req, res) => {
  const { title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, sellerId, images } = req.body;
  
  const insert = db.prepare(`
    INSERT INTO properties (title, description, price, location, city, property_type, bedrooms, bathrooms, area_sqft, seller_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `);

  try {
    const info = insert.run(title, description, price, location, city, propertyType, bedrooms, bathrooms, areaSqft, sellerId);
    const propertyId = info.lastInsertRowid;

    if (Array.isArray(images)) {
      const insertImage = db.prepare('INSERT INTO images (property_id, file_path) VALUES (?, ?)');
      for (const img of images) {
        insertImage.run(propertyId, typeof img === 'string' ? img : img.url);
      }
    }

    res.json({ id: propertyId, success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start dev server
app.listen(port, () => {
  console.log(`Development SQLite API running on http://localhost:${port}`);
});
