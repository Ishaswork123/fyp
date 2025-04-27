// // -------------------------------------------------------------------------------------------------------------
// // spring system
// let isDragging = false;
// let mouseYStart, springLengthStart;
// let canvas, ctx;
// const tube = document.getElementById("tube");
// const tubeWater = document.getElementById("tubeWater");
// const tubePosition = document.getElementById("tubePosition");
// const clampHolder = document.getElementById("clampHolder");
// const startExperimentButton = document.getElementById("startExperiment");
// const markResonanceButton = document.getElementById("markResonance");
// const startVibration = document.getElementById("startVibration");
// const calculateSpeedButton = document.getElementById("calculateSpeed");
// const measurementsDisplay = document.getElementById("measurements");
// const resultDisplay = document.getElementById("result");
// const frequencyInput = document.getElementById("frequency");
// const tuningFork = document.getElementById("tuningFork");
// let audioContext, resonanceOscillator;
// let resonancePoints = [];
// let isResonancePlaying = false;
// const pixelToMeter = 1 / 250; 
// const tubeElement = document.getElementById("tube");
// const diameterInput = document.getElementById("tube-diameter");

// let showScaleCheckbox = document.getElementById("showScale");


// diameterInput.addEventListener('input', () => {
//     const newDiameter = diameterInput.value;
//     tubeElement.style.width = newDiameter + 'px';
// });

// showScaleCheckbox.addEventListener("change", () => {
//   showScale = showScaleCheckbox.checked;
//   drawVerticalScale();
//   drawSetup();
// });


// // Start vibration of tuning fork
// function startForkVibration() {
//     tuningFork.style.animation = 'vibration 0.1s infinite';
//     isVibrating = true;
//     console.log("Vibration started.");
// }

// document.getElementById("addValuesBtn").addEventListener("click", function () {
//     const tableContainer = document.getElementById("tableContainer");
//     tableContainer.style.display = "block";
//   });


// // CSS animation for vibration
// const styleSheet = document.createElement("style");
// styleSheet.innerHTML = `
//     @keyframes vibration {
//         0% { transform: translateX(-2px); }
//         50% { transform: translateX(2px); }
//         100% { transform: translateX(-2px); }
//     }
// `;
// document.head.appendChild(styleSheet);

// // Initialize Audio
// function createAudioContext() {
//     audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     console.log("Audio context created.");
// }




// window.addEventListener("resize", () => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   drawSetup(); 
// });


// function initializeCanvas() {
//   canvas = document.getElementById("ResonanceTubeCanvas");
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   ctx = canvas.getContext("2d");
//   drawSetup();

//   canvas.addEventListener("mousedown", handleMouseDown);
//   canvas.addEventListener("mousemove", handleMouseMove);
//   canvas.addEventListener("mouseup", handleMouseUp);
// }


// function playResonanceSound(frequency) {
//     if (!audioContext) createAudioContext();
//     resonanceOscillator = audioContext.createOscillator();
//     resonanceOscillator.type = 'sine';
//     resonanceOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
//     resonanceOscillator.connect(audioContext.destination);

//     console.log("Playing resonance sound at frequency:", frequency);
//     resonanceOscillator.start();
//     setTimeout(() => resonanceOscillator.stop(), 10000); // Play for 10 seconds
// }


// // function checkForResonance(length) {
// //     const frequency = parseFloat(frequencyInput.value); // Input frequency from tuning fork
// //     const speedOfSound = 343; // Speed of sound in m/s
// //     const wavelength = 4 * length / 1000; // Convert length to meters and apply 1/4 wavelength rule
// //     const calculatedFrequency = (speedOfSound / wavelength).toFixed(2);

// //     console.log(`Checking resonance... Length: ${length}px, Length in meters: ${(length / 1000).toFixed(2)}m, Wavelength: ${wavelength.toFixed(2)}m, Frequency: ${frequency} Hz, Calculated Frequency: ${calculatedFrequency} Hz`);

// //     // Set a small tolerance for resonance detection (e.g., ±1 Hz)
// //     if (Math.abs(frequency - calculatedFrequency) <= 1 && !isResonancePlaying) {
// //         console.log("Resonance condition met! Playing sound...");
// //         playResonanceSound(frequency); // Play resonance sound if condition is met
// //         isResonancePlaying = true;
// //     } else if (Math.abs(frequency - calculatedFrequency) > 1 && isResonancePlaying) {
// //         stopResonanceSound();
// //         isResonancePlaying = false;
// //     }
// // }
    
// //             function stopResonanceSound() {
// //                 if (resonanceOscillator) resonanceOscillator.stop();
// //                 console.log("Stopped resonance sound.");
// //                 isResonancePlaying = false;
// //             }
    
// function checkForResonance(length) {
//   const frequency = parseFloat(frequencyInput.value);
//   const speedOfSound = 343; // Approx. speed of sound in air (m/s)
//   const calculatedFrequency = speedOfSound / (4 * length);
//   if (Math.abs(calculatedFrequency - frequency) < 0.5) { // Resonance threshold
//       console.log("Resonance detected!");
//       playResonanceSound(frequency);
//   }
// }

//             // Adjust Water Level and Check Resonance
//             tubePosition.addEventListener('input', () => {
//                 const tubeTopPosition = parseInt(tubePosition.value);
//                 tube.style.top = `${tubeTopPosition}px`;
//                 clampHolder.style.top = `${tubeTopPosition + 20}px`;
    
//                 const tubeBottomPosition = tubeTopPosition + tube.offsetHeight;
//                 const waterLevelInBeaker = 0.7 * 250; // 70% water level
//                 const submergedDepth = Math.max(0, tubeBottomPosition - (500 - waterLevelInBeaker - 20));
    
//                 tubeWater.style.height = `${submergedDepth}px`;
    
//                 const airColumnLength = 500 - tubeTopPosition; // Adjust air column length
//                 checkForResonance(airColumnLength);
//             });
    
// function drawVerticalScale() {
//   const scaleHeight = 1;
//   const pixelPerMeter = 400;
//   const scaleWidth = 45;
//   const originY = 116;

//   ctx.beginPath();
//   ctx.fillStyle = "orange";
//   ctx.fillRect(
//     canvas.width / 2 - 80,
//     originY - 10,
//     scaleWidth,
//     scaleHeight * pixelPerMeter + 20
//   );

//   ctx.beginPath();
//   ctx.moveTo(canvas.width / 2 - 75, originY - 5);
//   ctx.lineTo(canvas.width / 2 - 75, originY + scaleHeight * pixelPerMeter);
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.stroke();

//   for (let i = 0; i <= scaleHeight * 100; i++) {
//     let y = originY + (i * pixelPerMeter) / 100;

//     ctx.beginPath();
//     if (i % 5 === 0) {
//       ctx.moveTo(canvas.width / 2 - 75, y);
//       ctx.lineTo(canvas.width / 2 - 65, y);
//     } else {
//       ctx.moveTo(canvas.width / 2 - 75, y);
//       ctx.lineTo(canvas.width / 2 - 70, y);
//     }
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = 1;
//     ctx.stroke();

//     if (i % 5 === 0) {
//       const label = i.toFixed(0);
//       ctx.font = "10px Arial";
//       ctx.textAlign = "right";
//       ctx.fillStyle = "black";
//       ctx.fillText(label + " cm", canvas.width / 2 - 37, y + 3);
//     }
//   }
// }



// // function resetExperiment() {
// //   isOscillating = false;

// //   mass = 100;
// //   bobRadius = 0;
// //   springLength = springTopY + naturalLength;
// //   oscillationCount = 0;
// //   startTime = null;

// //   document.getElementById("massSlider").value = 100;
// //   document.getElementById("massValue").textContent = "100 g";
// //   document.getElementById("springSlider").value = 0.5;
// //   document.getElementById("springValue").textContent = "0.5";
// //   document.getElementById("gravity").value = 9.8;
// //   document.getElementById("gravity-value").textContent = "9.8 m/s²";

// //   selectedWeightData.isFromSlider = true;

// //   maxOscillations = 0;

// //   if (springAnimation) {
// //     springAnimation.pause();
// //   }

// //   drawSetup();
// // }

// // Add variables for horizontal dragging
// let offsetX;
// let offsetY;

// tuningFork.addEventListener('mousedown', (event) => {
//     isDragging = true;
//     offsetY = event.clientY - tuningFork.offsetTop;
//     offsetX = event.clientX - tuningFork.offsetLeft;
//     console.log("Tuning fork dragging started.");
// });

// document.addEventListener('mousemove', (event) => {
//     if (isDragging) {
//         // Calculate new X and Y positions
//         let newX = event.clientX - offsetX;
//         let newY = event.clientY - offsetY;

//         // Limit tuning fork movement within container
//         newX = Math.max(0, Math.min(newX, 280)); // Horizontal boundary (adjust as needed)
//         newY = Math.max(0, Math.min(newY, 200)); // Vertical boundary (adjust as needed)

//         // Update tuning fork position
//         tuningFork.style.left = `${newX}px`;
//         tuningFork.style.top = `${newY}px`;

//         // Calculate effective air column length based on fork position
//         const airColumnLength = 500 - newY;
//         console.log(`Tuning fork position: ${newX}px, ${newY}px, Air Column Length: ${airColumnLength}px`);
//         checkForResonance(airColumnLength);
//     }
// });

// document.addEventListener('mouseup', () => {
//     if (isDragging) {
//         console.log("Tuning fork dragging stopped.");
//     }
//     isDragging = false;
// });


// document.getElementById("startBtn").addEventListener("click", startOscillation);
// document.getElementById("resetBtn").addEventListener("click", resetExperiment);



// window.onload = initializeCanvas;
// window.onresize = initializeCanvas;

// // --------------------------------------------------------------------------------------------------------------------------
// // ---------------------------------------------------------------------------------------------------------------------------
// // vertical scale issue

//   let audioContext, resonanceOscillator;
//   let resonancePoints = [];
//   let isResonancePlaying = false;

// // let ctx;
// let isDragging = false;
// let offsetX, offsetY;
// let isVibrating= false;
// const tube = document.getElementById("tube");
// const tubeWater = document.getElementById("tubeWater");
// const clampHolder = document.getElementById("clampHolder");
// const tuningFork = document.getElementById("tuningFork");
// const frequencyInput = document.getElementById("Frequency");
// let frequencyValue = document.getElementById("frequency-value");
// const diameterInput = document.getElementById("tube-diameter");
// let diameterValue = document.getElementById("diameter-value");
// const tubePositionInput = document.getElementById("tubePosition");
// let tubepositionValue= document.getElementById("tubePosition-value");
// const startVibration = document.getElementById('startVibration');
// // const starExp = document.getElementById("startBtn");
// const resetExp = document.getElementById("resetBtn");
// const showScaleCheckbox = document.getElementById("showScale");
// const pixelPerMeter = 400; // Pixels per meter for scaling
// let frequency = parseInt(frequencyInput.value);
// let diameter = parseFloat(diameterInput.value);
// let tubePosition= parseFloat(tubePositionInput.value);
// let canvas = document.getElementById("ResonanceTubeCanvas");
// const ctx = canvas.getContext("2d");

// const forks = document.querySelectorAll(".tuning-fork1, .tuning-fork2, .tuning-fork3, .tuning-fork4");
// const mainFork = document.querySelector(".tuning-fork");

// const lengthDisplay= document.getElementById("length");
// const diameterDisplay= document.getElementById("diameterDis");
// const calFreqDisp= document.getElementById("Cal-freq");
    


// function initializeCanvas() {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   // ctx = canvas.getContext("2d");
//   drawSetup();
// }

//   forks.forEach((fork) => {
//     fork.addEventListener('click', () => {
//       // Remove any previous animation class from mainFork
//       mainFork.style.animation = '';
//       mainFork.querySelector('.handle').style.background = '';
//       mainFork.querySelectorAll('.prong').forEach((prong) => {
//         prong.style.background = '';
//       });

//       // Copy styles of clicked fork to mainFork
//       const handleStyle = window.getComputedStyle(fork.querySelector('.handle'));
//       mainFork.querySelector('.handle').style.background = handleStyle.background;

//       const prongStyle = window.getComputedStyle(fork.querySelector('.prong'));
//       mainFork.querySelectorAll('.prong').forEach((prong) => {
//         prong.style.background = prongStyle.background;
//       });

//     });
//   });



// function updateFrequency(frequency) {
//   frequencyInput.value = frequency;
//   frequencyValue.textContent = `${frequency} Hz`;
// }
// function drawSetup() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//   drawVerticalScale(); // Draw the vertical scale
// }
// // function drawSetup() {
// //   ctx.clearRect(0, 0, canvas.width, canvas.height);
// //   if (showScaleCheckbox.checked) drawVerticalScale();
// // }

// // showScaleCheckbox.addEventListener("change", drawSetup);

// addValuesBtn.addEventListener('click', function() {
//   if (tableContainer.style.display === 'none') {
//     tableContainer.style.display = 'block';  // Show the table
//   } else {
//     tableContainer.style.display = 'none';  // Hide the table
//   }
// });


// // Event listener for "Vibrate" button
// startVibration.addEventListener('click', function () {
//   createAudioContext();
//   if(!isVibrating){
//     isVibrating= true;
//       const prongs = tuningFork.querySelectorAll('.prong');
//       prongs.forEach((prong) => {
//         prong.style.animation = 'vibration 0.1s infinite';
//       });
//       console.log("Prong vibration started.");
//     }
//     else{
//       isVibrating= false;
//       const prongs = tuningFork.querySelectorAll('.prong');
//       prongs.forEach((prong) => {
//         prong.style.animation = 'none';
//       });
//       console.log("Prong vibration stopped.");
//     }
// });


// function createAudioContext() {
//   if (!audioContext) {
//       audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   }
//   if (audioContext.state === "suspended") {
//       audioContext.resume().then(() => {
//           console.log("AudioContext resumed successfully.");
//       }).catch(err => console.error("Failed to resume AudioContext:", err));
//   }
// }

// let rulerPositionX = canvas.width / 2 - 80; 
// let rulerPositionY = 150;
// let rulerOffsetX = 0;
// let rulerOffsetY = 0;
// let isScaleVisible = false; // Tracks if the scale is visible
// let isDraggingRuler = false;
// let isDraggingFork = false;
// const rulerIcon = document.getElementById("rulerIcon");
// function drawSetup() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//   drawVerticalScale(); // Draw the vertical scale
// }


// function drawVerticalScale() {
//   if (!isScaleVisible) return;

//   const scaleHeight = 1; // Scale in meters
//   const scaleWidth = 46;

//   // Main scale body - solid orange
//   ctx.fillStyle = "orange";
//   ctx.fillRect(
//     rulerPositionX,
//     rulerPositionY - 10,
//     scaleWidth,
//     scaleHeight * pixelPerMeter + 20
//   );

//   // Add a thin black border for definition
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 1.5;
//   ctx.strokeRect(
//     rulerPositionX,
//     rulerPositionY - 10,
//     scaleWidth,
//     scaleHeight * pixelPerMeter + 20
//   );

//   // Draw the central black line
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(rulerPositionX + scaleWidth / 2, rulerPositionY - 5);
//   ctx.lineTo(
//     rulerPositionX + scaleWidth / 2,
//     rulerPositionY + scaleHeight * pixelPerMeter
//   );
//   ctx.stroke();

//   // Draw tick marks and add labels
//   for (let i = 0; i <= scaleHeight * 100; i++) {
//     const y = rulerPositionY + (i * pixelPerMeter) / 100;

//     // Tick marks: shorter for 1 cm, longer for 5 cm
//     ctx.beginPath();
//     ctx.moveTo(rulerPositionX + scaleWidth / 2, y);
//     ctx.lineTo(
//       rulerPositionX + scaleWidth / 2 - (i % 5 === 0 ? 10 : 5),
//       y
//     );
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = 1;
//     ctx.stroke();

//     // Labels for every 5 cm
//     if (i % 5 === 0) {
//       ctx.font = "10px Arial";
//       ctx.textAlign = "right";
//       ctx.fillStyle = "black";
//       ctx.fillText(
//         `${i} cm`,
//         rulerPositionX + scaleWidth - 10,
//         y + 3
//       );
//     }
//   }
// }

// // rulerIcon.addEventListener("mousedown", (event) => {
// //   isDraggingRuler = true;
// //   rulerOffsetX = event.clientX - rulerPositionX;
// //   rulerOffsetY = event.clientY - rulerPositionY;
// // });

// // document.addEventListener("mousemove", (event) => {
// //   if (isDraggingRuler) {
// //     rulerPositionX = Math.max(0, event.clientX - rulerOffsetX);
// //     rulerPositionY = Math.max(0, event.clientY - rulerOffsetY);
// //     draw(); // Redraw the canvas
// //   }
// //   if (isDraggingFork) {
// //     const newForkX = Math.max(0, event.clientX - forkOffsetX);
// //     const newForkY = Math.max(0, event.clientY - forkOffsetY);
// //     tuningFork.style.left = `${newForkX}px`;
// //     tuningFork.style.top = `${newForkY}px`;

// //     // Calculate air column length and check resonance
// //     const airColumnLength =
// //       canvas.height - newForkY - document.getElementById("tube").offsetHeight;
// //     checkForResonance(airColumnLength);
// //   }
// // });

//  // Event listener for ruler icon click
//  rulerIcon.addEventListener("mousedown", (event) => {
//   if (!isScaleVisible) {
//     isScaleVisible = true;
//     rulerOffsetX = event.clientX - rulerPositionX;
//     rulerOffsetY = event.clientY - rulerPositionY;
//     drawSetup();
//   }
//   isDraggingRuler = true;
// });

// // Mousemove to drag the scale
// document.addEventListener("mousemove", (event) => {
//   if (isDraggingRuler) {
//     rulerPositionX = Math.max(0, event.clientX - rulerOffsetX);
//     rulerPositionY = Math.max(0, event.clientY - rulerOffsetY);
//     drawSetup();
//   }
// });

// // Stop dragging on mouseup
// document.addEventListener("mouseup", () => {
//   isDraggingRuler = false;
// });



// drawSetup();



// // function drawVerticalScale() {
// //   const scaleHeight = 1; // Scale in meters
// //   const scaleWidth = 46;
// //   const originY = 150;

// //   // Main scale body - solid orange
// //   ctx.fillStyle = "orange";
// //   ctx.fillRect(canvas.width / 2 - 80, originY - 10, scaleWidth, scaleHeight * pixelPerMeter + 20);

// //   // Add a thin black border for definition
// //   ctx.strokeStyle = "black";
// //   ctx.lineWidth = 1.5;
// //   ctx.strokeRect(canvas.width / 2 - 80, originY - 10, scaleWidth, scaleHeight * pixelPerMeter + 20);

// //   // Draw the central black line
// //   ctx.strokeStyle = "black";
// //   ctx.lineWidth = 2;
// //   ctx.beginPath();
// //   ctx.moveTo(canvas.width / 2 - 75, originY - 5);
// //   ctx.lineTo(canvas.width / 2 - 75, originY + scaleHeight * pixelPerMeter);
// //   ctx.stroke();

// //   // Draw tick marks and add labels
// //   for (let i = 0; i <= scaleHeight * 100; i++) {
// //     const y = originY + (i * pixelPerMeter) / 100;

// //     // Tick marks: shorter for 1 cm, longer for 5 cm
// //     ctx.beginPath();
// //     ctx.moveTo(canvas.width / 2 - 75, y);
// //     ctx.lineTo(canvas.width / 2 - (i % 5 === 0 ? 65 : 70), y);
// //     ctx.strokeStyle = "black";
// //     ctx.lineWidth = 1;
// //     ctx.stroke();

// //     // Labels for every 5 cm
// //     if (i % 5 === 0) {
// //       ctx.font = "10px Arial";
// //       ctx.textAlign = "right";
// //       ctx.fillStyle = "black";
// //       ctx.fillText(`${i} cm`, canvas.width / 2 - 37, y + 3);
// //     }
// //   }

// //   // Add subtle shading to the edges for depth
// //   ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Light shadow
// //   ctx.fillRect(canvas.width / 2 - 81, originY - 10, 3, scaleHeight * pixelPerMeter + 20); // Left shadow
// //   ctx.fillRect(canvas.width / 2 - 80 + scaleWidth - 2, originY - 10, 3, scaleHeight * pixelPerMeter + 20); // Right shadow
// // }



// // let isDraggingScale = false;
// //     let scaleOffsetX = 0;
// //     let scaleOffsetY = 0;

// //     const scaleIcon = document.getElementById("scaleIcon");
// //     const scaleContainer = document.getElementById("scaleContainer");

//     // // Toggle scale visibility
//     // scaleIcon.addEventListener("click", () => {
//     //   scaleContainer.style.display =
//     //     scaleContainer.style.display === "none" ? "block" : "none";
//     // });

//     // // Dragging logic for the scale
//     // scaleContainer.addEventListener("mousedown", (event) => {
//     //   isDraggingScale = true;
//     //   scaleOffsetX = event.clientX - scaleContainer.offsetLeft;
//     //   scaleOffsetY = event.clientY - scaleContainer.offsetTop;
//     // });

//     // document.addEventListener("mousemove", (event) => {
//     //   if (isDraggingScale) {
//     //     const newX = Math.max(0, event.clientX - scaleOffsetX);
//     //     const newY = Math.max(0, event.clientY - scaleOffsetY);
//     //     scaleContainer.style.left = `${newX}px`;
//     //     scaleContainer.style.top = `${newY}px`;
//     //   }
//     // });
//     // document.addEventListener("mouseup", () => {
//     //   isDraggingScale = false;
//     // });

// function checkForResonance(length) {
//   const frequency = parseFloat(frequencyInput.value);
//   const speedOfSound = 343; // Speed of sound in m/s
//   const wavelength = 4 * length / 1000;
//   const calculatedFrequency = speedOfSound / wavelength;

//   console.log("frequency: ", frequency, " and calculated frequency: ", calculatedFrequency);
//  calFreqDisp.textContent = `${calculatedFrequency.toFixed(2)} Hz`; // Update calculated frequency
  
//    // Also update the output for Length and Diameter
//    lengthDisplay.textContent = `${length} cm`;
//    diameterDisplay.textContent = `${diameter} cm`;
//   if(isVibrating){
//     // Set a small tolerance for resonance detection (e.g., ±1 Hz)
//     if (Math.abs(frequency - calculatedFrequency) <= 1 && !isResonancePlaying) {
//       console.log("Resonance condition met! Playing sound...");
//       playResonanceSound(frequency); // Play resonance sound if condition is met
//       isResonancePlaying = true;
//   } else if (Math.abs(frequency - calculatedFrequency) > 1 && isResonancePlaying) {
//       stopResonanceSound();
//       isResonancePlaying = false;
//   }
//   }
//   else{
//     window.alert("please vibrate the fork first");
//   }
// }

// function stopResonanceSound() {
//   if (resonanceOscillator) resonanceOscillator.stop();
//   console.log("Stopped resonance sound.");
//   isResonancePlaying = false;
// }

// function playResonanceSound(frequency) {
//   if (!audioContext) createAudioContext();
//   resonanceOscillator = audioContext.createOscillator();
//   resonanceOscillator.type = 'sine';
//   resonanceOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
//   resonanceOscillator.connect(audioContext.destination);

//   console.log("Playing resonance sound at frequency:", frequency);
//   resonanceOscillator.start();
//   setTimeout(() => resonanceOscillator.stop(), 1000); // Play for 10 seconds
//   console.log("AudioContext state:", audioContext.state);

// }


// // tuningFork.addEventListener("mousedown", (event) => {
// //   isDragging = true;
// //   offsetY = event.clientY - tuningFork.offsetTop;
// //   offsetX = event.clientX - tuningFork.offsetLeft;
// // });


// let canvasHeight = canvas.height; // Assuming your canvas height is the full height of the viewport
// let tubeHeight = tube.offsetHeight; // Get the height of the tube element
// let airColumnLength;

// // Existing functionality for tuning fork dragging
// // let isDraggingFork = false;
// let forkOffsetX = 0;
// let forkOffsetY = 0;

// // const tuningFork = document.getElementById("tuningFork");

// tuningFork.addEventListener("mousedown", (event) => {
//   isDraggingFork = true;
//   forkOffsetX = event.clientX - tuningFork.offsetLeft;
//   forkOffsetY = event.clientY - tuningFork.offsetTop;
// });

// document.addEventListener("mousemove", (event) => {
//   if (isDraggingFork) {
//     const newForkX = Math.max(0, event.clientX - forkOffsetX);
//     const newForkY = Math.max(0, event.clientY - forkOffsetY);
//     tuningFork.style.left = `${newForkX}px`;
//     tuningFork.style.top = `${newForkY}px`;

//     // Calculate air column length and check resonance
//     const airColumnLength =
//       canvas.height - newForkY - document.getElementById("tube").offsetHeight;
//     checkForResonance(airColumnLength);
//   }
// });

// document.addEventListener("mouseup", () => {
//   isDraggingFork = false;
// });

// // // When dragging the tuning fork, calculate the air column length
// // document.addEventListener("mousemove", (event) => {
// //   if (isDragging) {
// //     // Prevent dragging beyond the canvas bounds
// //     let newX = Math.max(0, Math.min(event.clientX - offsetX, 280));
// //     let newY = Math.max(0, Math.min(event.clientY - offsetY, 200));
// //     tuningFork.style.left = `${newX}px`;
// //     tuningFork.style.top = `${newY}px`;

// //     // Calculate air column length based on the tube's position
// //     airColumnLength = canvasHeight - newY - tubeHeight;
// //     checkForResonance(airColumnLength);
// //   }
// // });

// // document.addEventListener("mousemove", (event) => {
// //   if (isDragging) {
// //     let newX = Math.max(0, Math.min(event.clientX - offsetX, 280));
// //     let newY = Math.max(0, Math.min(event.clientY - offsetY, 200));
// //     tuningFork.style.left = `${newX}px`;
// //     tuningFork.style.top = `${newY}px`;

// //     const airColumnLength = 500 - newY;
// //     checkForResonance(airColumnLength);
// //   }
// // });

// // document.addEventListener("mouseup", () => {
// //   isDragging = false;
// // });

// // // Tube Position
// // tubePositionInput.addEventListener("input", () => {
// //   tubePosition = parseFloat(tubePositionInput.value);
// //   tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
// //   tube.style.top = `${tubePosition}px`;
// //   clampHolder.style.top = `${tubePosition + 60}px`;
// //   const airColumnLength = 500 - tubePosition;
// //   checkForResonance(airColumnLength);
// //   // adjustTubeWater();
// // });

// // Update tube position and calculate the air column length
// tubePositionInput.addEventListener("input", () => {
//   tubePosition = parseFloat(tubePositionInput.value); // Get the input position
//   tubepositionValue.textContent = `${tubePosition} cm`; // Display the updated value

//   // Calculate air column length as the difference between the tube's position and the total height of the container
//   airColumnLength = canvasHeight - tubePosition - tubeHeight;
//   tube.style.top = `${tubePosition}px`; // Update tube position on screen
//   clampHolder.style.top = `${tubePosition + 60}px`; // Adjust clamp holder position accordingly
  
//   checkForResonance(airColumnLength); // Check if resonance is achieved with the new air column length
// });

// // document.getElementById("tubePosition-increase").addEventListener("click", () => {
// //   tubePosition = Math.min(parseFloat(tubePositionInput.max), parseFloat(tubePositionInput.value) + 10);
// //   tubePositionInput.value = tubePosition; // Sync with range slider
// //   tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
// //   tube.style.top = `${tubePosition}px`;
// //   clampHolder.style.top = `${tubePosition + 60}px`;
// //   const airColumnLength = 500 - tubePosition;
// //   checkForResonance(airColumnLength);
// //   // adjustTubeWater();
// // });

// // document.getElementById("tubePosition-decrease").addEventListener("click", () => {
// //   tubePosition = Math.max(parseFloat(tubePositionInput.min), parseFloat(tubePositionInput.value) - 10);
// //   tubePositionInput.value = tubePosition; // Sync with range slider
// //   tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
// //   tube.style.top = `${tubePosition}px`;
// //   clampHolder.style.top = `${tubePosition + 60}px`;
// //   const airColumnLength = 500 - tubePosition;
// //   checkForResonance(airColumnLength);
// //   // adjustTubeWater();
// // });

// // Frequency
// frequencyInput.addEventListener("input", () => {
//   frequency = parseFloat(frequencyInput.value);
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   const airColumnLength = 500 - tubePosition;
//   checkForResonance(airColumnLength);
// });

// document.getElementById("frequency-increase").addEventListener("click", () => {
//   frequency = Math.min(parseFloat(frequencyInput.max), parseFloat(frequencyInput.value) + 1);
//   frequencyInput.value = frequency; // Sync with range slider
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   const airColumnLength = 500 - tubePosition;
//   checkForResonance(airColumnLength);
// });

// document.getElementById("frequency-decrease").addEventListener("click", () => {
//   frequency = Math.max(parseFloat(frequencyInput.min), parseFloat(frequencyInput.value) - 1);
//   frequencyInput.value = frequency; // Sync with range slider
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   const airColumnLength = 500 - tubePosition;
//   checkForResonance(airColumnLength);
// });

// // Diameter
// diameterInput.addEventListener("input", () => {
//   diameter = parseFloat(diameterInput.value);
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter}px`;
// });

// document.getElementById("diameter-increase").addEventListener("click", () => {
//   diameter = Math.min(parseFloat(diameterInput.max), parseFloat(diameterInput.value) + 1);
//   diameterInput.value = diameter; // Sync with range slider
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter}px`;
// });

// document.getElementById("diameter-decrease").addEventListener("click", () => {
//   diameter = Math.max(parseFloat(diameterInput.min), parseFloat(diameterInput.value) - 1);
//   diameterInput.value = diameter; // Sync with range slider
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter}px`;
// });


// document.getElementById("reset").addEventListener("click", ()=>{
//    stopforkVibration();
//    stopResonanceSound();
//    frequencyValue.textContent = 230 +`Hz`;
//    frequencyInput.value= 230;
//    tubePositionInput.value= 0;
//    tubepositionValue.textContent= 0 ;
//    diameterInput.value= 1 ;
//    diameterValue.textContent= 1 +`cm`;
   
//    tube.style.width = `${1}px`;


//    lengthDisplay.textContent= 0.0+`cm`;
//    diameterDisplay.textContent= 0 +`Hz`;
//    calFreqDisp.textContent= 0;



// })

// // createAudioContext();
// window.onload = initializeCanvas;
// window.onresize = initializeCanvas;


// let audioContext, resonanceOscillator;
// let resonancePoints = [];
// let isResonancePlaying = false;

// // let ctx;
// let isDragging = false;
// let offsetX, offsetY;
// let isVibrating = false;
// const tube = document.getElementById("tube");
// const tubeWater = document.getElementById("tubeWater");
// const clampHolder = document.getElementById("clampHolder");
// const tuningFork = document.getElementById("tuningFork");
// const frequencyInput = document.getElementById("Frequency");
// let frequencyValue = document.getElementById("frequency-value");
// const diameterInput = document.getElementById("tube-diameter");
// let diameterValue = document.getElementById("diameter-value");
// const tubePositionInput = document.getElementById("tubePosition");
// let tubepositionValue = document.getElementById("tubePosition-value");
// const startVibration = document.getElementById('startVibration');
// const resetExp = document.getElementById("reset");
// const showScaleCheckbox = document.getElementById("showScale");
// const pixelPerMeter = 400; // Pixels per meter for scaling
// let frequency = parseInt(frequencyInput.value);
// let diameter = parseFloat(diameterInput.value);
// let tubePosition = parseFloat(tubePositionInput.value);
// let canvas = document.getElementById("ResonanceTubeCanvas");
// const ctx = canvas.getContext("2d");
// const forks = document.querySelectorAll(".tuning-fork1, .tuning-fork2, .tuning-fork3, .tuning-fork4");
// const mainFork = document.querySelector(".tuning-fork");

// const lengthDisplay = document.getElementById("length");
// const diameterDisplay = document.getElementById("diameterDis");
// const calFreqDisp = document.getElementById("Cal-freq");
// let selectedFork = null;

// // Animation flags
// let isAnimatingWaterRipple = false;
// let rippleIntensity = 0;
// let soundWaveRadius = 0;

// function initializeCanvas() {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   drawSetup();
// }




// // function drawWaterRipple() {
// //   if (!isAnimatingWaterRipple) return;

// //   const waterRect = tubeWater.getBoundingClientRect();
// //   const centerX = waterRect.left + waterRect.width / 2;
// //   const centerY = waterRect.bottom - rippleIntensity; // Adjust based on intensity

// //   // Clear previous ripples
// //   ctx.clearRect(waterRect.left, waterRect.top, waterRect.width, waterRect.height);

// //   // Draw concentric ripples
// //   ctx.strokeStyle = "blue";
// //   ctx.lineWidth = 2;
// //   for (let i = 0; i < rippleIntensity; i += 10) {
// //     ctx.beginPath();
// //     ctx.arc(centerX, centerY, i, 0, 2 * Math.PI);
// //     ctx.stroke();
// //   }

// //   rippleIntensity -= 0.5; // Decay intensity over time
// //   if (rippleIntensity <= 0) {
// //     isAnimatingWaterRipple = false;
// //     ctx.clearRect(waterRect.left, waterRect.top, waterRect.width, waterRect.height);
// //   }
// // }

// // function drawSoundWave() {
// //   if (!isVibrating) return;

// //   const forkRect = tuningFork.getBoundingClientRect();
// //   const forkCenterX = forkRect.left + forkRect.width / 2;
// //   const forkCenterY = forkRect.top + forkRect.height / 2;

// //   // Clear previous waves
// //   ctx.clearRect(0, 0, canvas.width, canvas.height);

// //   // Draw expanding waves
// //   ctx.strokeStyle = "red";
// //   ctx.lineWidth = 2;
// //   ctx.beginPath();
// //   ctx.arc(forkCenterX, forkCenterY, soundWaveRadius, 0, 2 * Math.PI);
// //   ctx.stroke();

// //   soundWaveRadius += 2; // Expand the wave
// //   if (soundWaveRadius > 100) {
// //     soundWaveRadius = 0; // Reset wave after reaching max radius
// //   }
// // }

// function updateCanvas() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   requestAnimationFrame(updateCanvas);
// }



// forks.forEach((fork) => {
//   fork.addEventListener('click', () => {
//       if (selectedFork) {
//           selectedFork.classList.remove('selected-fork');
//       }
//       fork.classList.add('selected-fork');
//       selectedFork = fork;

//       // Remove any previous animation class from mainFork
//       mainFork.style.animation = '';
//       mainFork.querySelector('.handle').style.background = '';
//       mainFork.querySelectorAll('.prong').forEach((prong) => {
//           prong.style.background = '';
//       });

//       // Copy styles of clicked fork to mainFork
//       const handleStyle = window.getComputedStyle(fork.querySelector('.handle'));
//       mainFork.querySelector('.handle').style.background = handleStyle.background;

//       const prongStyle = window.getComputedStyle(fork.querySelector('.prong'));
//       mainFork.querySelectorAll('.prong').forEach((prong) => {
//           prong.style.background = prongStyle.background;
//       });
//       updateFrequency(parseInt(fork.getAttribute('frequency')));

//   });
// });

// function updateFrequency(frequency) {
//   frequencyInput.value = frequency;
//   frequencyValue.textContent = `${frequency} Hz`;
// }

// function drawSetup() {
//   // Clear the entire canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Redraw static elements like the scale
//   if (isScaleVisible) drawVerticalScale();

//   // Redraw ripple animation if active
//   // if (isAnimatingWaterRipple) drawWaterRipple();
// }


// // function drawSetup() {
// //   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
// //   drawVerticalScale(); // Draw the vertical scale
// // }

// addValuesBtn.addEventListener('click', function () {
//   if (tableContainer.style.display === 'none') {
//       tableContainer.style.display = 'block';  // Show the table
//   } else {
//       tableContainer.style.display = 'none';  // Hide the table
//   }
// });

// // Event listener for "Vibrate" button
// startVibration.addEventListener('click', function () {

//   if (!isVibrating) {
//       isVibrating = true;
//       rippleIntensity = 50; // Initial intensity of water ripples
//       isAnimatingWaterRipple = true;
//       soundWaveRadius = 20; // Initial sound wave radius
//       console.log("Vibration started.");
//       const prongs = tuningFork.querySelectorAll('.prong');
//       prongs.forEach((prong) => {
//           prong.style.animation = 'vibration 0.1s infinite';
//       });
//       console.log("Prong vibration started.");
//   }
//   else {

//       isVibrating = false;
//       isAnimatingWaterRipple = false;
//       rippleIntensity = 0;
//       soundWaveRadius = 0;
//       console.log("Vibration stopped.");
//       const prongs = tuningFork.querySelectorAll('.prong');
//       prongs.forEach((prong) => {
//           prong.style.animation = 'none';
//       });
//       console.log("Prong vibration stopped.");
//   }
// });

// function stopforkVibration() {
//   isVibrating = false;
//   const prongs = tuningFork.querySelectorAll('.prong');
//   prongs.forEach((prong) => {
//       prong.style.animation = 'none';
//   });
//   console.log("Prong vibration stopped.");
// }

// function createAudioContext() {
//   if (!audioContext) {
//       audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   }
//    if (audioContext.state === "suspended") {
//          audioContext.resume().then(() => {
//               console.log("AudioContext resumed successfully.");
//           }).catch(err => console.error("Failed to resume AudioContext:", err));
//     }
// }


// let rulerPositionX = canvas.width / 2 ;
// let rulerPositionY = 150;
// let rulerOffsetX = 0;
// let rulerOffsetY = 0;
// let isScaleVisible = false; // Tracks if the scale is visible
// let isDraggingRuler = false;
// let isDraggingFork = false;
// const rulerIcon = document.getElementById("rulerIcon");

// function drawSetup() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
//   drawVerticalScale(); // Draw the vertical scale
// }


// function drawVerticalScale() {
//   if (!isScaleVisible) return;

//   const scaleHeight = 1; // Scale in meters
//   const scaleWidth = 46;

//   // Main scale body - solid orange
//   ctx.fillStyle = "orange";
//   ctx.fillRect(
//       rulerPositionX,
//       rulerPositionY - 10,
//       scaleWidth,
//       scaleHeight * pixelPerMeter + 20
//   );

//   // Add a thin black border for definition
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 1.5;
//   ctx.strokeRect(
//       rulerPositionX,
//       rulerPositionY - 10,
//       scaleWidth,
//       scaleHeight * pixelPerMeter + 20
//   );

//   // Draw the central black line
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(rulerPositionX + scaleWidth / 2, rulerPositionY - 5);
//   ctx.lineTo(
//       rulerPositionX + scaleWidth / 2,
//       rulerPositionY + scaleHeight * pixelPerMeter
//   );
//   ctx.stroke();

//   // Draw tick marks and add labels
//   for (let i = 0; i <= scaleHeight * 100; i++) {
//       const y = rulerPositionY + (i * pixelPerMeter) / 100;

//       // Tick marks: shorter for 1 cm, longer for 5 cm
//       ctx.beginPath();
//       ctx.moveTo(rulerPositionX + scaleWidth / 2, y);
//       ctx.lineTo(
//           rulerPositionX + scaleWidth / 2 - (i % 5 === 0 ? 10 : 5),
//           y
//       );
//       ctx.strokeStyle = "black";
//       ctx.lineWidth = 1;
//       ctx.stroke();

//       // Labels for every 5 cm
//       if (i % 5 === 0) {
//           ctx.font = "10px Arial";
//           ctx.textAlign = "right";
//           ctx.fillStyle = "black";
//           ctx.fillText(
//               `${i} cm`,
//               rulerPositionX + scaleWidth - 10,
//               y + 3
//           );
//       }
//   }
// }

// rulerIcon.addEventListener("click", () => {
//    if (!isScaleVisible) {
//   isScaleVisible = true;
//   drawSetup();
//     }
//     else{
//       isScaleVisible= false;
//       drawSetup();
//     }
// });


// canvas.addEventListener("mousedown", (event) => {
//    if (isScaleVisible) {
//   const rect = canvas.getBoundingClientRect();
//    const mouseX = event.clientX - rect.left;
//   const mouseY = event.clientY - rect.top;


//  if (
//        mouseX >= rulerPositionX &&
//        mouseX <= rulerPositionX + 46 &&
//         mouseY >= rulerPositionY-10 &&
//         mouseY <= rulerPositionY +  pixelPerMeter +20
//       )
//       {
//           isDraggingRuler = true;
//               rulerOffsetX = mouseX - rulerPositionX;
//                rulerOffsetY = mouseY - rulerPositionY;
//       }
//    }
// });

// canvas.addEventListener("mousemove", (event) => {
//   if (isDraggingRuler) {
//       const rect = canvas.getBoundingClientRect();
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;

//       // Restrict ruler to stay within the canvas
//       rulerPositionX = Math.max(0, Math.min(canvas.width - 46, mouseX - rulerOffsetX));
//       rulerPositionY = Math.max(0, Math.min(canvas.height - (pixelPerMeter + 20), mouseY - rulerOffsetY));

//       drawSetup();
//   }
// });


// // canvas.addEventListener("mousemove", (event) => {
// //   if (isDraggingRuler) {
// //       const rect = canvas.getBoundingClientRect();
// //       const mouseX = event.clientX - rect.left;
// //       const mouseY = event.clientY - rect.top;

// //       rulerPositionX = Math.max(0, mouseX - rulerOffsetX);
// //       rulerPositionY = Math.max(0, mouseY - rulerOffsetY);
// //       drawSetup();
// //   }
// // });

// const pixelPerCm = pixelPerMeter / 100; 
// canvas.addEventListener("mouseup", () => {
//   isDraggingRuler = false;
// });
// drawSetup();

// function updateAirColumnLength(){
//   const airColumnLength = calculateAirColumnLength();
//   lengthDisplay.textContent = `${airColumnLength} cm`;
//   checkForResonance();
// }


// function calculateAirColumnLength() {
//   const tubeRect = tube.getBoundingClientRect();
//   const waterRect = tubeWater.getBoundingClientRect();
//   const forkRect = tuningFork.getBoundingClientRect();
//   const airColumnHeightInPixels = waterRect.top - forkRect.bottom; 
//   const airColumnLength = airColumnHeightInPixels > 0 ? airColumnHeightInPixels / pixelPerCm : 0;
//   return airColumnLength.toFixed(2);
// }


// function checkForResonance() {
//   const airColumnLength= parseFloat(calculateAirColumnLength());
//   const frequency = parseFloat(frequencyInput.value);
//     const speedOfSound = 34300; 
//     const tubeRadius = parseInt(diameterInput.value)/2;
//     const correction = 0.6 * tubeRadius; 
//     const effectiveLength = airColumnLength + correction;
//     const wavelength = 4 * effectiveLength; 
//     const calculatedFrequency = speedOfSound / wavelength; 
//     calFreqDisp.textContent = `${calculatedFrequency.toFixed(2)} Hz`; 
//     console.log("Column Length: ",airColumnLength,"frequencyInout: ",frequency, "tube Radius: ",tubeRadius, "Correction: ",correction, "Calculated Frequency ",calculatedFrequency)


//   diameterDisplay.textContent = `${diameter.toFixed(2)} cm`;
//   if (isVibrating) {
//       if (Math.abs(frequency - calculatedFrequency) <= 1 && !isResonancePlaying) {
//           console.log("Resonance condition met! Playing sound...");
//           playResonanceSound(frequency); 
//           isResonancePlaying = true;
//       } else if (Math.abs(frequency - calculatedFrequency) > 1 && isResonancePlaying) {
//           stopResonanceSound();
//           isResonancePlaying = false;
//         }
//   }
//   else {
//       window.alert("please vibrate the fork first");
//     }
// }


// function stopResonanceSound() {
//   if (resonanceOscillator) resonanceOscillator.stop();
//   console.log("Stopped resonance sound.");
//   isResonancePlaying = false;
// }

// function playResonanceSound(frequency) {
//   if (!audioContext) createAudioContext();
//   resonanceOscillator = audioContext.createOscillator();
//   resonanceOscillator.type = 'sine';
//   resonanceOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
//   resonanceOscillator.connect(audioContext.destination);
//   console.log("Playing resonance sound at frequency:", frequency);
//   resonanceOscillator.start();
//   setTimeout(() => {
//       resonanceOscillator.stop();
//       isResonancePlaying = false;
//   }, 1000);
//   console.log("AudioContext state:", audioContext.state);
// }



// let canvasHeight = canvas.height; 
// let tubeHeight = tube.offsetHeight; 
// let airColumnLength;

// let forkOffsetX = 0;
// let forkOffsetY = 0;

// tuningFork.addEventListener("mousedown", (event) => {
//   isDraggingFork = true;
//   forkOffsetX = event.clientX - tuningFork.offsetLeft;
//   forkOffsetY = event.clientY - tuningFork.offsetTop;
// });

// document.addEventListener("mousemove", (event) => {
//   if (isDraggingFork) {
//       const newForkX = Math.max(0, event.clientX - forkOffsetX);
//       const newForkY = Math.max(0, event.clientY - forkOffsetY);
//       tuningFork.style.left = `${newForkX}px`;
//       tuningFork.style.top = `${newForkY}px`;
//     const airColumnLength = canvas.height - newForkY - document.getElementById("tube").offsetHeight;
//     updateAirColumnLength(); 
//   }
// });

// document.addEventListener("mouseup", () => {
//   isDraggingFork = false;
// });


// tubePositionInput.addEventListener('input', () => {
//   const tubePosition = parseFloat(tubePositionInput.value);
//     tubepositionValue.textContent = `${tubePosition} cm`
//  tube.style.top = `${tubePosition}px`; // Update tube position on screen
//  clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
//     tubeWater.style.height = `${tubePosition-90}px`;
//     updateAirColumnLength();
// });
// tubeWater.addEventListener('transitionend', updateAirColumnLength);


// document.getElementById("tubePosition-increase").addEventListener("click", () => {
//   tubePosition = Math.min(parseFloat(tubePositionInput.max), parseFloat(tubePositionInput.value) + 5);
//   tubePositionInput.value = tubePosition; // Sync with range slider
//   tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
//   tube.style.top = `${tubePosition}px`; // Update tube position on screen
//   clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
//      tubeWater.style.height = `${tubePosition-90}px`;
//      updateAirColumnLength();
// });


// document.getElementById("tubePosition-decrease").addEventListener("click", () => {
//   tubePosition = Math.max(parseFloat(tubePositionInput.min), parseFloat(tubePositionInput.value) - 5);
//   tubePositionInput.value = tubePosition; // Sync with range slider
//   tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
//   tube.style.top = `${tubePosition}px`; // Update tube position on screen
//   clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
//      tubeWater.style.height = `${tubePosition-90}px`;
//      updateAirColumnLength();
// });


// // Frequency
// frequencyInput.addEventListener("input", () => {
//   frequency = parseFloat(frequencyInput.value);
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   updateAirColumnLength(); 
// });

// document.getElementById("frequency-increase").addEventListener("click", () => {
//   frequency = Math.min(parseFloat(frequencyInput.max), parseFloat(frequencyInput.value) + 1);
//   frequencyInput.value = frequency; // Sync with range slider
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   updateAirColumnLength(); 
// });

// document.getElementById("frequency-decrease").addEventListener("click", () => {
//   frequency = Math.max(parseFloat(frequencyInput.min), parseFloat(frequencyInput.value) - 1);
//   frequencyInput.value = frequency; // Sync with range slider
//   frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
//   updateAirColumnLength(); 
// });

// // Diameter
// diameterInput.addEventListener("input", () => {
//   diameter = parseFloat(diameterInput.value);
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter * 2}px`;
//   updateAirColumnLength(); 
// });

// document.getElementById("diameter-increase").addEventListener("click", () => {
//   diameter = Math.min(parseFloat(diameterInput.max), parseFloat(diameterInput.value) + 1);
//   diameterInput.value = diameter; // Sync with range slider
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter * 2}px`;
//   updateAirColumnLength(); 
// });

// document.getElementById("diameter-decrease").addEventListener("click", () => {
//   diameter = Math.max(parseFloat(diameterInput.min), parseFloat(diameterInput.value) - 1);
//   diameterInput.value = diameter; // Sync with range slider
//   diameterValue.textContent = `${diameter} cm`; // Update the displayed value
//   tube.style.width = `${diameter * 2}px`;
//   updateAirColumnLength(); 
// });


// resetExp.addEventListener("click", () => {
//   stopforkVibration();
//   stopResonanceSound();
//   frequencyValue.textContent = 230 + `Hz`;
//   frequencyInput.value = 230;
//   tubePositionInput.value = 140;
//   tubepositionValue.textContent = 140;
//   diameterInput.value = 5;
//   diameterValue.textContent = 5 + `cm`;

//   tube.style.width = `${5 * 2}px`;
//   tube.style.top = `${140}px`;
//   clampHolder.style.top = `${140 + 60}px`;

//   lengthDisplay.textContent = 0.0 + `cm`;
//   diameterDisplay.textContent = 0 + `Hz`;
//   calFreqDisp.textContent = 0;
//   updateCanvas();
//  window.location.reload();

// })

// initializeCanvas();
// updateCanvas();
// // createAudioContext();
// window.onload = initializeCanvas;
// window.onresize = initializeCanvas;
// canvas.addEventListener('click', () => {
//     createAudioContext();
// });



let audioContext, resonanceOscillator;
let resonancePoints = [];
let isResonancePlaying = false;
let isDragging = false;
let offsetX, offsetY;
let isVibrating = false;
const tube = document.getElementById("tube");
const tubeWater = document.getElementById("tubeWater");
const clampHolder = document.getElementById("clampHolder");
const tuningFork = document.getElementById("tuningFork");
const frequencyInput = document.getElementById("Frequency");
let frequencyValue = document.getElementById("frequency-value");
const diameterInput = document.getElementById("tube-diameter");
let diameterValue = document.getElementById("diameter-value");
const tubePositionInput = document.getElementById("tubePosition");
let tubepositionValue = document.getElementById("tubePosition-value");
const startVibration = document.getElementById('startVibration');
const resetExp = document.getElementById("reset");
const showScaleCheckbox = document.getElementById("showScale");
const pixelPerMeter = 400; // Pixels per meter for scaling
let frequency = parseInt(frequencyInput.value);
let diameter = parseFloat(diameterInput.value);
let tubePosition = parseFloat(tubePositionInput.value);
let canvas = document.getElementById("ResonanceTubeCanvas");
const ctx = canvas.getContext("2d");
const forks = document.querySelectorAll(".tuning-fork1, .tuning-fork2, .tuning-fork3, .tuning-fork4");
const mainFork = document.querySelector(".tuning-fork");
const lengthDisplay = document.getElementById("length");
const diameterDisplay = document.getElementById("diameterDis");
const calFreqDisp = document.getElementById("Cal-freq");
const soundVelocityDisplay = document.getElementById("sound-velocity");
const graphSoundVelocityDisplay = document.getElementById("graph-sound-velocity");
let selectedFork = null;
let rippleX = 0;
let rippleY = 0;
let soundWaveCircles = [];
let animationFrameId;
let lengthFreqData = [];

let lengthFreqChart;

function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawSetup();
    if (!animationFrameId) {
        animate();
    }
}

// Initialize tooltips for all elements with data-intro
function initializeTooltips() {
    const elements = document.querySelectorAll('[data-intro]');
    
    elements.forEach(el => {
      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = el.getAttribute('data-intro');
      document.body.appendChild(tooltip);
      
      // Position tooltip on mouseenter
      el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        
        if (el.id === 'tuningFork' || el.classList.contains('controls') || 
            el.classList.contains('output-container') || el.classList.contains('exp-tools') ||
            el.classList.contains('forks') || el.id === 'length-vs-freq-chart' ||
            el.classList.contains('checkBoxex') || el.classList.contains('canvasButton')) {
          tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
        } else {
          tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
        }
        
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      });
      
      // Hide tooltip on mouseleave
      el.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      });
    });
  }
  
  // Call this in your window.onload
  window.onload = function() {
    initializeCanvas();
    initializeTooltips();
    createAudioContext();
  };
  
  // Remove this block from start-tour.js
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const rect = e.target.getBoundingClientRect();
      tooltip.textContent = e.target.dataset.tooltip;
      tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      tooltip.classList.add('active');
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
window.onresize = initializeCanvas;

document.addEventListener('DOMContentLoaded', function () {
    drawLengthVsFreqChart();
        const tabs = document.querySelectorAll(".navigation-bar .tab");
        tabs.forEach(function(tab) {
            tab.addEventListener("click", function(e) {
                // e.preventDefault(); ❌ remove or comment this line
              
                tabs.forEach(function(t) {
                  t.classList.remove("active");
                });
              
                this.classList.add("active");
              
                const section = this.getAttribute("data-section");
                console.log("Navigated to: " + section);
              });
              
        });
});

function drawLengthVsFreqChart() {
    const ctx = document.getElementById('lengthFreqChart').getContext('2d');

    // Prepare data for the chart
    const labels = lengthFreqData.map(data => data.length); 
    const dataPoints = lengthFreqData.map(data => data.Freq); 

    // Check if the chart already exists
    if (lengthFreqChart) {
        // Update chart data
        lengthFreqChart.data.labels = labels;
        lengthFreqChart.data.datasets[0].data = dataPoints;
        lengthFreqChart.update();
    } else {
        // Create a new chart
        lengthFreqChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Length vs. Frequency',
                    data: dataPoints
                }]
            },
            options: {
                responsive: true,
                // plugins: {
                //     legend: {
                //         display: true,
                //         position: 'top',
                //     }
                // },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Length (cm)',
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequency (Hz)',
                        }
                    }
                }
            }
        });
    }
}

// Call this function after updating lengthFreqData
function updateGraph() {
    drawLengthVsFreqChart();
}

forks.forEach((fork) => {
    fork.addEventListener('click', () => {
        if (selectedFork) {
            selectedFork.classList.remove('selected-fork');
        }
        fork.classList.add('selected-fork');
        selectedFork = fork;
        mainFork.style.animation = '';
        mainFork.querySelector('.handle').style.background = '';
        mainFork.querySelectorAll('.prong').forEach((prong) => {
            prong.style.background = '';
        });
        const handleStyle = window.getComputedStyle(fork.querySelector('.handle'));
        mainFork.querySelector('.handle').style.background = handleStyle.background;
        const prongStyle = window.getComputedStyle(fork.querySelector('.prong'));
        mainFork.querySelectorAll('.prong').forEach((prong) => {
            prong.style.background = prongStyle.background;
        });
        updateFrequency(parseInt(fork.getAttribute('frequency')));
    });
});

function updateFrequency(frequency) {
    frequencyInput.value = frequency;
    frequencyValue.textContent = `${frequency} Hz`;
}

function drawSetup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawVerticalScale(); // Draw the vertical scale
}

addValuesBtn.addEventListener('click', function () {
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';  // Show the table
    } else {
        tableContainer.style.display = 'none';  // Hide the table
    }
});

// Event listener for "Vibrate" button
startVibration.addEventListener('click', function () {
    if (!isVibrating) {
        isVibrating = true;
        const prongs = tuningFork.querySelectorAll('.prong');
        prongs.forEach((prong) => {
            prong.style.animation = 'vibration 0.1s infinite';
        });
        console.log("Prong vibration started.");
    }
    else {
        isVibrating = false;
        const prongs = tuningFork.querySelectorAll('.prong');
        prongs.forEach((prong) => {
            prong.style.animation = 'none';
        });
        console.log("Prong vibration stopped.");
    }
});

function stopforkVibration() {
    isVibrating = false;
    const prongs = tuningFork.querySelectorAll('.prong');
    prongs.forEach((prong) => {
        prong.style.animation = 'none';
    });
    console.log("Prong vibration stopped.");
}

function createAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully.");
        }).catch(err => console.error("Failed to resume AudioContext:", err));
    }
}

// Ruler functionality
let rulerPositionX = canvas.width / 2 + 100;
let rulerPositionY = 350;
let rulerOffsetX = 0;
let rulerOffsetY = 0;
let isScaleVisible = false; // Tracks if the scale is visible
let isDraggingRuler = false;
let isDraggingFork = false;
const rulerIcon = document.getElementById("rulerIcon");

function drawVerticalScale() {
    if (!isScaleVisible) return;
    const scaleHeight = 1; // Scale in meters
    const scaleWidth = 46;
    ctx.fillStyle = "orange";
    ctx.fillRect(
        rulerPositionX,
        rulerPositionY - 10,
        scaleWidth,
        scaleHeight * pixelPerMeter + 20
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
        rulerPositionX,
        rulerPositionY - 10,
        scaleWidth,
        scaleHeight * pixelPerMeter + 20
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rulerPositionX + scaleWidth / 2, rulerPositionY - 5);
    ctx.lineTo(
        rulerPositionX + scaleWidth / 2,
        rulerPositionY + scaleHeight * pixelPerMeter
    );
    ctx.stroke();
    for (let i = 0; i <= scaleHeight * 100; i++) {
        const y = rulerPositionY + (i * pixelPerMeter) / 100;
        ctx.beginPath();
        ctx.moveTo(rulerPositionX + scaleWidth / 2, y);
        ctx.lineTo(
            rulerPositionX + scaleWidth / 2 - (i % 5 === 0 ? 10 : 5),
            y
        );
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        if (i % 5 === 0) {
            ctx.font = "10px Arial";
            ctx.textAlign = "right";
            ctx.fillStyle = "black";
            ctx.fillText(
                `${i} cm`,
                rulerPositionX + scaleWidth - 10,
                y + 3
            );
        }
    }
}

rulerIcon.addEventListener("click", (event) => {
    if (!isScaleVisible) {
        isScaleVisible = true;
        drawSetup();
    }
    else{
        isScaleVisible = false;
        drawSetup();
    }
});

canvas.addEventListener("mousedown", (event) => {
    if (isScaleVisible) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;


        if (
            mouseX >= rulerPositionX &&
            mouseX <= rulerPositionX + 46 &&
            mouseY >= rulerPositionY - 10 &&
            mouseY <= rulerPositionY + pixelPerMeter + 20
        ) {
            isDraggingRuler = true;
            rulerOffsetX = mouseX - rulerPositionX;
            rulerOffsetY = mouseY - rulerPositionY;
        }
    }
});

// Mousemove to drag the scale
canvas.addEventListener("mousemove", (event) => {
    if (isDraggingRuler) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        rulerPositionX = Math.max(0, mouseX - rulerOffsetX);
        rulerPositionY = Math.max(0, mouseY - rulerOffsetY);
        drawSetup();
    }
});

const pixelPerCm = pixelPerMeter / 100; // Pixels per centimeter
// Stop dragging on mouseup
canvas.addEventListener("mouseup", () => {
    isDraggingRuler = false;
});
drawSetup();

function updateAirColumnLength() {
    const airColumnLength = calculateAirColumnLength();
    lengthDisplay.textContent = `${airColumnLength} cm`; // Update the display
    checkForResonance(); // Use the updated length in the resonance check
}

function calculateAirColumnLength() {
    const tubeRect = tube.getBoundingClientRect();
    const waterRect = tubeWater.getBoundingClientRect();
    const forkRect = tuningFork.getBoundingClientRect();
    const airColumnHeightInPixels = waterRect.top - forkRect.bottom; // Use fork's bottom as the reference
    const airColumnLength = airColumnHeightInPixels > 0 ? airColumnHeightInPixels / pixelPerCm : 0;
    return airColumnLength.toFixed(2); // Convert to cm and return rounded value
}


function checkForResonance() {
    const airColumnLength = parseFloat(calculateAirColumnLength());
    const frequency = parseFloat(frequencyInput.value); // User-specified frequency
    const speedOfSound = 34300; // Speed of sound in cm/s
    const tubeRadius = parseInt(diameterInput.value) / 2;
    const correction = 0.6 * tubeRadius; // Open-end correction
    const effectiveLength = airColumnLength + correction; // Effective length in cm
    const wavelength = 4 * effectiveLength; // Resonance condition for closed pipe
    const calculatedFrequency = speedOfSound / wavelength; // Calculate frequency
    const soundVelocity = frequency * wavelength;
    calFreqDisp.textContent = `${calculatedFrequency.toFixed(2)} Hz`;
    diameterDisplay.textContent = `${diameter.toFixed(2)} cm`;
    const velocityInMeters = soundVelocity / 100;
    soundVelocityDisplay.textContent = `${velocityInMeters.toFixed(2)} cm/s`;

    if (isVibrating) {
        if (Math.abs(frequency - calculatedFrequency) <= 1 && !isResonancePlaying) {
            console.log("Resonance condition met! Playing sound...");
            playResonanceSound(frequency);
            isResonancePlaying = true;
            lengthFreqData.push({ length: airColumnLength, Freq: calculatedFrequency });
                updateGraph(); // Update the graph
                console.log(lengthFreqData);
        } else if (Math.abs(frequency - calculatedFrequency) > 1 && isResonancePlaying) {
            stopResonanceSound();
            isResonancePlaying = false;
        }
    }
    else {
        window.alert("please vibrate the fork first");
    }
}


function stopResonanceSound() {
    if (resonanceOscillator) resonanceOscillator.stop();
    console.log("Stopped resonance sound.");
    isResonancePlaying = false;
}

function playResonanceSound(frequency) {
    if (!audioContext) createAudioContext();
    resonanceOscillator = audioContext.createOscillator();
    resonanceOscillator.type = 'sine';
    resonanceOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    resonanceOscillator.connect(audioContext.destination);
    console.log("Playing resonance sound at frequency:", frequency);
    resonanceOscillator.start();
    setTimeout(() => {
        resonanceOscillator.stop();
        isResonancePlaying = false;
    }, 5000);
    console.log("AudioContext state:", audioContext.state);
}


function animate() {
    drawSetup();
    animationFrameId = requestAnimationFrame(animate);
}


let forkOffsetX = 0;
let forkOffsetY = 0;
tuningFork.addEventListener("mousedown", (event) => {
    isDraggingFork = true;
    forkOffsetX = event.clientX - tuningFork.offsetLeft;
    forkOffsetY = event.clientY - tuningFork.offsetTop;
});
document.addEventListener("mousemove", (event) => {
    if (isDraggingFork) {
        const newForkX = Math.max(0, event.clientX - forkOffsetX);
        const newForkY = Math.max(0, event.clientY - forkOffsetY);
        tuningFork.style.left = `${newForkX}px`;
        tuningFork.style.top = `${newForkY}px`;
        const airColumnLength = canvas.height - newForkY - document.getElementById("tube").offsetHeight;
        updateAirColumnLength();
    }
});
document.addEventListener("mouseup", () => {
    isDraggingFork = false;
});

tubePositionInput.addEventListener('input', () => {
    const tubePosition = parseFloat(tubePositionInput.value); // Get the input position
    tubepositionValue.textContent = `${tubePosition} cm`
    tube.style.top = `${tubePosition}px`; // Update tube position on screen
    clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
    tubeWater.style.height = `${tubePosition - 100}px`;
    updateAirColumnLength();
});
tubeWater.addEventListener('transitionend', updateAirColumnLength);


document.getElementById("tubePosition-increase").addEventListener("click", () => {
  tubePosition = Math.min(parseFloat(tubePositionInput.max), parseFloat(tubePositionInput.value) + 5);
  tubePositionInput.value = tubePosition; // Sync with range slider
  tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
  tube.style.top = `${tubePosition}px`; // Update tube position on screen
  clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
     tubeWater.style.height = `${tubePosition-100}px`;
     updateAirColumnLength();
});


document.getElementById("tubePosition-decrease").addEventListener("click", () => {
  tubePosition = Math.max(parseFloat(tubePositionInput.min), parseFloat(tubePositionInput.value) - 5);
  tubePositionInput.value = tubePosition; // Sync with range slider
  tubepositionValue.textContent = `${tubePosition} cm`; // Update the displayed value
  tube.style.top = `${tubePosition}px`; // Update tube position on screen
  clampHolder.style.top = `${tubePosition + 30}px`; // Adjust clamp holder position accordingly
  tubeWater.style.height = `${tubePosition-100}px`;
  updateAirColumnLength();
});

// Frequency
frequencyInput.addEventListener("input", () => {
    frequency = parseFloat(frequencyInput.value);
    frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
    updateAirColumnLength();
});

document.getElementById("frequency-increase").addEventListener("click", () => {
    frequency = Math.min(parseFloat(frequencyInput.max), parseFloat(frequencyInput.value) + 1);
    frequencyInput.value = frequency; // Sync with range slider
    frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
    updateAirColumnLength();
});

document.getElementById("frequency-decrease").addEventListener("click", () => {
    frequency = Math.max(parseFloat(frequencyInput.min), parseFloat(frequencyInput.value) - 1);
    frequencyInput.value = frequency; // Sync with range slider
    frequencyValue.textContent = `${frequency} Hz`; // Update the displayed value
    updateAirColumnLength();
});

// Diameter
diameterInput.addEventListener("input", () => {
    diameter = parseFloat(diameterInput.value);
    diameterValue.textContent = `${diameter} cm`; // Update the displayed value
    tube.style.width = `${diameter * 2}px`;
    updateAirColumnLength();
});

document.getElementById("diameter-increase").addEventListener("click", () => {
    diameter = Math.min(parseFloat(diameterInput.max), parseFloat(diameterInput.value) + 1);
    diameterInput.value = diameter; // Sync with range slider
    diameterValue.textContent = `${diameter} cm`; // Update the displayed value
    tube.style.width = `${diameter * 2}px`;
    updateAirColumnLength();
});

document.getElementById("diameter-decrease").addEventListener("click", () => {
    diameter = Math.max(parseFloat(diameterInput.min), parseFloat(diameterInput.value) - 1);
    diameterInput.value = diameter; // Sync with range slider
    diameterValue.textContent = `${diameter} cm`; // Update the displayed value
    tube.style.width = `${diameter * 2}px`;
    updateAirColumnLength();
});

resetExp.addEventListener("click", () => {
    stopforkVibration();
    stopResonanceSound();
    frequencyValue.textContent = 230 + `Hz`;
    frequencyInput.value = 230;
    tubePositionInput.value = 140;
    tubepositionValue.textContent = 140;
    diameterInput.value = 5;
    diameterValue.textContent = 5 + `cm`;
    tube.style.width = `${5 * 2}px`;
    tube.style.top = `${140}px`;
    clampHolder.style.top = `${140 + 60}px`;
    lengthDisplay.textContent = 0.0 + `cm`;
    diameterDisplay.textContent = 0 + `Hz`;
    calFreqDisp.textContent = 0;
    soundVelocityDisplay.textContent = 0 + `cm/s`;
    graphSoundVelocityDisplay.textContent = 0 + `cm/s`;
    window.location.reload();
})




window.onload = initializeCanvas;
window.onresize = initializeCanvas;
canvas.addEventListener('click', () => {
    createAudioContext();
});