const bcrypt = require('bcrypt');
const validator = require('validator');
const User_Tchr = require('../Model/tchr');
const { sendVerificationEmail, sendWelcomeEmail } =require("../middlewares/Email.js")
const { generateTokenAndSetCookies } =require( "../middlewares/GenerateToken.js")
const {generateTeacherToken,getTokenFromCookies,generateEmailToken, getEmailFromToken, }=require('../config/tchr')

async function handleSignup(req,res){
    try {
        const { fname, lname, email, role, pwd, confirm_pwd } = req.body;
        console.log(req.body)
        let signupErrors = {};  
      let  loginErrors={}; 
        // Validate fields
        if (validator.isEmpty(fname)) signupErrors.fname = "First name is required";
        if (validator.isEmpty(lname)) signupErrors.lname = "Last name is required";
        if (!validator.isEmail(email)) signupErrors.email = "Please enter a valid email address";
        if (!validator.isLength(pwd, { min: 8 }) || !validator.isStrongPassword(pwd)) {
            signupErrors.pwd = "Password must be at least 8 characters, with one uppercase letter, one number, and one special character.";
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

        // res.redirect('/tchr/login');
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

}async function verifyEmail(req,res){
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

        // Profile picture logic
        const profilePic = teacher.pic
            ? `data:image/jpeg;base64,${teacher.pic}`
            : '/images/default-profile-icon.jpg';

        // All experiments
        const experiments = [
            { id: "penExp", title: "Pendulum", description: "Verification of the laws of simple pendulum", image: "/images/course_1.jpg" },
            { id: "massExp", title: "Mass Spring System", description: "To determine the acceleration due to the gravity by oscillating mass spring system: ", image: "/images/course_2.jpg" },
            { id: "meterExp", title: "Meter Rod Method", description: " Verify the conditions of equilibrium by suspended meter rod method: ", image: "/images/course_3.jpg" },
            { id: "forceExp", title: "Force Table", description: "To find the unknown weight of a body by the method of rectangular component of forces: ", image: "/images/course_4.jpg" },
            { id: "inclineExp", title: "Resonance Exp", description: " Determine the velocity of sound at 0 degree C by resonance Tube  apparatus using first resonance position and applying end correction: "
                , image: "/images/course_5.jpg" }
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
            experiments: experimentsToShow,
            allExperiments: showAllExperiments
        });
    } catch (err) {
        console.error("Error in handleTchrController:", err);
        res.status(500).send("Server error");
    }
};


async function handlegetUpdate(req, res) {
   try{ 
    const userId = getTokenFromCookies(req);

    const user = await User_Tchr.findById(userId);
    if (!user) {
        return res.status(404).send('User not found.');
    }

    res.render('updateTchr', {
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
        const user = await User_Tchr.findById(userId);
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
        const newToken = generateToken(updatedUser._id);
        console.log('Generated new token:', newToken);

        res.cookie('token', newToken, { httpOnly: true });
        console.log('Token set in cookies.');

        // Redirect to teacher console
        console.log('Redirecting to teacher console...');
        res.redirect('/tchrConsole');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error.');
    }
}


module.exports=
{ handleSignup,handleLogin,handleLogout,handleProfileTchr
    ,handleUpdateAccount,handlegetUpdate,verifyEmail}
