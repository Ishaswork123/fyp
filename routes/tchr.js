
const express=require('express');
const router=express.Router();
const { handleSignup,handleLogin,handleLogout,handleUpdateAccount,handlegetUpdate,verifyEmail}= require('../Controller/tchr');
const multer = require('multer');
const { getTokenFromCookies } = require('../config/tchr');  

const path = require('path');
const storage=multer.memoryStorage();


function isAuthenticated(req, res, next) {
    const tokenData = getTokenFromCookies(req);  // Extract the token from cookies

    if (!tokenData) {
        // Token is missing or invalid, redirect to the home page
        return res.redirect('/');
    }

    // Attach the user ID and email to the request object for further use
    req.userId = tokenData.id;
    next();
}
  






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
    res.render('tchrSignup', { 
        signupErrors: {}, 
        loginErrors:{},   // Empty errors object for the initial load
        fname: '', 
        lname: '', 
        email: '', 
        activeTab: 'signup' 
    });
  });
  
  router.get('/login', (req, res) => {
    return res.render('tchrSignup', { 
        activeTab: 'login',
        email:'',
        pwd:'',
        fname: '', 
        lname: '', 
        email: '', 
        signupErrors: {},
        loginErrors:{},  // Empty errors object for the initial load
      
    });
  });
  router.get('/verifyemail',(req,res)=>{
    res.render('tchrOtp');
  });
  router.post('/verifyemail',verifyEmail);
  router.post('/signup', upload.single('pic'), handleSignup);
  router.post('/login', handleLogin);
  router.get('/logout',handleLogout);
  router.get('/setting', isAuthenticated,handlegetUpdate);
  router.post('/setting', upload.single('pic_1'), isAuthenticated,handleUpdateAccount);

  module.exports=router;