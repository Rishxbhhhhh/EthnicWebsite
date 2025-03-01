const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');
const { Products } = require('../Models/ProductsModel');
const { Collection } = require('../Models/Collections');
const fs = require("fs");
const cloudService = require('../Services/cloudService');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

router.get('/', async (req, res) => {
  try {
    const productList = await Products.find().populate("collection");
    if (productList.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(productList);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/create', async (req, res) => {
  const collection = await Collection.findById(req.body.collection);
  if (!collection) {
    return res.status(404).send("invalid collections")
  }

  if (!req.body.name) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }

  if (!req.files || !req.files.images) {
    return res.status(400).json({ success: false, message: 'Image is required.' });
  }

  const imageFileArray = req.files;


  // if (imageFile.size > 5 * 1024 * 1024) { //5mb
  //     return res.status(400).json({ success: false, message: 'Image file size exceeds the limit of 5MB.' });
  // }

  let uploadedImageResult;
  let imageData = [];
  try {
    for (const image of imageFileArray.images) {
      uploadedImageResult = await cloudService.uploadImage(image.tempFilePath, "products");
      imageData.push(uploadedImageResult)
      console.log("LINE 52:", imageData);
    }
  } catch (uploadError) {
    fs.unlink(imageFileArray.images.tempFilePath, (err) => {
      if (err) console.error('Temp file deletion error:', err);
    });
    console.log(uploadError);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed.',
      error: uploadError.message,
    });
  }

  let product = new Products({
    name: req.body.name,
    description: req.body.description,
    images: imageData,
    price: req.body.price,
    mrp: req.body.mrp,
    collection: req.body.collection,
    stock: req.body.stock,
    dateCreated: req.body.dateCreated
  });

  product = await product.save();
  if (!product) {
    res.status(500).json({
      error: err,
      success: false
    })
  }

  res.status(201).json(product);
})

router.put("/update/:id", async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required." });
  }

  try {
    // Find the product in the database
    let product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Update fields
    const { name, description, price, mrp, stock } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (mrp) product.mrp = mrp;
    if (stock) product.stock = stock;

    // Handle new image upload
    console.log("Uploaded files:", req.files);
    if (req.files && req.files.images) {
      const imageFile = req.files.images; // Single file object
      try {
        const uploadedImage = await cloudService.uploadImage(imageFile.tempFilePath, "products");

        // Ensure the uploaded image matches the schema
        const imageToSave = {
          publicId: uploadedImage.publicId,
          url: uploadedImage.url,
        };

        product.images.push(imageToSave);
        console.log("Image added:", imageToSave);
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ success: false, message: "Image upload failed.", error: error.message });
      }
    }

    // Save the updated product to the database
    const updatedProduct = await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully.", data: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
});

// Deleting image from product based on publicId
router.delete('/delete-image/:publicId', async (req, res) => {
  const { publicId } = req.params;

  if (!publicId || publicId === "temp") {
    return res.status(400).json({ message: 'Invalid publicId for deletion.' });
  }

  console.log(`Request to delete image with publicId: ${publicId}`);

  try {
    // Delete the image from Cloudinary
    try {
      await cloudService.deleteProductImage(publicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary error:", cloudinaryError);
      return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error: cloudinaryError });
    }

    // Find the product and remove the image from the images array
    const product = await Products.findOne({ 'images.publicId': publicId });
    console.log('Line 165:', product);

    if (!product || !product.images) {
      return res.status(404).json({ message: 'Product or image not found' });
    }

    product.images = product.images.filter(image => image.publicId !== publicId);
    await product.save(); // Save the updated product

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});

router.delete('/delete-image/:publicId', async (req, res) => {
  const { publicId } = req.params;

  if (!publicId || publicId === "temp") {
    return res.status(400).json({ message: 'Invalid publicId for deletion.' });
  }

  console.log(`Request to delete image with publicId: ${publicId}`);

  try {
    // Delete the image from Cloudinary
    await cloudService.deleteProductImage(publicId);

    // Find the product and remove the image
    const product = await Products.findOne({ 'images.publicId': publicId });
    if (!product || !product.images) {
      return res.status(404).json({ message: 'Product or image not found' });
    }

    product.images = product.images.filter(image => image.publicId !== publicId);
    await product.save();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});


router.get('/new-arrivals', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 2; // Default to the last 30 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

<<<<<<< HEAD
    const newArrivals = await Products.find({ dateCreated: { $gte: cutoffDate } }).populate("collection");
=======
    const newArrivals = await Products.find().populate("collection");
>>>>>>> 854a6f3 (First commit)

    if (newArrivals.length === 0) {
      return res.status(404).json({ success: false, message: 'No new arrivals found' });
    }

    res.status(200).json(newArrivals);
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const productId = req.params.id;

  console.log(productId)
  try {
    // Find the product by ID
    const product = await Products.findById(productId);
    console.log(product)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete associated images from cloud storage
    if (product.images && product.images.length > 0) {
      console.log("Line 126:----hello")
      for (const image of product.images) {
        try {
          await cloudService.deleteProductImage(image.publicId); // Assuming `public_id` is stored for cloudinary
        } catch (err) {
          console.error(`Failed to delete image ${image.publicId}:`, err);
        }
      }
    }

    // Delete the product from the database
    await Products.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

