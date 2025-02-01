const express = require('express');
const router = express.Router();
const { Category } = require('../Models/Category');
const cloudinary = require('cloudinary').v2;
const pLimit = require('p-limit');
const fs = require('fs');
const cloudService = require('../Services/cloudService');

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (categoryList.length === 0) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }
        res.status(200).json(categoryList);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' })
    }
    return res.status(200).send(category);
})

router.post('/create', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    if (!req.files || !req.files.image) {
        return res.status(400).json({ success: false, message: 'Image is required.' });
    }
    console.log("LINE 45:", req.body.name)

    const imagesToUpload = req.files.image;

    let imgUrl;

    try {
        const result = await cloudService.uploadImage(imagesToUpload.tempFilePath, { folder: "uploads" });
        console.log("LINE 54:", result)
        imgUrl = result.url;
    } catch (uploadError) {
        fs.unlink(imagesToUpload.tempFilePath, (err) => {
            if (err) console.error("Temp file deleetion error:", err);
        });
        return res.status(500).json({
            success: false,
            message: "Image upload failed.",
            error: upload.message
        });
    }

    // Create a new category
    const category = new Category({
        name: req.body.name,
        images: imgUrl
    });

    try {
        // Save the category to the database
        const savedCategory = await category.save();
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: {
                id: savedCategory._id,
                name: savedCategory.name,
                imageUrl: savedCategory.images,
            },
        });

    } catch (saveError) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: saveError.message,
        });
    }
});

router.put('/update/:id', async (req, res) => {
    const { name } = req.body;

    // console.log("Line 92:", req.files)
    if (req.files && req.files.image) {
        const imageFile = req.files.image;
        try {
            const uploadedImageResult = await cloudService.uploadImage(imageFile.tempFilePath, "uploads");
            req.body.images = uploadedImageResult.url; // Updating image
            // console.log("Line 98:", req.body.images)
        } catch (error) {
            fs.unlink(imageFile.tempFilePath, (err) => {
                if (err) console.error('Temp file deletion error:', err);
            });
            return res.status(500).json({
                success: false,
                message: 'Failed to upload the image.',
                error: error.message,
            });
        }
    }
    try {
        // console.log("Line 112:",req.body.images);   
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                ...(name && { name }), // Update name only if provided
                ...(req.body.images && { images: req.body.images }), // Update images only if provided
            },
            { new: true } // Return the updated document
        );
        // console.log("Line 118:",updatedCollection);

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found.'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update the Category.',
            error: error.message
        });
    }
});



router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete the category.',
            error: error.message,
        });
    }
});

module.exports = router;
