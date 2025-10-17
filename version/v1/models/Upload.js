const { PrismaClient } = require("../../../prisma/generated/prisma");
const { toCamelCase, generateUUID } = require("../../../middleware/utils");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || "general";
    const year = new Date().getFullYear();
    const uploadPath = path.join("uploads", category, year.toString());

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const newFilename = `${generateUUID()}${ext}`;
    cb(null, newFilename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and documents
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, and documents are allowed."
      ),
      false
    );
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload single file
exports.uploadSingle = upload.single("file");

// Upload multiple files
exports.uploadMultiple = upload.array("files", 10); // Max 10 files

// Handle upload response
exports.upload = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    let uploadedFiles = [];

    if (req.file) {
      // Single file upload
      const category = req.body.category || "general";
      const year = new Date().getFullYear();
      const filePath = `/uploads/${category}/${year}/${req.file.filename}`;

      uploadedFiles.push({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: filePath,
        contentType: req.file.mimetype,
        size: req.file.size,
        category: category,
      });
    } else if (req.files) {
      // Multiple files upload
      const category = req.body.category || "general";
      const year = new Date().getFullYear();

      uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/${category}/${year}/${file.filename}`,
        contentType: file.mimetype,
        size: file.size,
        category: category,
      }));
    }

    res.status(200).json({
      status: "success",
      message: "File(s) uploaded successfully",
      data: toCamelCase(uploadedFiles),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

// Remove/Delete file
exports.remove = async (req, res, next) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        status: "error",
        message: "File path is required",
      });
    }

    // Remove leading slash if present
    const cleanPath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;
    const fullPath = path.join(process.cwd(), cleanPath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    // Delete the file
    fs.unlinkSync(fullPath);

    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

// Preview/Download file
exports.preview = async (req, res, next) => {
  try {
    const { category, year, filename } = req.params;

    if (!category || !year || !filename) {
      return res.status(400).json({
        status: "error",
        message: "Category, year, and filename are required",
      });
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      category,
      year,
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    // Determine content type
    const contentTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    // Set headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);

    // Check if download is requested
    if (req.query.download === "true") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    }

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

// Get file info
exports.getFileInfo = async (req, res, next) => {
  try {
    const { category, year, filename } = req.params;

    if (!category || !year || !filename) {
      return res.status(400).json({
        status: "error",
        message: "Category, year, and filename are required",
      });
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      category,
      year,
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        message: "File not found",
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename);

    const fileInfo = {
      filename: filename,
      filePath: `/uploads/${category}/${year}/${filename}`,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: ext,
      category: category,
      year: year,
    };

    res.status(200).json({
      status: "success",
      data: toCamelCase(fileInfo),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

// List files in a category/year
exports.listFiles = async (req, res, next) => {
  try {
    const { category, year } = req.params;

    if (!category || !year) {
      return res.status(400).json({
        status: "error",
        message: "Category and year are required",
      });
    }

    const dirPath = path.join(process.cwd(), "uploads", category, year);

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    // Read directory
    const files = fs.readdirSync(dirPath);
    const fileList = files.map((filename) => {
      const filePath = path.join(dirPath, filename);
      const stats = fs.statSync(filePath);
      const ext = path.extname(filename);

      return {
        filename: filename,
        filePath: `/uploads/${category}/${year}/${filename}`,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        extension: ext,
      };
    });

    res.status(200).json({
      status: "success",
      data: toCamelCase(fileList),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
