
const express=require('express');
const router=express.Router();
const { handleSignup,handleLogin,handleLogout,handleUpdateAccount,handlegetUpdate,verifyEmail,sendOTP, verifyOTP, resetPassword }= require('../Controller/std');
const multer = require('multer');
const path = require('path');
const { getTokenFromCookies } = require('../config/tchr');  


function isAuthenticated(req, res, next) {
    const tokenData = getTokenFromCookies(req);  // Extract the token from cookies

    if (!tokenData) {
        // Token is missing or invalid, redirect to the home page
        return res.redirect('/');
    }}
const storage=multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Set file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});
router.get('/signup', (req, res) => {
    res.render('stdSignup', { 
        signupError: {}, 
        loginError:{}, 
                fname: '', 
        lname: '', 
        email: '', 
        activeTab: 'signup' 
    });
  });
  router.get('/verifyemail',(req,res)=>{
    res.render('stdOtp');
  });
  router.post('/verifyemail',verifyEmail);
  router.get('/login', (req, res) => {
    return res.render('stdSignup', { 
        activeTab: 'login',
        fname: '', 
        lname: '', 
        email: '', 
        signupError: {}, 
        loginError:{},    // Empty errors object for the initial load
      
    });
  });
  router.get("/passreset", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    res.render("resetPassStd",{email}); // Load the EJS file
})
router.get("/verify-otp", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in verify-otp route:", {email});
    res.render("resetPassStd", { email });
});

router.get("/reset-password", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in reset-password route:", {email});
    res.render("resetPassStd", { email});
});
  router.post('/signup', upload.single('pic'), handleSignup);
  router.post('/login', handleLogin);
  router.get('/logout',handleLogout);
  router.get('/setting', isAuthenticated,handlegetUpdate);
  router.post('/setting', upload.single('pic_1'), isAuthenticated,handleUpdateAccount);
  router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
  module.exports=router;