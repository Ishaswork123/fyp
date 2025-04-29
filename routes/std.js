
const express=require('express');
const router=express.Router();
const { handleSignup,handleLogin,handleLogout,handleUpdateAccount,handlegetUpdate,verifyEmail,sendOTP, verifyOTP, resetPassword }= require('../Controller/std');
const multer = require('multer');
const path = require('path');
const Community=require('../Model/community');
const {    addUserToCommunity
}=require('../Controller/community');
const { getTokenFromCookies } = require('../config/tchr');  
const mongoose=require('mongoose');
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
const tchr=require('../Model/tchr');
const std = require('../Model/std');

function isAuthenticated(req, res, next) {
//   console.log('Cookies in request:', req.cookies);

  // Extract student token
  const student = getTokenFromCookies(req, 'student_token');

  if (student) {
    // console.log('Student authenticated:', student);
    req.user = student; // Attach user info to the request
    return next(); // Allow access to the intended route
  } else {
    // console.log('No valid token found. Redirecting to login.');
    res.clearCookie('student_token'); // Clear the student token if invalid
    return res.redirect('/std/login'); // Redirect to the login page
  }
}

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
  router.get("/passreset", async(req, res) => {
    try {
        // Fetch teacher data (just the email field in this case)
        const teachers = await std.find({}, 'email'); // Fetch only email field
        res.render('resetPassStd', { teachers, email: "" }); // Add email: ""
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching teachers');
      }
})
router.get("/send-otp",async (req, res) => {
    try {
        // Fetch teacher data (just the email field in this case)
        const teachers = await std.find({}, 'email'); // Fetch only email field
        res.render('resetPassStd', { teachers, email: "" }); // Add email: ""
      } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching teachers');
      }
});
router.get("/verify-otp", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in verify-otp route:", {email});
    res.render("resetPassStd", { teachers: [], email }); // Provide empty teachers
});

router.get("/reset-password", (req, res) => {
    const email = req.query.email || ""; // Extract email from query params, default to empty string

    console.log("Received email in reset-password route:", {email});
    res.render("resetPassStd", { teachers: [], email }); // Provide empty teachers
});
  router.post('/signup', upload.single('pic'), handleSignup);
  router.post('/login', handleLogin);
  router.get('/logout',handleLogout);
  router.get('/setting', isAuthenticated,handlegetUpdate);
  router.post('/setting', upload.single('pic_1'), isAuthenticated,handleUpdateAccount);
  router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Dashboard Route
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
      const communities = await Community.find();
      
      // Call addUserToCommunity function for each community
      for (const community of communities) {
          await addUserToCommunity(req, community._id);
      }

      res.render('stdConsole', { user: req.user, communities });
  } catch (error) {
      console.error('Error loading dashboard:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

  // Create Community Route
  router.post('/create', isAuthenticated, async (req, res) => {
  
      try {
        const { communityName, commDescription } = req.body;

        // Check if a community with the same name already exists
        const existingCommunity = await Community.findOne({ communityName });

        if (existingCommunity) {
            return res.status(400).json({ message: "Community name must be unique" });
        }

        // Extract user details from the JWT token
        const userToken = getTokenFromCookies(req, 'student_token') ;

        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized: No valid token found" });
        }

        // Determine role and userType based on the token
        let role = 'std'; // Default role is student
        let userType = 'std';

        // if (userToken.role === 'tchr') {
        //     role = 'tchr';
        //     userType = 'tchr';
        // }

        // Create new community with user details
        const newCommunity = new Community({
            communityName,
            commDescription,  // Add commDescription field
            role,             // Add role field

            users: [{ userId: userToken.id, role }], // Add user with role
            totalUsers: 1
        });

        await newCommunity.save();

        res.render('chatRoom', { user: req.user, community: newCommunity });
    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.post('/dashboard', isAuthenticated, async (req, res) => {
  try {
      const { room } = req.body; // Extract community ID from the form

      if (!room) {
          return res.status(400).send('Community ID is required');
      }

      // Redirect to the chat route of the selected community
      res.redirect(`/std/chat/${room}`);
  } catch (error) {
      console.error('Error processing dashboard selection:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/chat/:id', isAuthenticated, async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate('users.userId')
            .lean(); // Convert to plain JS object

        const communities = await Community.find().lean(); // Fetch all communities for sidebar

        if (!community) {
            return res.status(404).send('Community not found');
        }
        const teacher = await tchr.findById(community.teacherId).lean();

        if (!req.user || !req.user.id) {
            console.error("User authentication error: req.user is missing");
            return res.redirect('/std/login');
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        let existingUser = community.users.find(u => u.userId && u.userId.equals(userId));

        if (!existingUser) {
            community.users.push({ userId: userId, role: req.user.role || 'std' });
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

        res.render('chatRoom', { 
            user: req.user, 
            community,
            communities, // Pass communities list to the template
            teacher,

            messages,
            members: community.users
        });

    } catch (error) {
        console.error("Error in chat route:", error);
        res.redirect('/stdConsole');
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

        return res.redirect(`/std/chat/${req.params.id}`); // Ensure response is only sent once

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
        res.redirect('/stdConsole');
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

        res.redirect(`/std/chat/${communityId}`);
    } catch (error) {
        console.error("Error deleting message:", error);
        res.redirect(`/std/chat/${req.params.communityId}`);
    }
});
    
    // router.post('/chat/:id/message', isAuthenticated, async (req, res) => {
    //     try {
    //       const community = await Community.findById(req.params.id);
      
    //       // Add message to community's messages array
    //       community.messages.push({
    //         userId: req.user._id,
    //         // username: req.user.username,
    //         message: req.body.message,
    //       });
      
    //       await community.save();
    //       res.redirect(`/std/chat/${req.params.id}`);
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).send('Failed to save message');
    //     }
    //   });
      
  
  module.exports=router;