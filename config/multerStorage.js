const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use environment variable or default to a persistent absolute path outside backend directory
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(__dirname, "../../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

module.exports = storage;
