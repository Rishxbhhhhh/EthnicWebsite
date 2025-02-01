const mongoose = require("mongoose");

const ProductItem = mongoose.Schema({
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  images: [
    {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

exports.Products = mongoose.model("Products", ProductItem);
