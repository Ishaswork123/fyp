const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User=require('../Model/std');


// Local strategy for login
function initialize(passport){
    const authenticateUser =(email,pwd ,done)=>{

    }
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pwd',
authenticateUser}, async (email, pwd, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(pwd, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}))};

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
module.exports=
    initialize