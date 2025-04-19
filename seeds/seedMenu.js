const mongoose = require('mongoose');
const { Menu, TitleDescribe } = require('../models/Menu');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'your_mongodb_connection_string_here';

const sampleMenuItems = [
  { name: 'Espresso', price: 150, image: 'images/espresso.jpg', featured: true },
  { name: 'Cappuccino', price: 200, image: 'images/cappuccino.jpg', featured: true },
  { name: 'Latte', price: 180, image: 'images/latte.jpg', featured: false },
];

const sampleTitleDescribe = {
  title: 'Our Coffee Menu',
  description: 'Enjoy our selection of freshly brewed coffee and beverages.',
};

async function seedMenu() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Menu.deleteMany({});
    await TitleDescribe.deleteMany({});

    // Insert sample data
    await Menu.insertMany(sampleMenuItems);
    await TitleDescribe.create(sampleTitleDescribe);

    console.log('Menu data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding menu data:', error);
    process.exit(1);
  }
}

seedMenu();
