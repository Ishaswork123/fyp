const springExp = require('../Model/springExp');
const User = require('../Model/std');
const { getTokenFromCookies } = require('../config/tchr'); // Adjust path if needed
const Resonance=require('../Model/resonance');
const penExp=require('../Model/penExp');
const meterRod=require('../Model/meterRod');
const grav=require('../Model/grav');

const ArchimedesExp=require('../Model/archimedesPrinciple');



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
   // Step 2: Check if the student has already submitted the experiment for this exp_no
   const existingExp = await springExp.findOne({
    studentId: student._id,
    exp_no: "2"  // change this based on your experiment number
  });

  if (existingExp) {
    return res.send(
      `<script>alert('You have already performed this experiment  earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
    )    }

    const newEntry = new springExp({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "2", // Adjust if exp_no is dynamic or passed from form
      mass1, initialLength1, finalLength1, extension1, trial1Time1, trial2Time1,
      meanTime1, timePeriod1, gravity1, mass2, initialLength2, finalLength2,
      extension2, trial1Time2, trial2Time2, meanTime2, timePeriod2, gravity2,
      mass3, initialLength3, finalLength3, extension3, trial1Time3, trial2Time3,
      meanTime3, timePeriod3, gravity3,
      studentName: student.fname
    });

    await newEntry.save();
    console.log('Result saved successfully');
    res.redirect('/stdConsole'); // Render the student console view

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
    const tokenPayload = getTokenFromCookies(req,'student_token'); // Replace 'authToken' with your cookie name
    if (!tokenPayload) {
      return res.status(401).send('User not authenticated');
    }

    // Find the student in the database
    const student = await User.findById(tokenPayload.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
       // Step 2: Check if the student has already submitted the experiment for this exp_no
       const existingExp = await penExp.findOne({
        studentId: student._id,
        exp_no: "1"  // change this based on your experiment number
      });
  
      if (existingExp) {
        return res.send(
          `<script>alert('You have already performed this experiment  earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
        )    }
  

    // Create a new entry for the pendulum experiment
    const newEntry = new penExp({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "1", // Adjust if exp_no is dynamic or passed from form
          mass1, radius1, threadLength1, PenndulumLength1, trial1Time1, trial2Time1, meanTime1, timePeriod1,
      mass2, radius2, threadLength2, PenndulumLength2, trial1Time2, trial2Time2, meanTime2, timePeriod2,
      mass3, radius3, threadLength3, PenndulumLength3, trial1Time3, trial2Time3, meanTime3, timePeriod3,
      studentName: student.fname,
    });

    // Save the new entry to the database
    await newEntry.save();
    console.log('Result saved successfully');

    // Render the student console
    res.redirect('/stdConsole'); // Adjust the path if necessary
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
}

async function handleResonancePost(req, res) {
  const {
    freq1, waterLevel1, diameter1, airColumn1, correctLength1, waveLength1, temp1, velocity1,
    freq2, waterLevel2, diameter2, airColumn2, correctLength2, waveLength2, temp2, velocity2,
    freq3, waterLevel3, diameter3, airColumn3, correctLength3, waveLength3, temp3, velocity3
  } = req.body;

  try {
    // Step 1: Get student from cookie token
    const tokenPayload = getTokenFromCookies(req, 'student_token');
    if (!tokenPayload) return res.status(401).send('User not authenticated');

    const student = await User.findById(tokenPayload.id);
    if (!student) return res.status(404).send('Student not found');
   // Step 2: Check if the student has already submitted the experiment for this exp_no
   const existingExp = await Resonance.findOne({
    studentId: student._id,
    exp_no: "5"  // change this based on your experiment number
  });

  if (existingExp) {
    return res.send(
      `<script>alert('You have already performed this experiment  earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
    )    }

    // Step 2: Create new resonance experiment entry
    const newResonance = new Resonance({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "5", // Adjust if exp_no is dynamic or passed from form
      freq1, waterLevel1, diameter1, airColumn1, correctLength1, waveLength1, temp1, velocity1,
      freq2, waterLevel2, diameter2, airColumn2, correctLength2, waveLength2, temp2, velocity2,
      freq3, waterLevel3, diameter3, airColumn3, correctLength3, waveLength3, temp3, velocity3
    });

    await newResonance.save();
    console.log("Resonance data saved.");
    res.redirect('/stdConsole'); // Adjust the render view as needed
  } catch (error) {
    console.error("Error saving resonance data:", error);
    res.status(500).send("Server error while saving data.");
  }
}

async function handleEquilibriumPost(req, res) {
  const {
    weightSuspended1, rInverse1, observedReading1, correctedReading1, qInverseRInverse1, condition1F1_1, loopPosition1, distance1, condition2Tau1,
    weightSuspended2, rInverse2, observedReading2, correctedReading2, qInverseRInverse2, condition1F1_2, loopPosition2, distance2, condition2Tau2,
    weightSuspended3, rInverse3, observedReading3, correctedReading3, qInverseRInverse3, condition1F1_3, loopPosition3, distance3, condition2Tau3
  } = req.body;

  try {
    // Step 1: Extract user from JWT token in cookies
    const tokenPayload = getTokenFromCookies(req, 'student_token');
    if (!tokenPayload) return res.status(401).send('User not authenticated');

    const student = await User.findById(tokenPayload.id);
    if (!student) return res.status(404).send('Student not found');
   // Step 2: Check if the student has already submitted the experiment for this exp_no
   const existingExp = await meterRod.findOne({
    studentId: student._id,
    exp_no: "3"  // change this based on your experiment number
  });

  if (existingExp) {
    return res.send(
      `<script>alert('You have already performed this experiment  earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
    )    }

    // Step 2: Create new equilibrium experiment record
    const newEquilibrium = new meterRod({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "3", // Set according to your experiment number logic
      weightSuspended1, rInverse1, observedReading1, correctedReading1, qInverseRInverse1, condition1F1_1, loopPosition1, distance1, condition2Tau1,
      weightSuspended2, rInverse2, observedReading2, correctedReading2, qInverseRInverse2, condition1F1_2, loopPosition2, distance2, condition2Tau2,
      weightSuspended3, rInverse3, observedReading3, correctedReading3, qInverseRInverse3, condition1F1_3, loopPosition3, distance3, condition2Tau3
    });

    await newEquilibrium.save();
    console.log("Equilibrium experiment data saved.");
    res.redirect('/stdConsole'); // or any other success page
  } catch (err) {
    console.error("Error saving equilibrium data:", err);
    res.status(500).send("Error saving data.");
  }
}
async function handleForceExperimentPost(req, res) {
  const {
    forceP1, forceQ1, angleP1, angleQ1, PsinAngleP1, QsinAngleQ1, weightW1, weightError1,
    forceP2, forceQ2, angleP2, angleQ2, PsinAngleP2, QsinAngleQ2, weightW2, weightError2,
    forceP3, forceQ3, angleP3, angleQ3, PsinAngleP3, QsinAngleQ3, weightW3, weightError3
  } = req.body;

  try {
    // Step 1: Extract student from token
    const tokenPayload = getTokenFromCookies(req, 'student_token');
    if (!tokenPayload) return res.status(401).send('User not authenticated');

    const student = await User.findById(tokenPayload.id);
    if (!student) return res.status(404).send('Student not found');

    // Step 2: Check if the student has already submitted the experiment for this exp_no
    const existingExp = await grav.findOne({
      studentId: student._id,
      exp_no: "4"  // change this based on your experiment number
    });

    if (existingExp) {
      return res.send(
        `<script>alert('You have already performed this experiment  earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
      )    }

    // Step 3: Create new force experiment entry if no existing record is found
    const newForceExp = new grav({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "4", // change this based on your experiment number

      forceP1, forceQ1, angleP1, angleQ1, PsinAngleP1, QsinAngleQ1, weightW1, weightError1,
      forceP2, forceQ2, angleP2, angleQ2, PsinAngleP2, QsinAngleQ2, weightW2, weightError2,
      forceP3, forceQ3, angleP3, angleQ3, PsinAngleP3, QsinAngleQ3, weightW3, weightError3
    });

    await newForceExp.save();
    console.log("Force experiment data saved.");
    res.redirect('/stdConsole'); // or any other success page
  } catch (err) {
    console.error("Error saving force experiment data:", err);
    res.status(500).send("Error saving data.");
  }
}


async function handleArchimedesExperimentPost(req, res) {
  const {
    weightInAir1, weightInLiquid1, volumeDisplaced1, buoyantForce1, apparentWeight1,
    weightInAir2, weightInLiquid2, volumeDisplaced2, buoyantForce2, apparentWeight2,
    weightInAir3, weightInLiquid3, volumeDisplaced3, buoyantForce3, apparentWeight3
  } = req.body;

  try {
    // Step 1: Extract student from token
    const tokenPayload = getTokenFromCookies(req, 'student_token');
    if (!tokenPayload) return res.status(401).send('User not authenticated');

    const student = await User.findById(tokenPayload.id);
    if (!student) return res.status(404).send('Student not found');

    // Step 2: Check if student already submitted experiment no. 6
    const existingExp = await ArchimedesExp.findOne({
      studentId: student._id,
      exp_no: "6"
    });

    if (existingExp) {
      return res.send(
        `<script>alert('You have already performed this experiment earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
      );
    }

    // Step 3: Create new entry
    const newArchimedesExp = new ArchimedesExp({
      studentId: student._id,
      studentName: student.fname,
      exp_no: "6",

      weightInAir1, weightInLiquid1, volumeDisplaced1, buoyantForce1, apparentWeight1,
      weightInAir2, weightInLiquid2, volumeDisplaced2, buoyantForce2, apparentWeight2,
      weightInAir3, weightInLiquid3, volumeDisplaced3, buoyantForce3, apparentWeight3
    });

    await newArchimedesExp.save();
    console.log("Archimedes experiment data saved.");
    res.redirect('/stdConsole');
  } catch (err) {
    console.error("Error saving Archimedes experiment data:", err);
    res.status(500).send("Error saving data.");
  }
}
module.exports = {handle_Save_Spring_Exp,handle_pen_exp,handleResonancePost
  ,handleEquilibriumPost,handleForceExperimentPost,handleArchimedesExperimentPost

}

