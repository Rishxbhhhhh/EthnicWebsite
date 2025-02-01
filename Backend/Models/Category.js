const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Use an array of strings to store multiple image URLs
    required: true,
  },
});

exports.Category = mongoose.model("Category", categorySchema);
