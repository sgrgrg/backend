const mongoose = require('mongoose');
const Review = require('../models/Review');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'your_mongodb_connection_string_here';

const sampleReviews = [
  {
    name: 'John Doe',
    rating: 5,
    comment: 'Excellent coffee and cozy atmosphere!',
    image: 'images/john.jpg',
    isFeatured: true,
  },
  {
    name: 'Jane Smith',
    rating: 4,
    comment: 'Great service and delicious pastries.',
    image: 'images/jane.jpg',
    isFeatured: false,
  },
];

async function seedReviews() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Review.deleteMany({});

    // Insert sample data
    await Review.insertMany(sampleReviews);

    console.log('Review data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding review data:', error);
    process.exit(1);
  }
}

seedReviews();
