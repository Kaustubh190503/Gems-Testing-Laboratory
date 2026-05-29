const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // FIX: sanitise original filename to avoid special-char issues
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  // FIX: added file size limits — 10MB images, 20MB PDFs
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Middleware wrapper: rewrite file.path to a clean relative path
// Multer on Windows stores absolute paths like C:\Users\...\uploads\file.jpg
// We normalise to "uploads/filename" so URLs build correctly on all platforms.
const wrapUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return next(err);
    if (req.files) {
      Object.values(req.files).flat().forEach((f) => {
        f.path = `uploads/${f.filename}`;
      });
    }
    if (req.file) {
      req.file.path = `uploads/${req.file.filename}`;
    }
    next();
  });
};

module.exports = upload;
module.exports.wrapUpload = wrapUpload;