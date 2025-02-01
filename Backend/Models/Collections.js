const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Use an array of strings to store multiple image URLs
    required: true,
  },
});

exports.Collection = mongoose.model("Collection", collectionSchema);