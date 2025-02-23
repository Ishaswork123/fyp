// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const jwt=require('jsonwebtoken');


const express=require('express');
const app=express();
const session = require("express-session");
const MongoStore = require('connect-mongo');

const mongoose =require('mongoose');
const bcrypt = require("bcrypt");
// const bodyParser = require("body-parser");
const path =require('path');

const http = require('http');
const socketIo = require('socket.io');
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

const tchrUpload=require('./routes/learning');
// Model Imports 
const {handleProfile}=require('./Controller/std');
const {handleProfileTchr}=require('./Controller/tchr');

const cookieParser = require('cookie-parser');
const tchr = require('./Model/tchr');
const std = require('./Model/std');
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
          "script-src 'self' 'unsafe-inline' http://localhost:5004/js https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://ajax.googleapis.com https://cdnjs.cloudflare.com/ajax/libs/popper.js https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic",
          "img-src 'self' data: https://media.istockphoto.com https://5004",
          "frame-ancestors 'none'"
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
    if (req.path !== '/tchr/tchrConsole') {
      return res.redirect('/tchr/tchrConsole');
    }
    return next();
  } else if (student) {
    console.log('Student authenticated:', student);
    req.user = student;
    if (req.path !== '/stdConsole') {
      return res.redirect('/stdConsole');
    }
    return next();
  } else {
    console.log('No valid token found. Redirecting to login.');
    res.clearCookie('teacher_token');
    res.clearCookie('student_token');
    return res.redirect('/login');
  }
}



    



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
app.get('/stdConsole',isAuthenticated,handleProfile);
app.use('/tchr',tchrUpload);
app.use('/std',stdClass);
app.use('/std',stdRes);
app.use('/tchr',expRes);


app.get('/tchr/tchrConsole', isAuthenticated, (req, res) => {
  handleProfileTchr(req, res, false); // Pass `false` to show only 3 random experiments
});

// Route to display all experiments
app.get('/view-all', isAuthenticated, (req, res) => {
  handleProfileTchr(req, res, true); // Pass `true` to show all experiments
});
app.get('/std/view-all', isAuthenticated, (req, res) => {
  handleProfile(req, res, true); // Pass `true` to show all experiments
});
// app.use((req, res, next) => {
//   console.log(`Request received: ${req.method} ${req.url}`);
//   next();
// });

 // Catch all undefined routes (404 error)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found', url: req.url });
});
const PORT = process.env.PORT || 5014;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});