const multer = require("multer");
// const path = require("path");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueSuffix);
//   },
// });

// const upload = multer({ storage: storage });
// module.exports = upload;


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary (Get these keys for free at cloudinary.com)
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET 
});

// 2. This REPLACES your diskStorage logic
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social_app', // Name of the folder in Cloudinary
    // allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });
module.exports = upload;