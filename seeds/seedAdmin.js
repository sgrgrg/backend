const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://baddepartment434:password1298@cluster0.1mujni6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const seedAdmin = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: "admin@coffeehouse.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const adminUser = new User({
      username: "admin",
      email: "admin@coffeehouse.com",
      password: "password@123", // This will be hashed by the User model pre-save hook
      isAdmin: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
