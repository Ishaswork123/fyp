const express = require("express");
const mongoose=require('mongoose');
// const { upload, getGfs } = require("../config/multer-grid-fs");
const router = express.Router();
const Classroom=require('../Model/classroom');
const learning=require('../Model/learning');
const Teacher=require('../Model/tchr');
const multer=require('multer');
const storage = multer.memoryStorage(); // We store file in memory as binary data


async function UploadFile(req,res){
    try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded!" });
        }
    
        let { title, assignedTo, classId } = req.body;
    
        // Get teacher email from authenticated user
        let teacherEmail = req.user.email; 
    
        let className = null; // Default null for "All Students"
        
        if (assignedTo === "class" && classId) {
          // Convert classId to ObjectId
          classId = new mongoose.Types.ObjectId(classId);
    
          // Fetch class details
          const classroom = await Classroom.findById(classId);
          if (classroom) {
            className = classroom.className; // Store className
            
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
    
        // Determine the file type based on MIME type
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
    
        // Save file info and binary data in MongoDB
        const newMaterial = new learning({
          title,
          file: req.file.buffer,
          fileType,
          assignedTo, // "all" or "class"
          classId: assignedTo === "class" ? classId : null, // Store only if assigned to class
          teacherEmail, // Store teacher's email
          className, // Store className if class is selected
          fileSize: fileSizeMB,
        });
    
        await newMaterial.save();
        
        // Fetch classrooms again for rendering
        // const classrooms = await Classroom.find();
        
        res.render("class");
      } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
      }
}

async function getResource(req,res){
  try {
    const teacherEmail = req.user.email; // Get teacher's email from session/JWT

    // Fetch learning materials uploaded by the logged-in teacher
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
    res.redirect("/tchr/resources"); // Redirect after deletion
} catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Server Error");
}
}

module.exports={
    UploadFile,getResource,ViewResource,DownloadRes,deleteRes
}