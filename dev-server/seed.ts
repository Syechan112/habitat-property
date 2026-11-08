import db from './db';
import bcrypt from 'bcryptjs';

const seed = async () => {
  // Remove existing data (cascade)
  db.exec('DELETE FROM images');
  db.exec('DELETE FROM properties');
  db.exec('DELETE FROM users');

  // Insert users
  const buyerHash = await bcrypt.hash('buyer123', 10);
  const sellerHash = await bcrypt.hash('seller123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const insertUser = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
  insertUser.run('buyer@habitat.test', buyerHash, 'buyer');
  const seller = insertUser.run('seller@habitat.test', sellerHash, 'seller');
  insertUser.run('admin@habitat.test', adminHash, 'admin');
  const sellerId = Number(seller.lastInsertRowid);

  // Insert sample properties
  const insertProperty = db.prepare(`
    INSERT INTO properties (id, title, description, price, location, city, property_type, bedrooms, bathrooms, area_sqft, seller_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProperty.run(1, 'Modern Villa in BSD', 'Stunning modern villa with private pool', 1500000000, 'BSD City', 'Tangerang Selatan', 'villa', 4, 3, 450, sellerId, 'available');
  insertProperty.run(2, 'Cozy Apartment in SCBD', 'Luxury apartment with city view', 3500000000, 'SCBD', 'Jakarta Selatan', 'apartment', 2, 1, 80, sellerId, 'available');
  insertProperty.run(3, 'Spacious House in Bekasi', 'Family-friendly house with garden', 850000000, 'Bekasi', 'Bekasi', 'house', 3, 2, 120, sellerId, 'pending');

  // Insert images
  const insertImage = db.prepare('INSERT INTO images (property_id, file_path) VALUES (?, ?)');
  insertImage.run(1, '/properties/villa-1.svg');
  insertImage.run(1, '/properties/villa-2.svg');
  insertImage.run(2, '/properties/apartment-1.svg');

  console.log('Seed data inserted successfully.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});