const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { wrapUpload } = require("../middleware/upload");
const {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
  getAnalytics,
} = require("../controllers/certificateController");

// Analytics — place BEFORE /:id to avoid route conflict
router.get("/analytics", getAnalytics);

// CRUD
router.post(
  "/",
  wrapUpload(upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ])),
  createCertificate
);

router.get("/", getCertificates);
router.get("/:id", getCertificateById);

router.put(
  "/:id",
  wrapUpload(upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ])),
  updateCertificate
);

// FIX: delete now uses MongoDB _id via URL param
router.delete("/:id", deleteCertificate);

module.exports = router;