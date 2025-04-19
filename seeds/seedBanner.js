const mongoose = require("mongoose");
const Banner = require("../models/Banner");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + '/../.env' });

const seedBanner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove existing banners
    await Banner.deleteMany({});

    // Create a new banner
    const banner = new Banner({
      title: "Welcome to Coffee House",
      description: "Enjoy the best coffee in town with a cozy atmosphere.",
      image: "uploads/default-banner.jpg", // Placeholder image path
      facebook: "https://facebook.com/coffeehouse",
      instagram: "https://instagram.com/coffeehouse",
      youtube: "https://youtube.com/coffeehouse",
    });

    await banner.save();
    console.log("Banner seed data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding banner data:", error);
    process.exit(1);
  }
};

seedBanner();
