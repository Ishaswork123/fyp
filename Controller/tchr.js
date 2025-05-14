const bcrypt = require('bcrypt');
const validator = require('validator');
const User_Tchr = require('../Model/tchr');
const { sendVerificationEmail, sendWelcomeEmail,  sendVerificationEmail_reset,
    sendWelcomeEmail_reset, } =require("../middlewares/Email.js")
const { generateTokenAndSetCookies } =require( "../middlewares/GenerateToken.js")
const {generateTeacherToken,getTokenFromCookies,generateEmailToken, getEmailFromToken, }=require('../config/tchr')
// const { getTokenFromCookies } = require('../config/tchr');  
const Community=require('../Model/community.js');
const {    addUserToCommunity}=require('../Controller/community');
async function handleSignup(req,res){
    try {
        const { fname, lname, email, role, pwd, confirm_pwd } = req.body;
        console.log(req.body)
        let signupErrors = {};  
      let  loginErrors={}; 
      const nameRegex = /^[A-Za-z\s'-]+$/;
const repeatedCharRegex = /^([a-zA-Z])\1+$/; // matches same character repeated

// Validate First Name
if (validator.isEmpty(fname)) {
    signupErrors.fname = "First name is required";
} else if (!nameRegex.test(fname)) {
    signupErrors.fname = "First name must contain only letters, spaces, hyphens or apostrophes";
} else if (repeatedCharRegex.test(fname.trim())) {
    signupErrors.fname = "First name cannot be made of a single repeated letter";
}

// Validate Last Name
if (validator.isEmpty(lname)) {
    signupErrors.lname = "Last name is required";
} else if (!nameRegex.test(lname)) {
    signupErrors.lname = "Last name must contain only letters, spaces, hyphens or apostrophes";
} else if (repeatedCharRegex.test(lname.trim())) {
    signupErrors.lname = "Last name cannot be made of a single repeated letter";
}

        if (pwd !== confirm_pwd) signupErrors.confirm_pwd = "Passwords do not match";
    
        // Check if the user already exists
        const existingUser = await User_Tchr.findOne({ email });
        if (existingUser) signupErrors.email = "Email is already registered";
    
        // Render form with errors if there are any
        if (Object.keys(signupErrors).length > 0) {
            return res.render('tchrSignup', { signupErrors,loginErrors:{}, fname, lname, email, role, activeTab: 'signup' });
        }
    
        let pic = null;
        if (req.file) {
            pic = req.file.buffer.toString('base64');}    
        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()

        const newTchr = new User_Tchr({
            fname,
            lname,
            email,
            role,
            password: hashedPassword,  // Use the hashed password here
            pic,  // Save the picture path or URL in the model,
            verficationToken,
            verficationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        });
    
        await newTchr.save();
        generateTokenAndSetCookies(res,newTchr._id)
        await sendVerificationEmail(newTchr.email,verficationToken)
        console.log(newTchr.email);
        return res.redirect('/tchr/verifyemail');

        // res.redirectr('/tchr/login');
    } catch (error) {
        console.error("Error during signup:", error);
        res.render('tchrSignup', {
            signupErrors: { general: 'An error occurred during signup' },
            loginErrors:{},
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
        const user= await User_Tchr.findOne({
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
        res.redirect('/tchr/login');
           
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}


async function handleLogin(req, res) {
    try {
        const { email, pwd } = req.body;
        let loginErrors = {};
        let signupErrors = {};  


        console.log("Login attempt with email:", email, "and password:", pwd);

        // Validate email and password
        if (!validator.isEmail(email)) {
            loginErrors.email = "Please enter a valid email address";
        }
        if (validator.isEmpty(pwd) || !validator.isLength(pwd, { min: 8 })) {
            loginErrors.pwd = "Password must be at least 8 characters long";
        }
        if (Object.keys(loginErrors).length > 0) {
            return res.render('tchrSignup', {
                loginErrors,
                signupErrors: {},
                email,
                fname: '',
                lname: '',
                activeTab: 'login',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        console.log("Normalized Email:", normalizedEmail);

        // Query the database for the user
        const user = await User_Tchr.findOne({ email: normalizedEmail });
        // console.log("Database User:", user);

        if (!user) {
            loginErrors.general = "Invalid email or password";
            return res.render('tchrSignup', {
                loginErrors,
                email,
                fname: '',
                lname: '',
                activeTab: 'login',
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(pwd, user.password);
        if (!isMatch) {
            loginErrors.general = "Invalid email or password";
            return res.render('tchrSignup', {
                loginErrors,
                signupErrors: {},
                email,
                fname: '',
                lname: '',
                activeTab: 'login',
            });
        }
         // Extract student ID and email for the token
         const teacherId = user._id; // Assign _id from the fetched student
         const teacherEmail = user.email;
         const role=user.role;
         console.log("teachrt",teacherId,teacherEmail,role);

        const teacherToken = generateTeacherToken(teacherId, teacherEmail, role);
        console.log("Generated Token:", teacherToken);
        res.cookie('teacher_token', teacherToken, { httpOnly: true, secure: false, maxAge: 3600000 });

        console.log("Token set in Teachercookie");

        res.redirect('/tchr/tchrConsole');
    } catch (error) {
        console.error("Error during user login:", loginErrors);
        res.status(500).render('tchrSignup', {
            loginErrors: { general: "An internal error occurred. Please try again later." },
            email: req.body.email || '',
            fname: '',
            lname: '',
            activeTab: 'login',
        });
    }
}



function handleLogout(req, res) {
    res.clearCookie('token');

    // Redirect to the home page or login page after logout
    res.redirect('/');
}


async function handleProfileTchr (req, res, showAllExperiments = false) {
    try {
        const teacher = await User_Tchr.findById(req.user.id);
        // console.log(teacher);

        if (!teacher) {
            return res.status(404).send("User not found");
        }
 const communities = await Community.find();
        
        // Call addUserToCommunity function for each community
        for (const community of communities) {
            await addUserToCommunity(req, community._id);
        }
  
        // Profile picture logic
        const profilePic = teacher.pic
            ? `data:image/jpeg;base64,${teacher.pic}`
            : '/images/profile.jpg';

         // Experiment Data
         const experiments = [
            { id: "penExp", exp_no: "1", title: "Pendulum", description: "Verification of the laws of simple pendulum", image: "/images/pend.jpg" },
            { id: "massExp", exp_no: "2", title: "Mass Spring System", description: "To determine the acceleration due to gravity by oscillating mass spring system", image: "/images/mass2.jpg" },
            { id: "meterExp", exp_no: "3", title: "Meter Rod Method", description: "Verify the conditions of equilibrium by suspended meter rod method", image: "/images/physic-meter-rod.jpg" },
            { id: "forceExp", exp_no: "4", title: "Force Table", description: "To find the unknown weight of a body by the method of rectangular component of forces", image: "/images/incline-plane.jpg" },
            { id: "inclineExp", exp_no: "5", title: "Resonance Exp", description: "Determine the velocity of sound at 0 degree C by resonance tube apparatus", image: "/images/resonance.jpg" },
                        { id: "Arch", exp_no: "6", title: "Archimedes’ Principle", description: "Verification of Archimedes' Principle and Buoyant Force", image: "/images/coming.jpeg" }

          ];
          
              
        // Random experiments logic
        const experimentsToShow = showAllExperiments
            ? experiments
            : experiments.sort(() => 0.5 - Math.random()).slice(0, 3);

        // Render the EJS template
        res.render("tchrConsole", {
            name: teacher.fname + " " + teacher.lname,
            email: teacher.email,
            role: teacher.role,
            joinDate: teacher.createdAt,
            profilePic: profilePic,
            experiments: experiments, // Send ALL experiments
            initiallyShowAll: false, // Just a flag for initial state
            user: req.user, communities
        });
    } catch (err) {
        console.error("Error in handleTchrController:", err);
        res.status(500).send("Server error");
    }
};


async function handlegetUpdate(req, res) {
   try{ 
    const userid=req.user.id;
    // const userId = getTokenFromCookies(req);

    const user = await User_Tchr.findById(userid);
    if (!user) {
        return res.status(404).send('User not found.');
    }

    res.render('updateTchr', {
        fname: user.fname,
        lname: user.lname,
        // email: user.email,
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
        const user = await User_Tchr.findById(userId);
        // console.log('Fetched user:', user);
        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).send('User not found.');
        }

        // Prepare update data
        const updateData = {};
        if (fname_1 || lname_1) {
            console.log('Updating username:', fname_1);
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
        const updatedUser = await User_Tchr.findByIdAndUpdate(
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
        const newToken = generateTeacherToken(updatedUser._id,updatedUser.email,updatedUser.role);
        console.log('Generated new token:', newToken);

        res.cookie('token', newToken, { httpOnly: true });
        console.log('Token set in cookies.');

        // Redirect to teacher console
        console.log('Redirecting to teacher console...');
        res.redirect('/tchr/tchrConsole');
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

    const user = await User_Tchr.findOne({email});
    if (!user) return res.status(404).send("User not found");

    const otp = generateOTP();
    otpStorage[email] = otp;

    await sendVerificationEmail_reset(user.email, otp);
    res.redirect(`/tchr/verify-otp?email=${encodeURIComponent(user.email)}`);
};

// Verify OTP and Send Welcome Email
async function verifyOTP  (req, res) {
    const { code } = req.body;
    
    const email = req.query.email; // Get email from query params
console.log("email and otp",email,code )
    if (!email || !code) return res.status(400).send("Email and OTP are required");

    const user = await User_Tchr.findOne({ email }); // Ensure correct query
    console.log("email from route2",user)


    if (!user) return res.status(404).send("User not found");
    if (otpStorage[email] !== code) return res.status(400).send("Invalid OTP");

    delete otpStorage[email];
    await sendWelcomeEmail_reset(user.email, user.fname);

    res.redirect(`/tchr/reset-password?email=${encodeURIComponent(user.email)}`);
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

    const user = await User_Tchr.findOne({ email });
    console.log("user from route3", user);
    if (!user) return res.status(404).send("User not found");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in MongoDB
    const updateResult = await User_Tchr.updateOne(
        { email: email }, // Find user by email
        { $set: { password: hashedPassword } } // Update the password field
    );

    if (updateResult.modifiedCount === 0) {
        return res.status(500).send("Failed to update password");
    }

    res.redirect("/tchr/login"); // Redirect to login after successful reset}
}






















module.exports=
{ handleSignup,handleLogin,handleLogout,handleProfileTchr
    ,handleUpdateAccount,handlegetUpdate,verifyEmail
,sendOTP, verifyOTP, resetPassword }
