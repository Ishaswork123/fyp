const express = require("express");
const router = express.Router();
const {showClass}=require('../Controller/classStd');
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
router.get('/class',(req,res)=>{
    res.render('stdClass');
})
  router.get("/my-classes", isAuthenticated, showClass);

module.exports = router;