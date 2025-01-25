const springExp = require('../Model/springExp');
const User = require('../Model/std');
const { getTokenFromCookies } = require('../config/tchr'); // Adjust path if needed

async function handle_Save_Spring_Exp(req, res) {
  const {
    mass1, initialLength1, finalLength1, extension1, trial1Time1, trial2Time1,
    meanTime1, timePeriod1, gravity1, mass2, initialLength2, finalLength2,
    extension2, trial1Time2, trial2Time2, meanTime2, timePeriod2, gravity2,
    mass3, initialLength3, finalLength3, extension3, trial1Time3, trial2Time3,
    meanTime3, timePeriod3, gravity3
  } = req.body;

  console.log("Request body: ", req.body); // Debug log

  try {
    // Attempt to extract token from 'student_token' or 'teacher_token' cookies
    let decoded = getTokenFromCookies(req, 'student_token');
    if (!decoded) {
      decoded = getTokenFromCookies(req, 'teacher_token');
    }

    if (!decoded) {
      return res.status(401).send('Unauthorized: Invalid or missing token');
    }

    console.log("Decoded token: ", decoded); // Debug log for decoded token

    // Check if the user is a student
    if (!decoded.id || !decoded.email) {
      return res.status(403).send('Forbidden: Invalid token payload');
    }

    // Find the user (student) based on the ID from the token payload
    const student = await User.findById(decoded.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    const newEntry = new springExp({
      student_id: decoded.id,
      mass1, initialLength1, finalLength1, extension1, trial1Time1, trial2Time1,
      meanTime1, timePeriod1, gravity1, mass2, initialLength2, finalLength2,
      extension2, trial1Time2, trial2Time2, meanTime2, timePeriod2, gravity2,
      mass3, initialLength3, finalLength3, extension3, trial1Time3, trial2Time3,
      meanTime3, timePeriod3, gravity3,
      studentName: student.fname
    });

    await newEntry.save();
    console.log('Result saved successfully');
    res.render('stdConsole'); // Render the student console view

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
}


async function handle_pen_exp(req, res) {
  const {
    mass1, radius1, threadLength1, PenndulumLength1, trial1Time1, trial2Time1, meanTime1, timePeriod1,
    mass2, radius2, threadLength2, PenndulumLength2, trial1Time2, trial2Time2, meanTime2, timePeriod2,
    mass3, radius3, threadLength3, PenndulumLength3, trial1Time3, trial2Time3, meanTime3, timePeriod3,
  } = req.body;

  console.log("Request body: ", req.body); // Debug log

  try {
    // Extract and verify JWT from cookies
    const tokenPayload = getTokenFromCookies(req, 'authToken'); // Replace 'authToken' with your cookie name
    if (!tokenPayload) {
      return res.status(401).send('User not authenticated');
    }

    // Find the student in the database
    const student = await User.findById(tokenPayload.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Create a new entry for the pendulum experiment
    const newEntry = new penExp({
      student_id: student._id,
      mass1, radius1, threadLength1, PenndulumLength1, trial1Time1, trial2Time1, meanTime1, timePeriod1,
      mass2, radius2, threadLength2, PenndulumLength2, trial1Time2, trial2Time2, meanTime2, timePeriod2,
      mass3, radius3, threadLength3, PenndulumLength3, trial1Time3, trial2Time3, meanTime3, timePeriod3,
      studentName: student.fname,
    });

    // Save the new entry to the database
    await newEntry.save();
    console.log('Result saved successfully');

    // Render the student console
    res.render('stdConsole'); // Adjust the path if necessary
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
}


module.exports = {handle_Save_Spring_Exp,handle_pen_exp}

