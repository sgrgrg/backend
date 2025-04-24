const mongoose = require("mongoose");

const emailValidator = function(email) {
  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

const phoneValidator = function(phone) {
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
};

const branchSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  fbLink: {
    type: String,
    default: "",
  },
  instaLink: {
    type: String,
    default: "",
  },
  youtubeLink: {
    type: String,
    default: "",
  },
  emails: {
    type: [String],
    validate: {
      validator: function(emails) {
        return emails.every(email => emailValidator(email));
      },
      message: props => `One or more emails are invalid: ${props.value}`
    },
    default: []
  },
  phoneNumbers: {
    type: [String],
    validate: {
      validator: function(phones) {
        return phones.every(phone => phoneValidator(phone));
      },
      message: props => `One or more phone numbers are invalid: ${props.value}`
    },
    default: []
  },
  isMain: {
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
