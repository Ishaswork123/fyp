// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const jwt=require('jsonwebtoken');


const express=require('express');
const app=express();
// const bodyParser = require("body-parser");
const path =require('path');


const bodyParser = require('body-parser');


const {getTokenFromCookies
} =require('./config/tchr');
const { connectToMongoBb } = require("./connection");

// router imports 

const tchrRoute=require('./routes/tchr');
const stdRoute=require('./routes/std');
const expRoute=require('./routes/exp');
const tchrQUiz=require('./routes/tchrQuiz');
const stdQuiz=require('./routes/stdQuiz');
const guidedRoute=require('./routes/guidedExp')
const classRoom=require('./routes/classroom')
const stdClass=require('./routes/classStd');
const stdRes=require('./routes/learningStd');
const expRes=require('./routes/expResult');
const stdRes1=require('./routes/stdResult');
const tchrUpload=require('./routes/learning');
// Model Imports 
const {handleProfile}=require('./Controller/std');
const {handleProfileTchr}=require('./Controller/tchr');
const LearningMaterial=require('./Model/learning');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const Community = require('./Model/community');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinCommunity', (communityId) => {
    socket.join(communityId);
  });

  socket.on('sendMessage', async ({ communityId, message, userId, role }) => {
    const newMessage = {
      senderId: userId,
      senderRole: role,
      content: message,
      timestamp: new Date()
    };

    await Community.findByIdAndUpdate(communityId, {
      $push: { messages: newMessage }
    });

    io.to(communityId).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get("/resource/:exp_no", async(req,res)=>{
    try {
        const expId = req.params.exp_no; // Fetch experiment number from URL params
        console.log("Experiment ID:", expId);

        // Find learning materials for the given experiment number
        const materials = await LearningMaterial.find({ exp_no: expId });

        console.log("Materials Found:", materials);

        // Render the resource page and pass materials to the EJS template
        res.render("resource", { materials });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Server Error");
    }
}

);


app.use(cookieParser());

// Use cookie-parser middleware
// app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded form submissions
// app.use(bodyParser.json()); // For JSON bodies
  // Connect to MongoDB
  connectToMongoBb("mongodb://127.0.0.1:27017/fyp")
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });


    app.set("views", path.join(__dirname, "/Views")); 

    app.set("view engine", "ejs");

    app.use(express.static(path.join(__dirname, 'public')));

    // app.use(bodyParser.json());
    
    
    app.use(express.urlencoded({ extended: true })); // For URL-encoded form data
    app.use(express.json()); // For JSON data
   app.use((req, res, next) => {
  const cspValue = [
    "default-src 'self'",
    "connect-src 'self' ws://localhost:5008",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://stackpath.bootstrapcdn.com",
    "script-src 'self' 'unsafe-inline' http://localhost:5004/js https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://ajax.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/popper.js https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic https://kit.fontawesome.com",
    "img-src 'self' data: https://media.istockphoto.com https://5004",
    "frame-ancestors 'self' http://localhost:5012"
  ].join('; ');

  res.setHeader("Content-Security-Policy", cspValue);
  next();
});

    
    
  // app.use((req, res, next) => {
  //   console.log('Request Headers:', req.headers);
  //   console.log('Request Cookies:', req.cookies);
  //   next();
  // });
  
    


    // Experiment Data
const experiments = [
  { id: "penExp", title: "Pendulum", description: "Verification of the laws of simple pendulum", image: "/images/course_1.jpg" },
  { id: "massExp", title: "Mass Spring System", description: "To determine the acceleration due to the gravity by oscillating mass spring system: ", image: "/images/course_2.jpg" },
  { id: "meterExp", title: "Meter Rod Method", description: " Verify the conditions of equilibrium by suspended meter rod method: ", image: "/images/course_3.jpg" },
  { id: "forceExp", title: "Force Table", description: "To find the unknown weight of a body by the method of rectangular component of forces: ", image: "/images/course_4.jpg" },
  { id: "inclineExp", title: "Resonance Exp", description: " Determine the velocity of sound at 0 degree C by resonance Tube  apparatus using first resonance position and applying end correction: "
      , image: "/images/course_5.jpg" }
];

function isAuthenticated(req, res, next) {
  console.log('Cookies in request:', req.cookies);

  const teacher = getTokenFromCookies(req, 'teacher_token');
  const student = getTokenFromCookies(req, 'student_token');

  if (teacher) {
    console.log('Teacher authenticated:', teacher);
    req.user = teacher;
    return next(); // Allow access to any route
  } else if (student) {
    console.log('Student authenticated:', student);
    req.user = student;
    return next(); // Allow access to any route
  } else {
    console.log('No valid token found. Redirecting to login.');
    res.clearCookie('teacher_token');
    res.clearCookie('student_token');
    return res.redirect('/');
  }
}



    

// Home button route handler
app.get('/home', (req, res) => {
  try {
    // Check for authentication tokens
    const teacherToken = getTokenFromCookies(req, 'teacher_token');
    const studentToken = getTokenFromCookies(req, 'student_token');
    
    // If no tokens, redirect to login
    if (!teacherToken && !studentToken) {
      console.log('No valid token found. Redirecting to login.');
      res.clearCookie('teacher_token');
      res.clearCookie('student_token');
      return res.redirect('/');
    }
    
    // Determine user type and redirect accordingly
    if (teacherToken) {
      console.log('Teacher detected. Redirecting to teacher console.');
      return res.redirect('/tchr/tchrConsole');
    } else {
      console.log('Student detected. Redirecting to student console.');
      return res.redirect('/stdConsole');
    }
  } catch (error) {
    console.error('Error in home redirect:', error);
    res.clearCookie('teacher_token');
    res.clearCookie('student_token');
    return res.redirect('/');
  }
});

     app.get('/',(req,res)=>{
        res.render('Home');
    })


app.use('/tchr',tchrRoute);
app.use('/std',stdRoute);
app.use('/exp',expRoute);
app.use('/tchr',tchrQUiz);
app.use('/std',stdQuiz);
app.use('/guided',guidedRoute);
app.use('/classroom',classRoom);
// app.get('/stdConsole',isAuthenticated,handleProfile);
app.use('/tchr',tchrUpload);
app.use('/std',stdClass);
app.use('/std',stdRes);
app.use('/tchr',expRes);
app.use('/std',stdRes1);


app.get('/tchr/tchrConsole', isAuthenticated,(req, res) => {
  handleProfileTchr(req, res, ); // Pass `false` to show only 3 random experiments
});

// Route to display all experiments
app.get('/view-all', isAuthenticated, async(req, res) => {
  handleProfileTchr(req, res, true); // Pass `true` to show all experiments
});

// app.get('/view-all-test', isAuthenticated, (req, res) => {
//   res.send('Route works!');
// });

// Route for showing only a few experiments
app.get('/stdConsole', isAuthenticated, (req, res) => handleProfile(req, res));

// Route for showing all experiments
app.get('/std/view-all', isAuthenticated, (req, res) => handleProfile(req, res, true));

// app.use((req, res, next) => {
//   console.log(`Request received: ${req.method} ${req.url}`);
//   next();
// });

 // Catch all undefined routes (404 error)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found', url: req.url });
});
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack || err); // Optional: Log it
  res.status(500).render('error', {
    title: 'Server Error',
    message: err.message || 'Something went wrong!',
    url: req.originalUrl,
  });
});

// General error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error-server', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {} 
      // show full error only in development mode
  });
});
const PORT = process.env.PORT || 5013;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});