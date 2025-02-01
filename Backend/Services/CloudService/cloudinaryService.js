require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        // console.log("debugger---->>>>" , result);
        return {
            publicId: (result.public_id).slice(9),
            url: result.url,
        }
    }catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image");
}
};

const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image with public ID: ${publicId}`);
    } catch (error) {
        console.error("Image deletion failed:", error);
        throw new Error("Failed to delete image");
    }
};

const deleteProductImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image ${publicId}:`, result);
    } catch (err) {
        throw new Error(`Failed to delete image ${publicId}`);
    }
};



module.exports = {
    uploadImage,
    deleteImage,
    deleteProductImage
};
