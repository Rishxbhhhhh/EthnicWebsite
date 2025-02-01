const express = require("express");
const fs = require("fs");
const router = express.Router();
const cloudService = require("../Services/cloudService");
const { Collection } = require("../Models/Collections");

router.get("/", async (req, res) => {
  try {
    const collectionList = await Collection.find();
    if (collectionList.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Collections found" });
    }
    res.status(200).json(collectionList);
  } catch (err) {
    console.error("Error fetching collections:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const collections = await Collection.findById(req.params.id);

  if (!collections) {
    res
      .status(500)
      .json({ message: "The collection with the given ID was not found." });
  }
  return res.status(200).send(collections);
});

// const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post("/create", async (req, res) => {
  console.log("LINE 40:", req.body);
  console.log("LINE 41:",req.image)
  if (!req.body.name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required." });
  }
  if (!req.files || !req.files.image) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required." });
  }

  const imageFile = req.files.image;
  // if (imageFile.size > 5 * 1024 * 1024) { //5mb
  //     return res.status(400).json({ success: false, message: 'Image file size exceeds the limit of 5MB.' });
  // }
  console.log("LINE 47:", imageFile);

  let uploadedImageResult;
  try {
    uploadedImageResult = await cloudService.uploadImage(
      imageFile.tempFilePath,
      "uploads"
    );
    console.log("LINE 52:", uploadedImageResult);
  } catch (uploadError) {
    fs.unlink(imageFile.tempFilePath, (err) => {
      if (err) console.error("Temp file deletion error:", err);
    });
    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: uploadError.message,
    });
  }

  const collection = new Collection({
    name: req.body.name,
    images: uploadedImageResult.url,
  });

  try {
    const savedCollections = await collection.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: {
        id: savedCollections._id,
        name: savedCollections.name,
        imageUrl: savedCollections.images,
      },
    });
  } catch (saveError) {
    res.status(500).json({
      success: false,
      message: "Failed to save the collection in the database.",
      error: saveError.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  const { name } = req.body;

  // console.log("Line 92:", req.files)
  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    try {
      const uploadedImageResult = await cloudService.uploadImage(
        imageFile.tempFilePath,
        "uploads"
      );
      req.body.images = uploadedImageResult.url; // Updating image
      // console.log("Line 98:", req.body.images)
    } catch (error) {
      fs.unlink(imageFile.tempFilePath, (err) => {
        if (err) console.error("Temp file deletion error:", err);
      });
      return res.status(500).json({
        success: false,
        message: "Failed to upload the image.",
        error: error.message,
      });
    }
  }
  try {
    // console.log("Line 112:",req.body.images);
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }), // Update name only if provided
        ...(req.body.images && { images: req.body.images }), // Update images only if provided
      },
      { new: true } // Return the updated document
    );
    // console.log("Line 118:",updatedCollection);

    if (!updatedCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedCollection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the collection.",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCollection = await Collection.findByIdAndDelete(req.params.id);

    if (!deletedCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete the collection.",
      error: error.message,
    });
  }
});

module.exports = router;