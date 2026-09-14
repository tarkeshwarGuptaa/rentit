import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import User from '../models/User.js';
import Room from '../models/Room.js';

// ─── IIT Delhi center coordinates ────────────────────────────────
const COLLEGE_LAT = 28.5459;
const COLLEGE_LNG = 77.1926;

// Small random offset for room locations
const randomOffset = () => (Math.random() - 0.5) * 0.02;

// ─── Landlord Data ───────────────────────────────────────────────
const landlords = [
  { name: 'Rajesh Sharma', email: 'rajesh@example.com', password: 'password123', phone: '9876543210', role: 'landlord' },
  { name: 'Priya Gupta', email: 'priya@example.com', password: 'password123', phone: '9876543211', role: 'landlord' },
  { name: 'Amit Verma', email: 'amit@example.com', password: 'password123', phone: '9876543212', role: 'landlord' },
  { name: 'Sunita Devi', email: 'sunita@example.com', password: 'password123', phone: '9876543213', role: 'landlord' },
  { name: 'Vikram Singh', email: 'vikram@example.com', password: 'password123', phone: '9876543214', role: 'landlord' },
];

// ─── Student (for testing) ───────────────────────────────────────
const students = [
  { name: 'Arjun Kumar', email: 'arjun@example.com', password: 'password123', phone: '9812345678', role: 'student' },
];

// ─── Room Photos (placeholder URLs) ─────────────────────────────
const photoSets = [
  [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ],
  [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  ],
  [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
  ],
  [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
  ],
  [
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    'https://images.unsplash.com/photo-1560185008-b033106af5c8?w=800',
    'https://images.unsplash.com/photo-1585128792020-803d29415281?w=800',
  ],
];

// ─── Room Listings ───────────────────────────────────────────────
const createRooms = (landlordIds) => [
  {
    title: 'Cozy Single Room near IIT Gate',
    description: 'A well-furnished single room with attached bathroom, just 5 minutes walk from IIT Delhi main gate. Perfect for students who value peace and quiet. The room gets excellent natural light and has a study desk setup.',
    rent: 8000,
    address: '45, Ber Sarai Main Road, near IIT Delhi Gate',
    area: 'Ber Sarai',
    roomType: 'single',
    amenities: ['WiFi', 'Attached Bathroom', 'Geyser'],
    photos: photoSets[0],
    location: { lat: COLLEGE_LAT + 0.005, lng: COLLEGE_LNG - 0.003 },
    landlord: landlordIds[0],
  },
  {
    title: 'Affordable Shared Room for Students',
    description: 'Spacious shared room for two students with separate beds and study tables. Located in a quiet lane off the main road. Common kitchen available. Very friendly neighborhood with many students.',
    rent: 4500,
    address: '12, Katwaria Sarai Lane 3, South Delhi',
    area: 'Katwaria Sarai',
    roomType: 'shared',
    amenities: ['WiFi', 'Food', 'Laundry'],
    photos: photoSets[1],
    location: { lat: COLLEGE_LAT - 0.004, lng: COLLEGE_LNG + 0.002 },
    landlord: landlordIds[1],
  },
  {
    title: 'Modern 1BHK with AC and Parking',
    description: 'Fully furnished 1BHK apartment with split AC, modular kitchen, and dedicated parking space. Ideal for working professionals or senior students. 24/7 water supply and power backup available.',
    rent: 15000,
    address: '78, Hauz Khas Village, near Deer Park',
    area: 'Hauz Khas',
    roomType: '1BHK',
    amenities: ['WiFi', 'AC', 'Parking', 'Attached Bathroom', 'Geyser'],
    photos: photoSets[2],
    location: { lat: COLLEGE_LAT + 0.008, lng: COLLEGE_LNG + 0.006 },
    landlord: landlordIds[2],
  },
  {
    title: 'Budget-Friendly Room in Munirka',
    description: 'Simple but clean single room with basic amenities. Walking distance to JNU and IIT. Landlord provides home-cooked meals (veg). Water and electricity included in rent. Best value near campus.',
    rent: 5000,
    address: '23, Munirka Village, DDA Flats Block C',
    area: 'Munirka',
    roomType: 'single',
    amenities: ['WiFi', 'Food', 'Geyser'],
    photos: photoSets[3],
    location: { lat: COLLEGE_LAT - 0.006, lng: COLLEGE_LNG - 0.004 },
    landlord: landlordIds[3],
  },
  {
    title: 'Premium 2BHK in Safdarjung Enclave',
    description: 'Beautifully renovated 2BHK flat with wooden flooring, modern kitchen, two bathrooms with geysers, and a spacious balcony. Great for two students sharing or a small family. Excellent connectivity.',
    rent: 25000,
    address: '56, Safdarjung Enclave, A-Block',
    area: 'Safdarjung',
    roomType: '2BHK',
    amenities: ['WiFi', 'AC', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'],
    photos: photoSets[4],
    location: { lat: COLLEGE_LAT + 0.003, lng: COLLEGE_LNG + 0.009 },
    landlord: landlordIds[4],
  },
  {
    title: 'Sharing Room with Food - Girls Only',
    description: 'Clean and safe shared room for female students. Home-cooked vegetarian meals included (breakfast and dinner). Strict timing rules. Very close to metro station. Landlady stays on premises.',
    rent: 6000,
    address: '34, Ber Sarai, B-Block, near Mother Dairy',
    area: 'Ber Sarai',
    roomType: 'shared',
    amenities: ['WiFi', 'Food', 'Laundry', 'Geyser'],
    photos: photoSets[0],
    location: { lat: COLLEGE_LAT + 0.006, lng: COLLEGE_LNG - 0.005 },
    landlord: landlordIds[0],
  },
  {
    title: 'Independent 1BHK - Peaceful Location',
    description: 'Independent 1BHK flat on the top floor with terrace access. Fully furnished with bed, wardrobe, study table, and kitchen appliances. Separate electricity meter. No restrictions on entry time.',
    rent: 12000,
    address: '89, Katwaria Sarai Extension, Lane 7',
    area: 'Katwaria Sarai',
    roomType: '1BHK',
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Geyser'],
    photos: photoSets[1],
    location: { lat: COLLEGE_LAT - 0.003, lng: COLLEGE_LNG + 0.004 },
    landlord: landlordIds[1],
  },
  {
    title: 'AC Single Room - 2 Min from Metro',
    description: 'Air-conditioned single room with attached western-style bathroom. Located just 2 minutes walk from Hauz Khas metro station. Furnished with single bed, wardrobe, and study area. Very convenient location.',
    rent: 9500,
    address: '15, Hauz Khas Market, above SBI Bank',
    area: 'Hauz Khas',
    roomType: 'single',
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Geyser'],
    photos: photoSets[2],
    location: { lat: COLLEGE_LAT + 0.007, lng: COLLEGE_LNG + 0.005 },
    landlord: landlordIds[2],
  },
  {
    title: 'PG Room with All Meals Included',
    description: 'Well-maintained PG accommodation with three meals included daily. Room has single bed, study table, and almirah. Shared bathroom (cleaned daily). Wi-Fi and laundry service included. Great community.',
    rent: 7500,
    address: '67, Munirka Vihar, opposite DPS School',
    area: 'Munirka',
    roomType: 'single',
    amenities: ['WiFi', 'Food', 'Laundry'],
    photos: photoSets[3],
    location: { lat: COLLEGE_LAT - 0.005, lng: COLLEGE_LNG - 0.002 },
    landlord: landlordIds[3],
  },
  {
    title: 'Luxury 2BHK with Park View',
    description: 'Spacious luxury 2BHK with park-facing balcony, Italian marble flooring, modular kitchen with chimney, and two AC units. Gated society with 24/7 security and CCTV. Underground parking included.',
    rent: 30000,
    address: '102, Safdarjung Development Area, C-Wing',
    area: 'Safdarjung',
    roomType: '2BHK',
    amenities: ['WiFi', 'AC', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'],
    photos: photoSets[4],
    location: { lat: COLLEGE_LAT + 0.002, lng: COLLEGE_LNG + 0.010 },
    landlord: landlordIds[4],
  },
  {
    title: 'Furnished Room with Balcony',
    description: 'Bright and airy furnished room with a private balcony. Attached bathroom with hot water. The room includes a comfortable bed, study desk, chair, and bookshelf. Very suitable for serious students.',
    rent: 8500,
    address: '29, Ber Sarai Village, near Vishwavidyalaya Metro',
    area: 'Ber Sarai',
    roomType: 'single',
    amenities: ['WiFi', 'Geyser', 'Attached Bathroom'],
    photos: photoSets[0],
    location: { lat: COLLEGE_LAT + 0.004, lng: COLLEGE_LNG - 0.006 },
    landlord: landlordIds[0],
  },
  {
    title: 'Cheap Shared Room - Boys Only',
    description: 'Budget-friendly shared room for male students in a well-connected area. Two single beds with mattresses, shared bathroom, and small pantry area. Electricity charges extra. Very affordable option.',
    rent: 3500,
    address: '41, Katwaria Sarai, D-Block, Ground Floor',
    area: 'Katwaria Sarai',
    roomType: 'shared',
    amenities: ['WiFi'],
    photos: photoSets[1],
    location: { lat: COLLEGE_LAT - 0.002, lng: COLLEGE_LNG + 0.003 },
    landlord: landlordIds[1],
  },
  {
    title: 'Studio Apartment - Fully Loaded',
    description: 'Modern studio apartment with everything you need. Equipped with mini fridge, microwave, induction cooktop, and washing machine. Smart TV included. High-speed fiber internet. Perfect for independent living.',
    rent: 18000,
    address: '55, Hauz Khas Enclave, Lane 2',
    area: 'Hauz Khas',
    roomType: '1BHK',
    amenities: ['WiFi', 'AC', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'],
    photos: photoSets[2],
    location: { lat: COLLEGE_LAT + 0.009, lng: COLLEGE_LNG + 0.004 },
    landlord: landlordIds[2],
  },
  {
    title: 'Triple Sharing Room with Food',
    description: 'Spacious triple sharing room with three single beds and individual study areas. Home-cooked meals (breakfast and dinner) provided. Common TV room and terrace. Perfect for first-year students.',
    rent: 4000,
    address: '18, Munirka, near Vasant Vihar bus stop',
    area: 'Munirka',
    roomType: 'shared',
    amenities: ['WiFi', 'Food', 'Geyser'],
    photos: photoSets[3],
    location: { lat: COLLEGE_LAT - 0.007, lng: COLLEGE_LNG - 0.003 },
    landlord: landlordIds[3],
  },
  {
    title: 'Spacious 1BHK near Green Park',
    description: 'Well-ventilated 1BHK apartment with separate living room and bedroom. Semi-furnished with basic furniture. Marble flooring throughout. Close to Green Park metro and multiple food joints.',
    rent: 14000,
    address: '73, Safdarjung, near AIIMS flyover',
    area: 'Safdarjung',
    roomType: '1BHK',
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Geyser'],
    photos: photoSets[4],
    location: { lat: COLLEGE_LAT + 0.001, lng: COLLEGE_LNG + 0.008 },
    landlord: landlordIds[4],
  },
];

// ─── Seed Function ───────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    // Create landlords
    const createdLandlords = await User.insertMany(landlords);
    console.log(`Created ${createdLandlords.length} landlords`);

    // Create student
    const createdStudents = await User.insertMany(students);
    console.log(`Created ${createdStudents.length} test students`);

    // Create rooms
    const landlordIds = createdLandlords.map((l) => l._id);
    const rooms = createRooms(landlordIds);
    const createdRooms = await Room.insertMany(rooms);
    console.log(`Created ${createdRooms.length} room listings`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('   Landlord: rajesh@example.com / password123');
    console.log('   Student:  arjun@example.com / password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
