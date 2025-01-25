const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../Model/std');
const Teacher=require('../Model/tchr');
const { sendVerificationEmail, sendWelcomeEmail } =require("../middlewares/Email.js")
const { generateTokenAndSetCookies } =require( "../middlewares/GenerateToken.js")
const {generateToken,getTokenFromCookies,generateStudentToken}=require('../config/tchr')

async function handleSignup(req,res){
    try {
        const { fname, lname, email, pwd, confirm_pwd } = req.body;
        console.log(req.body)
        let signupError = {};  
      let  loginError={}; 
        // Validate fields
        if (validator.isEmpty(fname)) signupError.fname = "First name is required";
        if (validator.isEmpty(lname)) signupError.lname = "Last name is required";
        if (!validator.isEmail(email)) signupError.email = "Please enter a valid email address";
        if (!validator.isLength(pwd, { min: 8 }) || !validator.isStrongPassword(pwd)) {
            signupError.pwd = "Password must be at least 8 characters, with one uppercase letter, one number, and one special character.";
        }

        if (pwd !== confirm_pwd) signupError.confirm_pwd = "Passwords do not match";
    
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) signupError.email = "Email is already registered";
    
        // Render form with errors if there are any
        if (Object.keys(signupError).length > 0) {
            return res.render('stdSignup', { signupError,
                loginError : {}, fname, lname, email, activeTab: 'signup' });
        }
    
        let pic = null;
        if (req.file) {
            pic = req.file.buffer.toString('base64');}    
        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()

        const newTchr = new User({
            fname,
            lname,
            email,
            
            password: hashedPassword,  // Use the hashed password here
            pic,  // Save the picture path or URL in the model
            verficationToken,
            verficationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        });
    
        await newTchr.save();
        generateTokenAndSetCookies(res,newTchr._id)
        await sendVerificationEmail(newTchr.email,verficationToken)
        console.log(newTchr.email);
        return res.redirect('/std/verifyemail');

    } catch (error) {
        console.error("Error during signup:", error);
        res.render('stdSignup', {
            signupError: { general: 'An error occurred during signup' },
            loginError:{},
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,

            activeTab: 'signup'  // Ensure activeTab is passed here to keep the signup tab active
        });
      }

}

async function verifyEmail(req,res){
    try {
        const {code}=req.body 
        const user= await User.findOne({
            verficationToken:code,
            verficationTokenExpiresAt:{$gt:Date.now()}
        })
        if (!user) {
            return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
                
            }
          
     user.isVerified=true;
     user.verficationToken=undefined;
     user.verficationTokenExpiresAt=undefined;
     await user.save()
     await sendWelcomeEmail(user.email,user.fname)
        res.redirect('/std/login');
           
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}

async function handleLogin(req, res, next) {
    try {
        const { email, pwd } = req.body;
        let signupError = {};  
        let  loginError={};         console.log(email,pwd);

        // Email validation using validator
        if (!validator.isEmail(email)) {
            loginError.email = "Please enter a valid email address";
        }

        // Password validation
        if (validator.isEmpty(pwd) || !validator.isLength(pwd, { min: 8 })) {
            loginError.pwd = "Password must be at least 8 characters long";
        }

        // If there are validation errors, render the login form with errors
        if (Object.keys(loginError).length > 0) {
            return res.render('stdSignup', {
                loginError,
                signupError:{},
                                email,
                fname: '',
                lname: '',
                activeTab: 'login'
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            loginError.general = "Invalid email or password";
            return res.render('stdSignup', {
                loginError,
                signupError:{},
                email,
                fname: '',
                lname: '',
                activeTab: 'login'
            });
        }

        console.log(user)
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(pwd, user.password);
        if (!isMatch) {
            loginError.general = "Invalid email or password";
            return res.render('stdSignup', {
                loginError,
                signupError:{},
                email,
                fname: '',
                lname: '',
                activeTab: 'login'
            });
        }
 // Extract student ID and email for the token
 const studentId = user._id; // Assign _id from the fetched student
 const studentEmail = user.email;
 console.log('student',studentId,studentEmail);
        // Generate JWT token
        const studentToken = generateStudentToken(studentId, studentEmail);
             console.log('Generated student Token1:',studentToken);  // Check if the token is being generated

// Set the token in an HTTP-only cookie
res.cookie('student_token', studentToken, { httpOnly: true, maxAge: 3600000
    ,  secure: process.env.NODE_ENV === 'production', // Ensure it's true in production

 });   
console.log('Token set in cookie1');


        // Redirect to the user's dashboard after successful login
        res.redirect('/stdConsole');
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).render('stdSignup', {
            loginError: { general: "An internal error occurred. Please try again later." },
            email: req.body.email || '',
            signupError:{},
            fname: '',
            lname: '',
            activeTab: 'login',
        });
    }
}

function handleLogout(req, res) {
    res.clearCookie('token_1');

    // Redirect to the home page or login page after logout
    res.redirect('/');
}

async function handleProfile(req, res) {
    try {
        // console.log("Authenticated, rendering console page");

        // Fetch the logged-in student based on the JWT user ID
        const student = await User.findById(req.user.id);  // Use req.userId here
        console.log(student)

        if (!student) {
            return res.status(404).send('User not found');
        }

        // Fetch two random teachers from the database
        const teachers = await Teacher.aggregate([{ $sample: { size: 2 } }]); // Randomly fetch 2 teachers

        // Check if a profile picture exists for the student, or use a default one
        const profilePic = student.pic ? `data:image/jpeg;base64,${student.pic}` : '/images/default-profile-icon.jpg';

        // Pass the necessary data to the EJS template for the sidebar and teachers
        res.render('stdConsole', {
            name: student.fname + ' ' + student.lname,
            email: student.email,
            joinDate: student.createdAt,
            profilePic: profilePic,  // Profile picture path
            teachers: teachers      // Pass the teachers data to the template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

async function handlegetUpdate(req, res) {
    try{ 
     const userId = getTokenFromCookies(req);
 
     const user = await User.findById(userId);
     if (!user) {
         return res.status(404).send('User not found.');
     }
 
     res.render('updateStd', {
         fname: user.fname,
         lname: user.lname,
         email: user.email,
         pic: user.pic,
     });
    }
 catch (error) {
     console.error('Error fetching user data:', error);
     res.status(500).send('Server error.');
 }
 }
 
 
 
 async function handleUpdateAccount(req, res) {
     try {
         console.log('Starting account update process...');
         
         // Extract user ID from the token
         const userId = getTokenFromCookies(req);
         console.log('Extracted userId:', userId);
         if (!userId) {
             console.log('User ID not found. Redirecting to login.');
             return res.status(403).redirect('/tchr/login');
         }
 
         // Extract form data
         const { email_1, pwd_1, pwd_2 } = req.body;
         const file = req.file; // This handles the uploaded file (field name is "pic_1")
         console.log('Form data received:', { email_1, pwd_1, pwd_2,file });
 
         const errors = {};
 
         // Validate password match
         if (pwd_1 && pwd_2 && pwd_1 !== pwd_2) {
             console.log('Password validation failed: passwords do not match.');
             errors.password = "Passwords do not match!";
         }
 
         // Check for validation errors
         if (Object.keys(errors).length > 0) {
             console.log('Validation errors:', errors);
             return res.render('updateTchr', { errors });
         }
 
         // Fetch the user
         const user = await User.findById(userId);
         // console.log('Fetched user:', user);
         if (!user) {
             console.log('User not found for ID:', userId);
             return res.status(404).send('User not found.');
         }
 
         // Prepare update data
         const updateData = {};
         if (email_1) {
             console.log('Updating email:', email_1);
             updateData.email = email_1;
         }
 
         if (file) {
             console.log('Updating profile picture from uploaded file.');
             updateData.pic_1 = file.buffer.toString('base64');
         } else if (!user.pic) {
             console.log('No current image found. Using default profile picture.');
             updateData.pic_1 = '/images/default-profile-icon.jpg'; // Replace with actual default image in base64 or URL
         } else {
             console.log('Retaining existing profile picture.');
             updateData.pic_1 = user.pic;
         }
 
         if (pwd_1) {
             console.log('Hashing new password...');
             const salt = await bcrypt.genSalt(10);
             updateData.password = await bcrypt.hash(pwd_1, salt);
         }
 
         console.log('Prepared update data:', updateData);
 
         // Update user in the database
         const updatedUser = await User.findByIdAndUpdate(
             userId,
             updateData,
             { new: true, runValidators: true }
         );
         console.log('Updated user data:', updatedUser);
 
         if (!updatedUser) {
             console.log('Update failed for user ID:', userId);
             return res.status(404).send('User not found or update failed.');
         }
 
         // Generate a new token with updated data
         const newToken = generateToken(updatedUser._id);
         console.log('Generated new token:', newToken);
 
         res.cookie('token', newToken, { httpOnly: true });
         console.log('Token set in cookies.');
 
         // Redirect to teacher console
         console.log('Redirecting to teacher console...');
         res.redirect('/stdConsole');
     } catch (error) {
         console.error('Error updating user:', error);
         res.status(500).send('Server error.');
     }
 }
 
 
module.exports=
{ handleSignup,handleLogin,handleLogout
    ,handleProfile,
    handleUpdateAccount,handlegetUpdate,
    verifyEmail
}
