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

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
