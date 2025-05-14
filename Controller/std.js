const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../Model/std');
const Teacher=require('../Model/tchr');
const { sendVerificationEmail, sendWelcomeEmail ,  sendVerificationEmail_reset,
    sendWelcomeEmail_reset,} =require("../middlewares/Email.js")
const { generateTokenAndSetCookies } =require( "../middlewares/GenerateToken.js")
const {generateToken,getTokenFromCookies,generateStudentToken}=require('../config/tchr')
const Community=require('../Model/community.js');
const {    addUserToCommunity}=require('../Controller/community');
async function handleSignup(req,res){
    try {
        const { fname, lname, email, pwd, confirm_pwd } = req.body;
        console.log(req.body)
        let signupError = {};  
      let  loginError={}; 
        // Validate fields
        const nameRegex = /^[A-Za-z\s'-]+$/;
        const repeatedCharRegex = /^([a-zA-Z])\1+$/; // matches same character repeated
        
        // Validate First Name
        if (validator.isEmpty(fname)) {
            signupError.fname = "First name is required";
        } else if (!nameRegex.test(fname)) {
            signupError.fname = "First name must contain only letters, spaces, hyphens or apostrophes";
        } else if (repeatedCharRegex.test(fname.trim())) {
            signupError.fname = "First name cannot be made of a single repeated letter";
        }
        
        // Validate Last Name
        if (validator.isEmpty(lname)) {
            signupErrors.lname = "Last name is required";
        } else if (!nameRegex.test(lname)) {
            signupError.lname = "Last name must contain only letters, spaces, hyphens or apostrophes";
        } else if (repeatedCharRegex.test(lname.trim())) {
            signupError.lname = "Last name cannot be made of a single repeated letter";
        }
        
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
async function handleProfile(req, res, allExperiments = false) {
    try {
        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).send('User not found');
        }

        const teachers = await Teacher.aggregate([{ $sample: { size: 2 } }]);
        const communities = await Community.find();
        for (const community of communities) {
            await addUserToCommunity(req, community._id);
        }

        // Experiment Data
        const experiments = [
            { id: "penExp", exp_no: "1", title: "Pendulum", description: "Verification of the laws of simple pendulum", image: "/images/pend.jpg" },
            { id: "massExp", exp_no: "2", title: "Mass Spring System", description: "To determine the acceleration due to gravity by oscillating mass spring system", image: "/images/mass2.jpg" },
            { id: "meterExp", exp_no: "3", title: "Meter Rod Method", description: "Verify the conditions of equilibrium by suspended meter rod method", image: "/images/physic-meter-rod.jpg" },
            { id: "forceExp", exp_no: "4", title: "Force Table", description: "To find the unknown weight of a body by the method of rectangular component of forces", image: "/images/incline-plane.jpg" },
            { id: "inclineExp", exp_no: "5", title: "Resonance Exp", description: "Determine the velocity of sound at 0 degree C by resonance tube apparatus", image: "/images/resonance.jpg" },
                                    { id: "Arch", exp_no: "6", title: "Archimedes’ Principle", description: "Verification of Archimedes' Principle and Buoyant Force", image: "/images/coming.jpeg" }

          ];
          

        const profilePic = student.pic ? `data:image/jpeg;base64,${student.pic}` : '/images/default-profile-icon.jpg';

        // Only show first three experiments in stdConsole, all in std/view-all

        res.render('stdConsole', {
            name: student.fname + ' ' + student.lname,
            email: student.email,
            joinDate: student.createdAt,
            profilePic: profilePic,
            teachers: teachers,
            user: req.user,
            communities: communities,
            experiments: experiments, // Send ALL experiments
            initiallyShowAll: false, // Set to true or false based on your needs       
             });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}


async function handlegetUpdate(req, res) {
    try{ 
        const userid=req.user.id;
    //  const userId = getTokenFromCookies(req);
 
     const user = await User.findById(userid);
     if (!user) {
         return res.status(404).send('User not found.');
     }
 
     res.render('updateStd', {
         fname: user.fname,
         lname: user.lname,
        //  email: user.email,
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
         const userId = req.user.id;
         console.log('Extracted userId:', userId);
         if (!userId) {
             console.log('User ID not found. Redirecting to login.');
             return res.status(403).redirect('/tchr/login');
         }
 
         // Extract form data
         const { fname_1,lname_1, pwd_1, pwd_2 } = req.body;
         const file = req.file; // This handles the uploaded file (field name is "pic_1")
         console.log('Form data received:', { fname_1,lname_1, pwd_1, pwd_2,file });
 
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
         if (fname_1 || lname_1) {
             console.log('Updating email:', fname_1,lname_1);
             updateData.fname = fname_1;
             updateData.lname = lname_1;

         }
 
         if (file) {
            console.log('Updating profile picture from uploaded file.');
            updateData.pic = file.buffer.toString('base64');
        } else if (!user.pic) {
            console.log('No current image found. Using default profile picture.');
            updateData.pic = '/images/profile.jpg'; // fallback image
        } else {
            console.log('Retaining existing profile picture.');
            updateData.pic = user.pic;
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
         const newToken = generateStudentToken(updatedUser._id);
         console.log('Generated new token:', newToken);
 
         res.cookie('token', newToken, { httpOnly: true });
         console.log('Token set in cookies.');
 
         // Redirect to teacher console
         console.log('Redirecting to student console...');
         res.redirect('/stdConsole');
     } catch (error) {
         console.error('Error updating user:', error);
         res.status(500).send('Server error.');
     }
 }
 
 const otpStorage = {};

// Function to generate a 6-digit OTP
function generateOTP  ()  {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to Email
async function sendOTP (req, res)  {
    const { email } = req.body;
    if (!email) return res.status(400).send("Email is required");

    const user = await User.findOne({email});
    if (!user) return res.status(404).send("User not found");

    const otp = generateOTP();
    otpStorage[email] = otp;

    await sendVerificationEmail_reset(user.email, otp);
    res.redirect(`/std/verify-otp?email=${encodeURIComponent(user.email)}`);
};

// Verify OTP and Send Welcome Email
async function verifyOTP  (req, res) {
    const { code } = req.body;
    
    const email = req.query.email; // Get email from query params
// console.log("email and otp",email,code )
    if (!email || !code) return res.status(400).send("Email and OTP are required");

    const user = await User.findOne({ email }); // Ensure correct query
    // console.log("email from route2")


    if (!user) return res.status(404).send("User not found");
    if (otpStorage[email] !== code) return res.status(400).send("Invalid OTP");

    delete otpStorage[email];
    await sendWelcomeEmail_reset(user.email, user.fname);

    res.redirect(`/std/reset-password?email=${encodeURIComponent(user.email)}`);
};

// Reset Password
async function resetPassword  (req, res)  {
    const { newPassword, confirmPassword } = req.body;
    const email = req.query.email; // Get email from query params

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).send("All fields are required");
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    const user = await User.findOne({ email });
    // console.log("user from route3", user);
    if (!user) return res.status(404).send("User not found");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in MongoDB
    const updateResult = await User.updateOne(
        { email: email }, // Find user by email
        { $set: { password: hashedPassword } } // Update the password field
    );

    if (updateResult.modifiedCount === 0) {
        return res.status(500).send("Failed to update password");
    }

    res.redirect("/std/login"); // Redirect to login after successful reset}
}




module.exports=
{ handleSignup,handleLogin,handleLogout
    ,handleProfile,
    handleUpdateAccount,handlegetUpdate,
    verifyEmail,sendOTP, verifyOTP, resetPassword
}
