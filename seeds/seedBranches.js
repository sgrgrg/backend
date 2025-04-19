const mongoose = require("mongoose");
const Branch = require("../models/Branch");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + '/../.env' });

const seedBranches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove existing branch data
    await Branch.deleteMany({});

    // Create new branch data
    const branchData = new Branch({
      title: "Find Us",
      description: "Visit our branches for the best coffee experience.",
      branches: [
        {
          location: "Downtown Coffee House",
          image: "uploads/branch1.jpg",
          featured: true,
        },
        {
          location: "Uptown Coffee House",
          image: "uploads/branch2.jpg",
          featured: false,
        },
        {
          location: "Suburban Coffee House",
          image: "uploads/branch3.jpg",
          featured: false,
        },
      ],
    });

    await branchData.save();
    console.log("Branches seed data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding branches data:", error);
    process.exit(1);
  }
};

seedBranches();
