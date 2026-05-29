const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Resolve uploads directory using absolute path
const UPLOADS_DIR = path.resolve(__dirname, "uploads");
console.log("📁 Uploads directory:", UPLOADS_DIR);

// Serve static uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// Dedicated download endpoint — bypasses static serving issues
// Handles: GET /api/file/:filename
app.get("/api/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOADS_DIR, filename);
  console.log("📥 Download request:", filePath);
  if (!fs.existsSync(filePath)) {
    console.log("❌ File not found:", filePath);
    return res.status(404).json({ error: "File not found" });
  }
  res.sendFile(filePath);
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", uploadsDir: UPLOADS_DIR }));

// Routes
app.use("/api/certificates", require("./routes/certificateRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, message: "File too large (max 20MB)" });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
