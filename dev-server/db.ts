import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database in dev-server folder
const dbPath = path.join(process.cwd(), 'dev-server', 'dev.db');
const db = new Database(dbPath);

// Initialize database schema on first load
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('buyer', 'seller', 'admin')) NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    property_type TEXT CHECK(property_type IN ('house', 'apartment', 'villa', 'land', 'commercial')) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    area_sqft REAL NOT NULL,
    seller_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('draft', 'pending', 'available', 'reserved', 'sold', 'rejected', 'archived')) DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    message TEXT,
    phone TEXT,
    status TEXT CHECK(status IN ('new', 'contacted', 'interested', 'viewing', 'negotiation', 'won', 'lost')) DEFAULT 'new',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY(buyer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    file_path TEXT NOT NULL,
    thumbnail_path TEXT,
    original_name TEXT,
    mime_type TEXT,
    size_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
  );

`);

// Lightweight column migration for existing local databases
const userColumns = db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
if (!userColumns.some((column) => column.name === 'phone')) {
  db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
}

const inquiryColumns = db.prepare('PRAGMA table_info(inquiries)').all() as Array<{ name: string }>;
if (!inquiryColumns.some((column) => column.name === 'viewing_date')) {
  db.exec('ALTER TABLE inquiries ADD COLUMN viewing_date TEXT');
}
if (!inquiryColumns.some((column) => column.name === 'viewing_time')) {
  db.exec('ALTER TABLE inquiries ADD COLUMN viewing_time TEXT');
}

const imageColumns = db.prepare('PRAGMA table_info(images)').all() as Array<{ name: string; notnull: number }>;
if (!imageColumns.some((column) => column.name === 'thumbnail_path')) {
  db.exec('ALTER TABLE images ADD COLUMN thumbnail_path TEXT');
}
if (!imageColumns.some((column) => column.name === 'width')) {
  db.exec('ALTER TABLE images ADD COLUMN width INTEGER');
}
if (!imageColumns.some((column) => column.name === 'height')) {
  db.exec('ALTER TABLE images ADD COLUMN height INTEGER');
}
if (!imageColumns.some((column) => column.name === 'original_name')) {
  db.exec('ALTER TABLE images ADD COLUMN original_name TEXT');
}

const propertyIdCol = imageColumns.find((c) => c.name === 'property_id');
if (propertyIdCol && propertyIdCol.notnull === 1) {
  db.exec(`
    PRAGMA foreign_keys=OFF;
    CREATE TABLE images_temp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      file_path TEXT NOT NULL,
      thumbnail_path TEXT,
      original_name TEXT,
      mime_type TEXT,
      size_bytes INTEGER,
      width INTEGER,
      height INTEGER,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
    );
    INSERT INTO images_temp (id, property_id, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height, uploaded_at)
    SELECT id, CASE WHEN property_id <= 0 THEN NULL ELSE property_id END, file_path, thumbnail_path, original_name, mime_type, size_bytes, width, height, uploaded_at FROM images;
    DROP TABLE images;
    ALTER TABLE images_temp RENAME TO images;
    PRAGMA foreign_keys=ON;
  `);
}

export { db };
export default db;