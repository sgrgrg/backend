const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const branchInfoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  branches: [branchSchema],
});

const BranchInfo = mongoose.model("BranchInfo", branchInfoSchema);

module.exports = BranchInfo;
