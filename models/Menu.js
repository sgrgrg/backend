const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false }, 
});

const titleDescribeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const Menu = mongoose.model("Menu", menuSchema);
const TitleDescribe = mongoose.model("TitleDescribe", titleDescribeSchema);

module.exports = { Menu, TitleDescribe };

