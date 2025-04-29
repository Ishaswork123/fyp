const express = require("express");
const mongoose=require('mongoose');
// const { upload, getGfs } = require("../config/multer-grid-fs");
const router = express.Router();
const Classroom=require('../Model/classroom');
const learning=require('../Model/learning');
const Teacher=require('../Model/tchr');
const multer=require('multer');
const storage = multer.memoryStorage(); // We store file in memory as binary data

async function UploadFile(req, res) {
  try {
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded!" });
      }

      let { title, assignedTo, exp_no, classId } = req.body;

      // Get teacher email from authenticated user
      let teacherEmail = req.user.email;
      let className = null;

      // Validate exp_no (must be provided)
      if (!exp_no) {
          return res.status(400).json({ message: "Experiment number (exp_no) is required!" });
      }
      exp_no = exp_no.toString(); // Ensure it's stored as a string

      // If assigned to a class, fetch class details
      if (assignedTo === "class" && classId) {
          classId = new mongoose.Types.ObjectId(classId);

          const classroom = await Classroom.findById(classId);
          if (classroom) {
              className = classroom.className;

              // Fetch teacher email if available
              const teacher = await Teacher.findById(classroom.teacher);
              if (teacher) {
                  teacherEmail = teacher.email;
              }
          }
      }

      // Validate file size (16MB max)
      const fileSizeMB = req.file.size / (1024 * 1024);
      if (fileSizeMB > 16) {
          return res.status(400).json({ message: "File size exceeds 16MB. Please upload a smaller file." });
      }

      // Determine file type based on MIME type
      let fileType;
      const mimeType = req.file.mimetype;
      if (mimeType.includes("pdf")) {
          fileType = "pdf";
      } else if (mimeType.startsWith("image/")) {
          fileType = "image";
      } else if (mimeType.startsWith("video/")) {
          fileType = "video";
      } else {
          return res.status(400).json({ message: "Unsupported file type." });
      }

      // Save file details in MongoDB
      const newMaterial = new learning({
          title,
          file: req.file.buffer,
          fileSize: fileSizeMB.toFixed(2) + " MB",
          fileType,
          teacherEmail,
          assignedTo,
          exp_no, // Always store exp_no
          classId: assignedTo === "class" ? classId : null, // Store classId only if assigned to a class
          className: assignedTo === "class" ? className : null, // Store className if class is assigned
      });

      await newMaterial.save();
      res.render("class"); // Adjust as needed

  } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).json({ message: "Error uploading file", error: error.message });
  }
}

async function getResource(req, res) {
    try {
        const teacherEmail = req.user.email; // Get teacher's email from session/JWT
    
        // Fetch all learning materials uploaded by the logged-in teacher
        const materials = await learning.find({ teacherEmail });
    
        res.render("tchrRes", { materials });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Server Error");
    }
}

async function ViewResource(req,res){
  try {
    const material = await learning.findById(req.params.id);

    if (!material) return res.status(404).send("File not found");
    if (material.teacherEmail !== req.user.email) return res.status(403).send("Unauthorized");

    res.set("Content-Type", 
        material.fileType === "pdf" ? "application/pdf" : 
        material.fileType === "image" ? "image/jpeg" : 
        "video/mp4"
    );
    res.send(material.file);
} catch (error) {
    console.error("Error viewing file:", error);
    res.status(500).send("Server Error");
}
}

async function DownloadRes(req,res){
  try {
    const material = await learning.findById(req.params.id);

    if (!material) return res.status(404).send("File not found");
    if (material.teacherEmail !== req.user.email) return res.status(403).send("Unauthorized");

    res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${material.title}.${material.fileType}"`,
    });

    res.send(material.file);
} catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Server Error");
}

}
async function deleteRes(req,res){
  try {
    const material = await learning.findById(req.params.id);

    if (!material) return res.status(404).send("File not found");
    if (material.teacherEmail !== req.user.email) return res.status(403).send("Unauthorized");

    await learning.findByIdAndDelete(req.params.id);
    res.redirect("/tchr/resource"); // Redirect after deletion
} catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Server Error");
}
}

module.exports={
    UploadFile,getResource,ViewResource,DownloadRes,deleteRes
}