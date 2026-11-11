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

  insertProperty.run(1, 'Modern Villa in BSD', 'Stunning modern villa with private pool and lush garden', 1500000000, 'BSD City', 'Tangerang Selatan', 'villa', 4, 3, 450, sellerId, 'available');
  insertProperty.run(2, 'Cozy Apartment in SCBD', 'Luxury apartment with panoramic city skyline view', 3500000000, 'SCBD', 'Jakarta Selatan', 'apartment', 2, 1, 80, sellerId, 'available');
  insertProperty.run(3, 'Spacious House in Bekasi', 'Family-friendly residence with private green backyard', 850000000, 'Summarecon Bekasi', 'Bekasi', 'house', 3, 2, 120, sellerId, 'pending');
  insertProperty.run(4, 'Cliffside Tropical Villa', 'Villa tropis kontemporer dengan infinity pool menghadap Samudra Hindia', 7200000000, 'Uluwatu', 'Bali', 'villa', 4, 4, 520, sellerId, 'available');
  insertProperty.run(5, 'Minimalist Dago Mountain Haven', 'Hunian arsitektur brutalist hangat berhawa sejuk di perbukitan Dago Pakar', 2850000000, 'Dago Atas', 'Bandung', 'house', 3, 3, 280, sellerId, 'available');
  insertProperty.run(6, 'Grand Penthouse Graha Famili', 'Penthouse lantai tertinggi dengan fasilitas privat lift dan interior marmer Italia', 5900000000, 'Graha Famili', 'Surabaya', 'apartment', 3, 3, 310, sellerId, 'available');
  insertProperty.run(7, 'Heritage Kaliurang Sanctuary', 'Residensi perpaduan estetika vernakular Jawa dan kenyamanan modern di kaki Merapi', 2400000000, 'Kaliurang', 'Yogyakarta', 'villa', 4, 3, 380, sellerId, 'available');
  insertProperty.run(8, 'Beachfront Oasis Resort Residence', 'Sanctuary tepi pantai privat dengan akses langsung pasir putih dan dermaga mini', 6400000000, 'Senggigi', 'Lombok', 'villa', 3, 3, 420, sellerId, 'available');
  insertProperty.run(9, 'Menteng Executive Residence', 'Estate eksklusif di jantung kawasan prestisius dengan ceiling tinggi dan courtyard asri', 14500000000, 'Kebayoran Baru', 'Jakarta Selatan', 'house', 5, 5, 650, sellerId, 'available');

  // Insert images
  const insertImage = db.prepare('INSERT INTO images (property_id, file_path) VALUES (?, ?)');
  insertImage.run(1, '/properties/villa-1.svg');
  insertImage.run(1, '/properties/villa-2.svg');
  insertImage.run(2, '/properties/apartment-1.svg');
  insertImage.run(4, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80');
  insertImage.run(5, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
  insertImage.run(6, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
  insertImage.run(7, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
  insertImage.run(8, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80');
  insertImage.run(9, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80');

  console.log('Seed data inserted successfully.');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});