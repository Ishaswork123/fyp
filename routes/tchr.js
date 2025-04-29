
const express=require('express');
const router=express.Router();
const { handleSignup,handleLogin,handleLogout,handleUpdateAccount,handlegetUpdate,verifyEmail,sendOTP, verifyOTP, resetPassword}= require('../Controller/tchr');
const multer = require('multer');
const Community=require('../Model/community');
const std = require('../Model/std');
const tchr = require('../Model/tchr');
const path = require('path');
const storage=multer.memoryStorage();

const mongoose =require('mongoose');
const { getTokenFromCookies } = require('../config/tchr');  

const {    addUserToCommunity
}=require('../Controller/community');

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
  router.get("/passreset",async (req, res) => {
    try {
        // Fetch teacher data (just the email field in this case)
        const teachers = await tchr.find({}, 'email'); // Fetch only email field
        res.render('resetPassTchr', { teachers, email: "" }); // Add email: ""
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching teachers');
      }

})
router.get("/send-otp",async (req, res) => {
    try {
        // Fetch teacher data (just the email field in this case)
        const teachers = await tchr.find({}, 'email'); // Fetch only email field
        res.render('resetPassTchr', { teachers, email: "" }); // Add email: ""
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching teachers');
      }
});
router.get("/verify-otp", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in verify-otp route:", {email});
    res.render("resetPassTchr", { teachers: [], email }); // Provide empty teachers
});

router.get("/reset-password", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in reset-password route:", {email});
    res.render("resetPassTchr", { teachers: [], email }); // Provide empty teachers
});
// res.render("resetPassTchr", { email});

  router.post('/verifyemail',verifyEmail);
  router.post('/signup', upload.single('pic'), handleSignup);
  router.post('/login', handleLogin);
  router.get('/logout',handleLogout);
  router.get('/setting', isAuthenticated,handlegetUpdate);
  router.post('/setting', upload.single('pic_1'), isAuthenticated,handleUpdateAccount);
  router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Function to add user to the community




// Dashboard Route
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
      const communities = await Community.find();
      
      // Call addUserToCommunity function for each community
      for (const community of communities) {
          await addUserToCommunity(req, community._id);
      }

      res.render('tchrConsole', { user: req.user, communities });
  } catch (error) {
      console.error('Error loading dashboard:', error.message);
      res.status(500).send('Internal Server Error');
  }
});
router.post('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const { room } = req.body; // Extract community ID from the form
  
        if (!room) {
            return res.status(400).send('Community ID is required');
        }
  
        // Redirect to the chat route of the selected community
        res.redirect(`/tchr/chat/${room}`);
    } catch (error) {
        console.error('Error processing dashboard selection:', error.message);
        res.status(500).send('Internal Server Error');
    }
  });
  
  // Create Community Route
  router.post('/create', isAuthenticated, async (req, res) => {
  
      try {
        const { communityName, commDescription } = req.body;
const teacherId=req.user.id;
        // Check if a community with the same name already exists
        const existingCommunity = await Community.findOne({ communityName });

        if (existingCommunity) {
            return res.status(400).json({ message: "Community name must be unique" });
        }

        // Extract user details from the JWT token
        const userToken = getTokenFromCookies(req, 'teacher_token') ;

        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized: No valid token found" });
        }

        // Determine role and userType based on the token
        let role = 'tchr'; // Default role is student
        let userType = 'tchr';

        // if (userToken.role === 'tchr') {
        //     role = 'tchr';
        //     userType = 'tchr';
        // }
        const communities = await Community.find();
        const messages = Community.messages || []; // Ensure it's an array

        // Create new community with user details
        const newCommunity = new Community({
            communityName,
            teacherId,
            commDescription,  // Add commDescription field
            role,             // Add role field

            users: [{ userId: userToken.id, role }], // Add user with role
            totalUsers: 1
        });

        await newCommunity.save();

        res.render('chatRoom_tchr', { user: req.user, community: newCommunity,         communities ,messages// ✅ Pass all communities here
        });
    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

  
  // Chat Room Route
 router.get('/chat/:id', isAuthenticated, async (req, res) => {
     try {
           const community = await Community.findById(req.params.id)
               .populate('users.userId')
               .lean(); // Convert to plain JS object
   
           const communities = await Community.find().lean(); // Fetch all communities for sidebar
   
           if (!community) {
               return res.status(404).send('Community not found');
           }
   
           if (!req.user || !req.user.id) {
               console.error("User authentication error: req.user is missing");
               return res.redirect('/tchr/login');
           }
           const teacher = await tchr.findById(community.teacherId).lean();

           const userId = new mongoose.Types.ObjectId(req.user.id);
           let existingUser = community.users.find(u => u.userId && u.userId.equals(userId));
   
           if (!existingUser) {
               community.users.push({ userId: userId, role: req.user.role || 'tchr' });
               community.totalUsers += 1;
               await Community.updateOne({ _id: req.params.id }, { $set: { users: community.users } });
           }
   
           // Get messages from community model
           const messages = community.messages.map(msg => ({
            _id: msg._id,  // Ensure _id is included

               userId: msg.userId,
               userType: msg.userType,
               message: msg.message,
               timestamp: msg.timestamp,
               isSender: msg.userId.toString() === req.user.id.toString() // Check if the logged-in user is the sender
           }));
   
           res.render('chatRoom_tchr', { 
               user: req.user, 
               community,
               communities, // Pass communities list to the template
               messages,
               teacher,
               members: community.users
           });
   
       } catch (error) {
           console.error("Error in chat route:", error);
           res.redirect('/tchrConsole');
       }
    });
    router.post('/chat/:id/message', isAuthenticated, async (req, res) => {
        try {
                const community = await Community.findById(req.params.id);
                
                if (!community) {
                    console.error("Community not found for ID:", req.params.id);
                    return res.status(404).send('Community not found'); // Ensure return statement
                }
        
                if (!req.body.message) {
                    console.error("Message content is missing");
                    return res.status(400).send("Message cannot be empty"); // Ensure return statement
                }
        
                // Ensure user exists in community
                const user = community.users.find(u => u?.userId?.equals(req.user.id));
                if (!user) {
                    console.error("User not found in community:", req.user.id);
                    return res.status(400).send('User not found in the community'); // Ensure return statement
                }
        
                // Add message to the community
                await Community.findByIdAndUpdate(
                    req.params.id,
                    {
                        $push: {
                            messages: {
                                userId: req.user.id,
                                userType: user.role, 
                                message: req.body.message,
                            }
                        }
                    },
                    { new: true, runValidators: false } // Prevent full validation
                );
        
                return res.redirect(`/tchr/chat/${req.params.id}`); // Ensure response is only sent once
        
            } catch (error) {
                console.error("Error in posting message:", error);
        
                if (!res.headersSent) { 
                    return res.status(500).send('Failed to save message'); // Send error response only if not already sent
                }
            }
      });
      
  router.post('/leave', async (req, res) => {
      try {
          const { communityId } = req.body;
  
          // Delete the community from the database
          await Community.findByIdAndDelete(communityId);
  
          // Redirect user to console page
          res.redirect('/tchr/tchrConsole');
      } catch (error) {
          console.error(error);
          res.status(500).send('Error leaving the community');
      }
  });

  router.post('/chat/:communityId/delete-message/:messageId', isAuthenticated, async (req, res) => {
      try {
          const { communityId, messageId } = req.params;
  
          // Find the community and remove the message
          await Community.updateOne(
              { _id: communityId },
              { $pull: { messages: { _id: messageId } } } // Remove specific message
          );
  
          res.redirect(`/tchr/chat/${communityId}`);
      } catch (error) {
          console.error("Error deleting message:", error);
          res.redirect(`/tchr/chat/${req.params.communityId}`);
      }
  });
  module.exports=router;