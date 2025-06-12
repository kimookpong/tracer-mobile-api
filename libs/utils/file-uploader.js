const multer = require("multer");
const path = require("path");

class FileUploader {
  constructor(
    uploadDir = "test",
    allowedTypes = /jpeg|jpg|png|gif/,
    maxFileSize = 2 * 1024 * 1024
  ) {
    this.uploadDir = "../uploads/" + uploadDir;
    this.allowedTypes = allowedTypes;
    this.maxFileSize = maxFileSize;

    // Configure multer storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir); // Uploads directory
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const newFileName =
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
        cb(null, newFileName);
      },
    });

    // Configure multer upload
    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: this.maxFileSize }, // Limit file size
      fileFilter: (req, file, cb) => {
        const extname = this.allowedTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = this.allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
          return cb(null, true);
        }
        cb(new Error("Invalid file type. Only images are allowed."));
      },
    });
  }

  // Middleware to handle single file upload
  uploadSingle(fieldName) {
    return this.upload.single(fieldName);
  }

  // Method to get the uploaded file's name from the request object
  getUploadedFileName(req) {
    if (req.file) {
      return req.file.filename;
    }
    throw new Error("No file uploaded.");
  }
}

module.exports = FileUploader;
