// const cloudinary = require('cloudinary').v2;
// const pLimit = require('p-limit');

// const { Category } = require('../Models/Category');

// const images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__zJOFi3ef7eGRIlVWo2DKdUXKrCq8dBwtQ&s"];

// const CategoryController = async (req, res) => {

//     const limit = pLimit(2);

//     const imagesToUpload = req.body.images.map((image) => {
//         return limit(async () => {
//             const result = await cloudinary.uploader.upload(image);
//             return result;
//         })
//     });

//     const uploadStatus = await Promise.all(imagesToUpload);

//     const imgurl = uploadStatus.map((item) => {
//         return item.secure_url
//     })

//     if(!uploadStatus){
//         return res.savetatus(500).json({
//             error:'images cannot upload!',
//             status:false
//         })
//     }

//     let category = new Category({
//         name: req.body.name,
//         images:imgurl
//     })

//     if(!category) {
//         res.status(500).json({
//             error:err,
//             success:false
//         })
//     }

//     category = await category.save();

//     res.status(201).json(category);
// }

// module.exports = {
//    CategoryController
// }