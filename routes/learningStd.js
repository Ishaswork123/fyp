const express = require("express");
const LearningMaterial = require("../Model/learning");
const Classroom = require("../Model/classroom");
const {getResource,ViewResource,DownloadRes}=require('../Controller/learningStd');
const {getTokenFromCookies
} =require('../config/tchr');

function isAuthenticated(req, res, next) {
    console.log('Cookies in request:', req.cookies);
  
    // Extract student token
    const student = getTokenFromCookies(req, 'student_token');
  
    if (student) {
      console.log('student authenticated:', student);
      req.user = student; // Attach user info to the request
      return next(); // Allow access to the intended route
    } else {
      console.log('No valid token found. Redirecting to login.');
      res.clearCookie('student_token'); // Clear the student token if invalid
      return res.redirect('/std/login'); // Redirect to the login page
    }
  }

  const router = express.Router();

// Route to fetch resources for a student
router.get("/resource/:exp_no", isAuthenticated, getResource);

// Route to download file
router.get("/download/:id", DownloadRes);

// Route to view file
router.get("/view/:id", ViewResource);

module.exports = router;
