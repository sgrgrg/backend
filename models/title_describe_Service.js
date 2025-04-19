// models/title_describe_Service.js
const mongoose = require('mongoose');

const titleDescribeServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const TitleDescribeService = mongoose.model('TitleDescribeService', titleDescribeServiceSchema);

module.exports = TitleDescribeService;
