

// const canvas = document.getElementById("experimentCanvas");
// const ctx = canvas.getContext("2d");

// let isOscillating = false;
// let mass = 0;
// let bobRadius = 0;
// let velocity = 0;
// let acceleration = 0;
// let timeElapsed = 0;
// let springLength = 0; // To store the length of the spring when stretched
// let recordedLength = 0; // To store the length after the first oscillation
// const springTopX = canvas.width / 2;
// const springTopY = 50;
// const naturalLength = 150;

// const springConstant = 0.5; // Spring constant (Hooke's law)
// const damping = 0.99; // Damping factor to reduce oscillation over time

// function drawSetup() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw vertical scale
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 50, springTopY);
//     ctx.lineTo(springTopX - 50, canvas.height - 50);
//     ctx.strokeStyle = "black";
//     ctx.stroke();

//     // Draw scale markings and labels
//     ctx.font = "12px Arial";
//     ctx.fillStyle = "black";
//     for (let i = 0; i <= 14; i++) {
//         let y = springTopY + i * 25; // 25 pixels for each step
//         ctx.moveTo(springTopX - 50, y);
//         ctx.lineTo(springTopX - 60, y);
//         ctx.stroke();
//         ctx.fillText(`${i * 5} cm`, springTopX - 90, y + 5); // Label the scale
//     }

//     // Draw the spring with coils
//     const coils = 10; // Number of coils
//     const coilLength = (springLength - springTopY) / coils; // Length of each coil
//     const amplitude = 10; // Horizontal displacement for each coil
//     ctx.beginPath();
//     ctx.moveTo(springTopX, springTopY);

//     for (let i = 0; i < coils; i++) {
//         const x = (i % 2 === 0) ? springTopX - amplitude : springTopX + amplitude;
//         const y = springTopY + i * coilLength;
//         ctx.lineTo(x, y);
//     }

//     ctx.lineTo(springTopX, springLength); // End the spring at the bob's position
//     ctx.strokeStyle = 'black';
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Draw the pointer
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 15, springLength);
//     ctx.lineTo(springTopX + 15, springLength);
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 3;
//     ctx.stroke();

//     // Draw the bob
//     ctx.beginPath();
//     ctx.arc(springTopX, springLength + bobRadius, bobRadius, 0, 2 * Math.PI);
//     ctx.fillStyle = "gray";
//     ctx.fill();

//     // Draw weights label
//     ctx.fillStyle = "black";
//     ctx.fillText("Weights", springTopX - 20, springLength + bobRadius + 10);

//     // Display the length on the scale
//     const lengthOnScale = ((recordedLength - springTopY) / 25).toFixed(2) * 5;
//     document.getElementById("length").innerText = lengthOnScale + " cm";
// }

// function calculateSpringLength() {
//     let force = mass * 9.8; // Force due to gravity (F = mg)
//     let extension = force / springConstant; // Hooke's law (F = kx => x = F/k)
//     return springTopY + naturalLength + extension; // Total length of the spring
// }

// function startOscillation() {
//     if (!isOscillating) {
//         mass = parseFloat(document.getElementById("mass").value);
//         const maxOscillations = parseInt(document.getElementById("oscillations").value);

//         if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
//             alert("Please enter valid positive values for mass and number of oscillations.");
//             return;
//         }

//         isOscillating = true;
//         bobRadius = mass * 5;

//         // Calculate initial spring length
//         springLength = calculateSpringLength();

//         // Record the length of the spring after the first oscillation
//         recordedLength = springLength;

//         // Calculate time period using the formula T = 2 * pi * sqrt(m / k)
//         const timePeriod = 2 * Math.PI * Math.sqrt(mass / springConstant);
//         document.getElementById("timePeriod").innerText = timePeriod.toFixed(2) + " s";

//         // Calculate gravity using the formula g = 4 * pi^2 * L / T^2
//         const gravityCalculated = (4 * Math.PI * Math.PI * recordedLength) / (timePeriod * timePeriod);
//         document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";

//         document.getElementById("output").style.display = "block";
//         animate(); // Start the animation
//     }
// }

// function animate() {
//     if (isOscillating) {
//         // Calculate displacement from natural length
//         let displacement = springLength - (springTopY + naturalLength);

//         // Calculate force using Hooke's law: F = -k * x
//         let force = -springConstant * displacement;

//         // Update acceleration, velocity, and spring length
//         acceleration = force / mass; // Acceleration = Force / Mass
//         velocity += acceleration; // Update velocity
//         velocity *= damping; // Apply damping
//         springLength += velocity; // Update spring length

//         drawSetup(); // Redraw the setup

//         // Stop oscillation when the velocity and displacement are minimal
//         if (Math.abs(velocity) > 0.01 || Math.abs(displacement) > 0.1) {
//             requestAnimationFrame(animate); // Continue the animation
//         } else {
//             isOscillating = false;
//         }
//     }
// }

// function resetExperiment() {
//     isOscillating = false;
//     bobRadius = 15;
//     velocity = 0;
//     acceleration = 0;
//     springLength = springTopY + naturalLength;
//     recordedLength = 0; // Reset recorded length
//     drawSetup();
//     document.getElementById("output").style.display = "none";
//     document.getElementById("mass").value = "";
//     document.getElementById("oscillations").value = "";
// }

// document.getElementById("startBtn").addEventListener("click", startOscillation);
// document.getElementById("resetBtn").addEventListener("click", resetExperiment);

// drawSetup();


// const canvas = document.getElementById("experimentCanvas");
// const ctx = canvas.getContext("2d");

// let isOscillating = false;
// let mass = 0;
// let bobRadius = 0;
// let velocity = 0;
// let acceleration = 0;
// let springLength = 0; // To store the length of the spring when stretched
// let recordedLength = 0; // To store the length after the first oscillation
// let oscillationCount = 0;
// let startTime = 0;
// let endTime = 0;
// let maxOscillations = 0;
// let lastCrossingTime = 0; // Time when the spring last crossed the natural length
// let oscillationTimes = []; // Array to store times of each crossing

// const springTopX = canvas.width / 2;
// const springTopY = 50;
// const naturalLength = 150;

// const springConstant = 0.5; // Spring constant (Hooke's law)
// const damping = 0.99; // Damping factor to reduce oscillation over time

// function drawSetup() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw vertical scale
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 50, springTopY);
//     ctx.lineTo(springTopX - 50, canvas.height - 50);
//     ctx.strokeStyle = "black";
//     ctx.stroke();

//     // Draw scale markings and labels
//     ctx.font = "12px Arial";
//     ctx.fillStyle = "black";
//     for (let i = 0; i <= 14; i++) {
//         let y = springTopY + i * 25; // 25 pixels for each step
//         ctx.moveTo(springTopX - 50, y);
//         ctx.lineTo(springTopX - 60, y);
//         ctx.stroke();
//         ctx.fillText(`${i * 5} cm`, springTopX - 90, y + 5); // Label the scale
//     }

//     // Draw the spring with coils
//     const coils = 10; // Number of coils
//     const coilLength = (springLength - springTopY) / coils; // Length of each coil
//     const amplitude = 10; // Horizontal displacement for each coil
//     ctx.beginPath();
//     ctx.moveTo(springTopX, springTopY);

//     for (let i = 0; i < coils; i++) {
//         const x = (i % 2 === 0) ? springTopX - amplitude : springTopX + amplitude;
//         const y = springTopY + i * coilLength;
//         ctx.lineTo(x, y);
//     }

//     ctx.lineTo(springTopX, springLength); // End the spring at the bob's position
//     ctx.strokeStyle = 'black';
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Draw the pointer
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 15, springLength);
//     ctx.lineTo(springTopX + 15, springLength);
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 3;
//     ctx.stroke();

//     // Draw the bob
//     ctx.beginPath();
//     ctx.arc(springTopX, springLength + bobRadius, bobRadius, 0, 2 * Math.PI);
//     ctx.fillStyle = "gray";
//     ctx.fill();

//     // Draw weights label
//     ctx.fillStyle = "black";
//     ctx.fillText("Weights", springTopX - 20, springLength + bobRadius + 10);

//     // Display the length on the scale
//     const lengthOnScale = ((recordedLength - springTopY) / 25).toFixed(2) * 5;
//     document.getElementById("length").innerText = lengthOnScale + " cm";
// }

// function calculateSpringLength() {
//     let force = mass * 9.8; // Force due to gravity (F = mg)
//     let extension = force / springConstant; // Hooke's law (F = kx => x = F/k)
//     return springTopY + naturalLength + extension; // Total length of the spring
// }

// function startOscillation() {
//     if (!isOscillating) {
//         mass = parseFloat(document.getElementById("mass").value);
//         maxOscillations = parseInt(document.getElementById("oscillations").value);

//         if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
//             alert("Please enter valid positive values for mass and number of oscillations.");
//             return;
//         }

//         isOscillating = true;
//         bobRadius = mass * 5;

//         // Initialize variables for oscillation tracking
//         oscillationCount = 0;
//         startTime = performance.now(); // Record the start time
//         lastCrossingTime = startTime;
//         oscillationTimes = []; // Reset the times array

//         // Calculate initial spring length
//         springLength = calculateSpringLength();

//         // Record the length of the spring after the first oscillation
//         recordedLength = springLength;

//         document.getElementById("output").style.display = "block";
//         animate(); // Start the animation
//     }
// }

// function animate() {
//     if (isOscillating) {
//         // Calculate displacement from natural length
//         let displacement = springLength - (springTopY + naturalLength);

//         // Calculate force using Hooke's law: F = -k * x
//         let force = -springConstant * displacement;

//         // Update acceleration, velocity, and spring length
//         acceleration = force / mass; // Acceleration = Force / Mass
//         velocity += acceleration; // Update velocity
//         velocity *= damping; // Apply damping
//         springLength += velocity; // Update spring length

//         drawSetup(); // Redraw the setup

//         // Detect when an oscillation is completed (i.e., when it crosses the natural length)
//         if (Math.abs(velocity) < 0.01 && Math.abs(displacement) < 0.1) {
//             oscillationCount++;

//             // Record the length of the spring after the first oscillation
//             if (oscillationCount === 1) {
//                 recordedLength = springLength;
//             }

//             // Check if the desired number of oscillations is reached
//             if (oscillationCount >= maxOscillations) {
//                 isOscillating = false;
//                 endTime = performance.now(); // Record the end time

//                 // Calculate the total time and time period
//                 const totalTime = (endTime - startTime) / 1000; // Convert to seconds
//                 const timePeriod = (totalTime / (oscillationCount - 1)).toFixed(2); // Calculate the average period

//                 document.getElementById("timePeriod").innerText = timePeriod + " s";

//                 // Convert recordedLength to meters for the gravity calculation
//                 const lengthInMeters = (recordedLength - springTopY) / 100; // converting cm to m

//                 // Calculate gravity using the formula g = 4 * pi^2 * L / T^2
//                 const gravityCalculated = (4 * Math.PI * Math.PI * lengthInMeters) / (timePeriod * timePeriod);
//                 document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";
//             } else {
//                 requestAnimationFrame(animate); // Continue the animation
//             }
//         } else {
//             requestAnimationFrame(animate); // Continue the animation
//         }
//     }
// }

// function resetExperiment() {
//     isOscillating = false;
//     bobRadius = 15;
//     velocity = 0;
//     acceleration = 0;
//     springLength = springTopY + naturalLength;
//     recordedLength = 0; // Reset recorded length
//     oscillationCount = 0; // Reset oscillation count
//     startTime = 0;
//     endTime = 0;
//     maxOscillations = 0;
//     lastCrossingTime = 0; // Reset last crossing time
//     oscillationTimes = []; // Reset oscillation times

//     drawSetup();
//     document.getElementById("output").style.display = "none";
//     document.getElementById("mass").value = "";
//     document.getElementById("oscillations").value = "";
// }

// // Attach event listeners
// document.getElementById("startBtn").addEventListener("click", startOscillation);
// document.getElementById("resetBtn").addEventListener("click", resetExperiment);

// // Initial setup drawing
// springLength = springTopY + naturalLength;
// drawSetup();




//---------------------------------------------------------------------

/////show correct time....
// const canvas = document.getElementById("experimentCanvas");
// const ctx = canvas.getContext("2d");

// let isOscillating = false;
// let mass = 0;
// let bobRadius = 0;
// let velocity = 0;
// let acceleration = 0;
// let springLength = 0;
// let oscillationCount = 0;
// let startTime = 0;
// let maxOscillations = 0;
// let lastDirection = 1; // 1 for downward, -1 for upward

// const springTopX = canvas.width / 2;
// const springTopY = 50;
// const naturalLength = 150;

// const springConstant = 0.5;
// const damping = 0.99;

// function drawSetup() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw vertical scale
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 50, springTopY);
//     ctx.lineTo(springTopX - 50, canvas.height - 50);
//     ctx.strokeStyle = "black";
//     ctx.stroke();

//     // Draw scale markings and labels
//     ctx.font = "12px Arial";
//     ctx.fillStyle = "black";
//     for (let i = 0; i <= 14; i++) {
//         let y = springTopY + i * 25;
//         ctx.moveTo(springTopX - 50, y);
//         ctx.lineTo(springTopX - 60, y);
//         ctx.stroke();
//         ctx.fillText(`${i * 5} cm`, springTopX - 90, y + 5);
//     }

//     // Draw the spring with coils
//     const coils = 10;
//     const coilLength = (springLength - springTopY) / coils;
//     const amplitude = 10;
//     ctx.beginPath();
//     ctx.moveTo(springTopX, springTopY);

//     for (let i = 0; i < coils; i++) {
//         const x = (i % 2 === 0) ? springTopX - amplitude : springTopX + amplitude;
//         const y = springTopY + i * coilLength;
//         ctx.lineTo(x, y);
//     }

//     ctx.lineTo(springTopX, springLength);
//     ctx.strokeStyle = 'black';
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Draw the pointer
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 15, springLength);
//     ctx.lineTo(springTopX + 15, springLength);
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 3;
//     ctx.stroke();

//     // Draw the bob
//     ctx.beginPath();
//     ctx.arc(springTopX, springLength + bobRadius, bobRadius, 0, 2 * Math.PI);
//     ctx.fillStyle = "gray";
//     ctx.fill();

//     // Draw weights label
//     ctx.fillStyle = "black";
//     ctx.fillText("Weights", springTopX - 20, springLength + bobRadius + 10);

//     // Display the length on the scale
//     const lengthOnScale = ((springLength - springTopY) / 25).toFixed(2) * 5;
//     document.getElementById("length").innerText = lengthOnScale + " cm";
// }

// function calculateSpringLength() {
//     let force = mass * 9.8;
//     let extension = force / springConstant;
//     return springTopY + naturalLength + extension;
// }

// function startOscillation() {
//     if (!isOscillating) {
//         mass = parseFloat(document.getElementById("mass").value);
//         maxOscillations = parseInt(document.getElementById("oscillations").value);

//         if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
//             alert("Please enter valid positive values for mass and number of oscillations.");
//             return;
//         }

//         isOscillating = true;
//         bobRadius = mass * 5;

//         oscillationCount = 0;
//         startTime = null;

//         springLength = calculateSpringLength();
//         lastDirection = 1;

//         document.getElementById("output").style.display = "block";
//         animate();
//     }
// }

// function animate() {
//     if (isOscillating) {
//         let displacement = springLength - (springTopY + naturalLength);
//         let force = -springConstant * displacement;
//         acceleration = force / mass;
//         velocity += acceleration;
//         velocity *= damping;
//         springLength += velocity;

//         drawSetup();

//         // Check for direction change to count oscillation
//         if (velocity > 0 && lastDirection === -1) {
//             oscillationCount++;


//             if (oscillationCount === 1) {
//                 startTime = performance.now();
//             } else if (oscillationCount === maxOscillations) {
//                 isOscillating = false;
//                 const endTime = performance.now();
//                 const totalTime = (endTime - startTime) / 1000;
//                 const timePeriod = totalTime / (oscillationCount - 1);

//                 document.getElementById("timePeriod").innerText = timePeriod.toFixed(2) + " s";

//                 const lengthInMeters = (springLength - springTopY) / 100;
//                 const gravityCalculated = (4 * Math.PI * Math.PI * lengthInMeters) / (timePeriod * timePeriod);
//                 document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";

//                 return;
//             }
//         }

//         lastDirection = velocity > 0 ? 1 : -1;

//         requestAnimationFrame(animate);
//     }
// }

// function resetExperiment() {
//     isOscillating = false;
//     bobRadius = 15;
//     velocity = 0;
//     acceleration = 0;
//     springLength = springTopY + naturalLength;
//     oscillationCount = 0;
//     startTime = null;
//     lastDirection = 1;
//     maxOscillations = 0;

//     drawSetup();
//     document.getElementById("output").style.display = "none";
//     document.getElementById("mass").value = "";
//     document.getElementById("oscillations").value = "";
// }

// // Attach event listeners
// document.getElementById("startBtn").addEventListener("click", startOscillation);
// document.getElementById("resetBtn").addEventListener("click", resetExperiment);

// // Initial setup drawing
// springLength = springTopY + naturalLength;
// drawSetup();


// ---------------------------------------------------------------------//


//using anime.js

// const canvas = document.getElementById("experimentCanvas");
// const ctx = canvas.getContext("2d");

// let isOscillating = false;
// let mass = 0;
// let bobRadius = 0;
// let springLength = 0;
// let oscillationCount = 0;
// let startTime = 0;
// let maxOscillations = 0;

// const springTopX = canvas.width / 2;
// const springTopY = 50;
// const naturalLength = 150;

// const springConstant = 0.5;

// function drawSetup() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw vertical scale
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 50, springTopY);
//     ctx.lineTo(springTopX - 50, canvas.height - 50);
//     ctx.strokeStyle = "black";
//     ctx.stroke();

//     // Draw scale markings and labels
//     ctx.font = "12px Arial";
//     ctx.fillStyle = "black";
//     for (let i = 0; i <= 14; i++) {
//         let y = springTopY + i * 25;
//         ctx.moveTo(springTopX - 50, y);
//         ctx.lineTo(springTopX - 60, y);
//         ctx.stroke();
//         ctx.fillText(`${i * 5} cm`, springTopX - 90, y + 5);
//     }

//     // Draw the spring with coils
//     const coils = 10;
//     const coilLength = (springLength - springTopY) / coils;
//     const amplitude = 10;
//     ctx.beginPath();
//     ctx.moveTo(springTopX, springTopY);

//     for (let i = 0; i < coils; i++) {
//         const x = (i % 2 === 0) ? springTopX - amplitude : springTopX + amplitude;
//         const y = springTopY + i * coilLength;
//         ctx.lineTo(x, y);
//     }

//     ctx.lineTo(springTopX, springLength);
//     ctx.strokeStyle = 'black';
//     ctx.lineWidth = 2;
//     ctx.stroke();

//     // Draw the pointer
//     ctx.beginPath();
//     ctx.moveTo(springTopX - 15, springLength);
//     ctx.lineTo(springTopX + 15, springLength);
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 3;
//     ctx.stroke();

//     // Draw the bob
//     ctx.beginPath();
//     ctx.arc(springTopX, springLength + bobRadius, bobRadius, 0, 2 * Math.PI);
//     ctx.fillStyle = "gray";
//     ctx.fill();

//     // Draw weights label
//     ctx.fillStyle = "black";
//     ctx.fillText("Weights", springTopX - 20, springLength + bobRadius + 10);

//     // Display the length on the scale
//     // Display the length on the scale
// const lengthOnScale = ((springLength - springTopY) / 25 * 5).toFixed(2);
// document.getElementById("length").innerText = lengthOnScale + " cm";

//     // const lengthOnScale = ((springLength - springTopY) / 25).toFixed(2) * 5;
//     // document.getElementById("length").innerText = lengthOnScale + " cm";
// }

// function calculateSpringLength() {
//     let force = mass * 9.8;
//     let extension = force / springConstant;
//     return springTopY + naturalLength + extension;
// }



// function animateSpring() {
//     // Set up the animation with anime.js
//     anime({
//         targets: { value: springTopY + naturalLength },
//         value: springLength,  // Spring length should extend downward
//         duration: 1000,       // Adjust duration for half of one oscillation
//         easing: 'easeInOutSine',
//         direction: 'alternate',  // Oscillates back and forth
//         loop: maxOscillations * 2, // Total number of movements (up and down)
//         update: function (anim) {
//             springLength = anim.animations[0].currentValue;
//             drawSetup(); // Redraw the spring at each animation step
//         },
//         complete: function () {
//             oscillationCount++;
            
//             // When the animation completes, increment oscillation count and check
//             if (oscillationCount >= maxOscillations) {
//                 isOscillating = false;
//                 const endTime = performance.now();
//                 const totalTime = (endTime - startTime) / 1000;
//                 const timePeriod = totalTime / maxOscillations; // Calculate time period for complete oscillations

//                 document.getElementById("timePeriod").innerText = timePeriod.toFixed(2) + " s";

//                 const lengthInMeters = (springLength - springTopY) / 100;
//                 const gravityCalculated = (4 * Math.PI * Math.PI * lengthInMeters) / (timePeriod * timePeriod);
//                 document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";
//             }
//         }
//     });
// }

// function startOscillation() {
//     if (!isOscillating) {
//         mass = parseFloat(document.getElementById("mass").value);
//         maxOscillations = parseInt(document.getElementById("oscillations").value);

//         if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
//             alert("Please enter valid positive values for mass and number of oscillations.");
//             return;
//         }

//         isOscillating = true;
//         bobRadius = mass * 5;

//         oscillationCount = 0;
//         startTime = performance.now(); // Start timing immediately after the first oscillation begins

//         springLength = calculateSpringLength(); // Calculate the extended spring length based on mass

//         document.getElementById("output").style.display = "block"; // Show output area

//         animateSpring(); // Start the animation
//     }
// }

// function resetExperiment() {
//     isOscillating = false;
//     mass = 0;
//     bobRadius = 15;
//     springLength = springTopY + naturalLength;
//     oscillationCount = 0;
//     startTime = null;
//     maxOscillations = 0;

//     drawSetup(); // Reset the spring drawing
//     document.getElementById("output").style.display = "none"; // Hide output area
//     document.getElementById("mass").value = ""; // Clear mass input
//     document.getElementById("oscillations").value = ""; // Clear oscillations input
//     document.getElementById("length").innerText = "0 cm"; // Reset length display
//     document.getElementById("timePeriod").innerText = "0 s"; // Reset time period display
//     document.getElementById("gravity").innerText = "0 m/sÂ²"; // Reset gravity display
// }


// // function startOscillation() {
// //     if (!isOscillating) {
// //         mass = parseFloat(document.getElementById("mass").value);
// //         maxOscillations = parseInt(document.getElementById("oscillations").value);

// //         if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
// //             alert("Please enter valid positive values for mass and number of oscillations.");
// //             return;
// //         }

// //         isOscillating = true;
// //         bobRadius = mass * 5;

// //         oscillationCount = 0;
// //         startTime = null;

// //         springLength = calculateSpringLength();

// //         document.getElementById("output").style.display = "block";

// //         animateSpring();
// //     }
// // }



// // function animateSpring() {
// //     anime({
// //         targets: { value: natural },
// //         value: springTopY + naturalLength + (springLength - (springTopY + naturalLength)) * -1,
// //         duration: 2000,
// //         easing: 'easeInOutSine',
// //         update: function(anim) {
// //             springLength = anim.animations[0].currentValue;
// //             drawSetup();
// //         },
// //         complete: function() {
// //             oscillationCount++;
// //             if (oscillationCount === 1) {
// //                 startTime = performance.now();
// //             }

// //             if (oscillationCount < maxOscillations * 2) {
// //                 animateSpring();
// //             } else {
// //                 isOscillating = false;
// //                 const endTime = performance.now();
// //                 const totalTime = (endTime - startTime) / 1000;
// //                 const timePeriod = totalTime / (oscillationCount / 2);

// //                 document.getElementById("timePeriod").innerText = timePeriod.toFixed(2) + " s";

// //                 const lengthInMeters = (springLength - springTopY) / 100;
// //                 const gravityCalculated = (4 * Math.PI * Math.PI * lengthInMeters) / (timePeriod * timePeriod);
// //                 document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";
// //             }
// //         }
// //     });
// // }


// // function resetExperiment() {
// //     isOscillating = false;
// //     mass = 0;
// //     bobRadius = 15;
// //     springLength = springTopY + naturalLength;
// //     oscillationCount = 0;
// //     startTime = null;
// //     maxOscillations = 0;

// //     drawSetup();
// //     document.getElementById("output").style.display = "none";
// //     document.getElementById("mass").value = "";
// //     document.getElementById("oscillations").value = "";
// //     document.getElementById("length").innerText = "0 cm";
// //     document.getElementById("timePeriod").innerText = "0 s";
// //     document.getElementById("gravity").innerText = "0 m/sÂ²";
// // }

// // function resetExperiment() {
// //     isOscillating = false;
// //     bobRadius = 15;
// //     springLength = springTopY + naturalLength;
// //     oscillationCount = 0;
// //     startTime = null;
// //     maxOscillations = 0;

// //     drawSetup();
// //     document.getElementById("output").style.display = "none";
// //     document.getElementById("mass").value = "";
// //     document.getElementById("oscillations").value = "";
// // }

// // Attach event listeners
// document.getElementById("startBtn").addEventListener("click", startOscillation);
// document.getElementById("resetBtn").addEventListener("click", resetExperiment);

// // Initial setup drawing
// springLength = springTopY + naturalLength;
// drawSetup();


const canvas = document.getElementById("experimentCanvas");
const ctx = canvas.getContext("2d");

let isOscillating = false;
let mass = 0;
let bobRadius = 0;
let springLength = 0;
let oscillationCount = 0;
let startTime = 0;
let maxOscillations = 0;
let recordedLength=0;

const springTopX = canvas.width / 2;
const springTopY = 50;
const naturalLength = 150;

const springConstant = 0.5;

function drawSetup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw vertical scale
    ctx.beginPath();
    ctx.moveTo(springTopX - 50, springTopY);
    ctx.lineTo(springTopX - 50, canvas.height - 50);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw scale markings and labels
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    for (let i = 0; i <= 14; i++) {
        let y = springTopY + i * 25;
        ctx.moveTo(springTopX - 50, y);
        ctx.lineTo(springTopX - 60, y);
        ctx.stroke();
        ctx.fillText(`${i * 5} cm`, springTopX - 90, y + 5);
    }

    // Draw the spring with coils
    const coils = 10;
    const coilLength = (springLength - springTopY) / coils;
    const amplitude = 10;
    ctx.beginPath();
    ctx.moveTo(springTopX, springTopY);

    for (let i = 0; i < coils; i++) {
        const x = (i % 2 === 0) ? springTopX - amplitude : springTopX + amplitude;
        const y = springTopY + i * coilLength;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(springTopX, springLength);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the pointer
    ctx.beginPath();
    ctx.moveTo(springTopX - 15, springLength);
    ctx.lineTo(springTopX + 15, springLength);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw the bob
    ctx.beginPath();
    ctx.arc(springTopX, springLength + bobRadius, bobRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "gray";
    ctx.fill();

    // Draw weights label
    ctx.fillStyle = "black";
    ctx.fillText("Weights", springTopX - 20, springLength + bobRadius + 10);

    const lengthOnScale = ((recordedLength - springTopY) / 25).toFixed(2) * 5;
    document.getElementById("length").innerText = lengthOnScale + " cm";

    // // Display the length on the scale (initial length after stretching)
    // const lengthOnScale = ((springLength - springTopY) / 25 * 5).toFixed(2);
    // document.getElementById("length").innerText = lengthOnScale + " cm";
}

function calculateSpringLength() {
    let force = mass * 9.8;
    let extension = force / springConstant;
    return springTopY + naturalLength + extension;
}

function startOscillation() {
    if (!isOscillating) {
        mass = parseFloat(document.getElementById("mass").value);
        maxOscillations = parseInt(document.getElementById("oscillations").value);

        if (isNaN(mass) || isNaN(maxOscillations) || mass <= 0 || maxOscillations <= 0) {
            alert("Please enter valid positive values for mass and number of oscillations.");
            return;
        }

        isOscillating = true;
        bobRadius = mass * 5;

        oscillationCount = 0;
        springLength = calculateSpringLength(); // Calculate spring length once and set it
        recordedLength= springLength;

        drawSetup(); // Draw setup with initial stretched length
        startTime = performance.now(); // Start timing

        document.getElementById("output").style.display = "block"; // Show output area

        animateSpring(); // Start the animation
    }
}

function animateSpring() {
    anime({
        targets: { value: springTopY + naturalLength },
        value: springLength,  // Animate to the stretched length
        duration: 1000,       // Half period for one up-and-down motion
        easing: 'easeInOutSine',
        direction: 'alternate',  // Oscillates back and forth
        loop: maxOscillations * 2, // Total number of movements (up and down)
        update: function (anim) {
            springLength = anim.animations[0].currentValue;
            drawSetup(); // Redraw the spring at each animation step
        },
        complete: function () {
            isOscillating = false; // Stop oscillating
            const endTime = performance.now();
            const totalTime = (endTime - startTime) / 1000; // Calculate total time in seconds
            const timePeriod = totalTime / maxOscillations; // Calculate time period for one complete oscillation

            document.getElementById("timePeriod").innerText = totalTime.toFixed(2) + " s";

            const lengthInMeters = (springLength - springTopY) / 100;
            let gravityCalculated = (4 * Math.PI * Math.PI * lengthInMeters) / (timePeriod * timePeriod);
            document.getElementById("gravity").innerText = gravityCalculated.toFixed(2) + " m/sÂ²";
        }
    });
}

function resetExperiment() {
    isOscillating = false;
    mass = 0;
    bobRadius = 15;
    springLength = springTopY + naturalLength;
    oscillationCount = 0;
    startTime = null;
    maxOscillations = 0;

    drawSetup(); // Reset the spring drawing
    document.getElementById("output").style.display = "none"; // Hide output area
    document.getElementById("mass").value = ""; // Clear mass input
    document.getElementById("oscillations").value = ""; // Clear oscillations input
    document.getElementById("length").innerText = "0 cm"; // Reset length display
    document.getElementById("timePeriod").innerText = "0 s"; // Reset time period display
    document.getElementById("gravity").innerText = "0 m/sÂ²"; // Reset gravity display
}

// Attach event listeners
document.getElementById("startBtn").addEventListener("click", startOscillation);
document.getElementById("resetBtn").addEventListener("click", resetExperiment);

// Initial setup drawing
springLength = springTopY + naturalLength;
drawSetup();

