const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Function to generate JWT token with role
function generateToken(id, email) {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateTeacherToken(id, email, role) {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateStudentToken(id, email) {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
// // Function to extract and verify token from cookies
//  @param {Object} 
// req - The request object.
//   @param {Array} [cookieNames] 
// // - Optional array of cookie names to check.
//  * @returns {Object|null} 
// // - The decoded token payload, or null if no valid token is found.
function getTokenFromCookies(req, cookieName) {
    const token = req.cookies[cookieName];
    if (!token) {
      // console.log(`Token not found in cookie: ${cookieName}`);
      return null;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Valid token found in cookie "${cookieName}":`, decoded);
      return decoded; // Return decoded payload
    } catch (err) {
      console.error(`Invalid token in cookie "${cookieName}":`, err.message);
      return null;
    }
  }
  
module.exports = {generateTeacherToken, getTokenFromCookies,generateStudentToken };
