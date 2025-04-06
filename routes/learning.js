const express = require("express");
const mongoose=require('mongoose');
// const { upload, getGfs } = require("../config/multer-grid-fs");
const router = express.Router();
const Classroom=require('../Model/classroom');
const learning=require('../Model/learning');
const Teacher=require('../Model/tchr');
 // We store file in memory as binary data
 const multer=require('multer');
 const storage = multer.memoryStorage(); // We store file in memory as binary data
 
 const upload = multer({ storage: storage });
const {getTokenFromCookies} =require('../config/tchr');
const { UploadFile,getResource,ViewResource,DownloadRes,deleteRes} = require('../Controller/learning')

function isAuthenticated(req, res, next) {
  console.log('Cookies in request:', req.cookies);

  // Extract student token
  const Teacher = getTokenFromCookies(req, 'teacher_token');

  if (Teacher) {
    console.log('Teacher authenticated:', Teacher);
    req.user = Teacher; // Attach user info to the request
    return next(); // Allow access to the intended route
  } else {
    console.log('No valid token found. Redirecting to login.');
    res.clearCookie('teacher_token'); // Clear the student token if invalid
    return res.redirect('/tchr/login'); // Redirect to the login page
  }
}
router.post("/upload",isAuthenticated, upload.single("file"),  UploadFile);
router.get("/upload",isAuthenticated, async (req, res) => {
  const teacherId=req.user.id;
  console.log("teacher id",teacherId)
  const classes = await Classroom.find({ teacher: new mongoose.Types.ObjectId(teacherId) });

    console.log('classes',classes)
    res.render("Upload", { classes });
});


router.post('/delete-classroom/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await Classroom.findByIdAndDelete(id);
      res.status(200).json({ message: 'Classroom deleted successfully' });
      res.render('classroom');
  } catch (error) {
      res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
});
router.get("/resource", isAuthenticated, getResource);

// Route to download file
router.get("/download/:id", isAuthenticated, DownloadRes);

// Route to view file
router.get("/view/:id", isAuthenticated,ViewResource);

// Route to delete a resource (Only the teacher who uploaded it can delete)
router.get("/delete/:id", isAuthenticated, deleteRes);

module.exports = router;
