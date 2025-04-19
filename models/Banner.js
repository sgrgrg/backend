const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  youtube: { type: String, required: true },
});

module.exports = mongoose.model("Banner", bannerSchema);
