const mongoose = require("mongoose");
const BranchInfo = require("../models/BranchInfo");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + '/../.env' });

const seedBranches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove existing branch info data
    await BranchInfo.deleteMany({});

    // Create new branch info data
    const branchData = new BranchInfo({
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
