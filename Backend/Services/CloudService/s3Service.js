const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const uploadImage = async (filePath, folder) => {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: fileStream,
    };

    const result = await s3.upload(params).promise();
    return { url: result.Location, key: result.Key };
};

const deleteImage = async (key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    };
    await s3.deleteObject(params).promise();
};

module.exports = {
    uploadImage,
    deleteImage,
};
