const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const { connectToMongoBb } = require("../connection");

let gfs;
let storage;

// MongoDB Connection
connectToMongoBb("mongodb://127.0.0.1:27017/fyp")
  .then((conn) => {
    console.log("MongoDB connected");

    gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: "learnings",
    });

    console.log("GridFSBucket initialized");

    // Initialize storage **only after connection is confirmed**
    storage = new GridFsStorage({
      db: conn.connection.db,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: async (req, file) => {
        let bucketName = "misc"; // Default bucket
        if (req.body && req.body.fileType) {
          if (req.body.fileType === "pdf") bucketName = "pdfs";
          else if (req.body.fileType === "video") bucketName = "videos";
          else bucketName = "images";
        }

        const filename = `${Date.now()}-${file.originalname}`;

        console.log("Processing file upload:", {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: req.body.fileSize || "Unknown",
        });

        return {
          filename: filename,
          bucketName: bucketName,
          metadata: {
            size: req.body.fileSize || null, // Store file size in metadata
          },
        };
      },
    });

    console.log("Storage engine initialized");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Getter function for `gfs`
function getGfs() {
  if (!gfs) {
    throw new Error("GridFS is not initialized yet");
  }
  return gfs;
}
const upload = (req, res, next) => {
  if (!storage) {
    return res.status(500).json({ error: "Database not connected yet" });
  }

  const multerUpload = multer({ storage }).single("file");

  multerUpload(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ error: "File upload error", details: err.message });
    }

    if (!req.file) {
      console.error("File upload failed: req.file is undefined");
      return res.status(400).json({ error: "File upload failed" });
    }

    console.log("Uploaded file:", req.file);

    // Debugging: Check if `_id` exists
    if (!req.file.id) {
      console.error("Uploaded file is missing an _id:", req.file);
      return res.status(500).json({ error: "File upload failed: Missing file ID" });
    }

    next();
  });
};
module.exports = { upload, getGfs };