const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "gtl-certificates",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
  }),
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

const wrapUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = upload;
module.exports.wrapUpload = wrapUpload;