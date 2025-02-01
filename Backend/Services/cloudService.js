const cloudinaryService = require('./CloudService/cloudinaryService');
const s3Service = require('./CloudService/s3Service');

// Detect the cloud provider dynamically from environment variable
const provider = process.env.CLOUD_PROVIDER || 'cloudinary';

let cloudService;
if (provider === 'cloudinary') {
    cloudService = cloudinaryService;
} else if (provider === 's3') {
    cloudService = s3Service;
} else {
    throw new Error('Unsupported cloud provider');
}

module.exports = cloudService;
