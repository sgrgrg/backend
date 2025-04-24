const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true }
});

const meetTheTeamSchema = new mongoose.Schema({
  title: { type: String, default: "Meet the Team / Our Culture" },
  content: { type: String, required: true },
  image: { type: String }
});

const aboutSchema = new mongoose.Schema({
  whoWeAre: {
    title: { type: String, default: "Who We Are" },
    content: { type: String, required: true },
    image: { type: String } // optional image URL
  },
  whatWeDo: {
    title: { type: String, default: "What We Do" },
    content: { type: String, required: true },
    image: { type: String }
  },
  whyChooseUs: {
    title: { type: String, default: "Why Choose Us" },
    content: { type: String, required: true },
    image: { type: String },
    testimonials: [testimonialSchema] // optional testimonials array
  },
  meetTheTeam: [meetTheTeamSchema]
}, { timestamps: true });

const About = mongoose.model("About", aboutSchema);

module.exports = About;
