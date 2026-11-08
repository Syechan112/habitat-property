import db from './db';
import bcrypt from 'bcryptjs';

const seed = async () => {
  // Insert a buyer, seller, and admin user
  const buyerHash = await bcrypt.hash('buyer123', 10);
  const sellerHash = await bcrypt.hash('seller123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)');
  insertUser.run('buyer@habitat.test', buyerHash, 'buyer');
  insertUser.run('seller@habitat.test', sellerHash, 'seller');
  insertUser.run('admin@habitat.test', adminHash, 'admin');

  // Insert sample properties
  const insertProperty = db.prepare(`
    INSERT OR IGNORE INTO properties (id, title, description, price, location, city, property_type, bedrooms, bathrooms, area_sqft, seller_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProperty.run(1, 'Modern Villa in BSD', 'Stunning modern villa with private pool', 1500000000, 'BSD City', 'Tangerang Selatan', 'villa', 4, 3, 450, 2, 'available');
  insertProperty.run(2, 'Cozy Apartment in SCBD', 'Luxury apartment with city view', 3500000000, 'SCBD', 'Jakarta Selatan', 'apartment', 2, 1, 80, 2, 'available');
  insertProperty.run(3, 'Spacious House in Bekasi', 'Family-friendly house with garden', 850000000, 'Bekasi', 'Bekasi', 'house', 3, 2, 120, 2, 'pending');

  // Insert images
  const insertImage = db.prepare('INSERT OR IGNORE INTO images (id, property_id, file_path) VALUES (?, ?, ?)');
  insertImage.run(1, 1, '/uploads/villa-1.jpg');
  insertImage.run(2, 1, '/uploads/villa-2.jpg');
  insertImage.run(3, 2, '/uploads/apartment-1.jpg');

  console.log('Seed data inserted successfully.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});