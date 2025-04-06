// document.addEventListener("DOMContentLoaded", () => {
//     const canvas = document.getElementById("expCanvas");
//     const ctx = canvas.getContext("2d");
  
//     const weightPInput = document.getElementById("weightP");
//     const weightQInput = document.getElementById("weightQ");
//     const weightPValue = document.getElementById("weightP-value");
//     const weightQValue = document.getElementById("weightQ-value");
//     const weightW = document.getElementById("weightW");
//     const verticalLengthInput = document.getElementById("verticalLength");
//      const addDataMethodSelect = document.getElementById("addDataMethod");  //For select menu
  
  
//     //Table elements for 3 trials
//     const tableWeightP = [document.getElementById("table-weightP-1"), document.getElementById("table-weightP-2"), document.getElementById("table-weightP-3")];
//     const tableWeightQ = [document.getElementById("table-weightQ-1"), document.getElementById("table-weightQ-2"), document.getElementById("table-weightQ-3")];
//     const tableAngleP = [document.getElementById("table-angleP-1"), document.getElementById("table-angleP-2"), document.getElementById("table-angleP-3")];
//     const tableAngleQ = [document.getElementById("table-angleQ-1"), document.getElementById("table-angleQ-2"), document.getElementById("table-angleQ-3")];
//     const tablePsinAngleP = [document.getElementById("table-PsinAngleP-1"), document.getElementById("table-PsinAngleP-2"), document.getElementById("table-PsinAngleP-3")];
//     const tableQsinAngleQ = [document.getElementById("table-QsinAngleQ-1"), document.getElementById("table-QsinAngleQ-2"), document.getElementById("table-QsinAngleQ-3")];
//     const tableWeightW = [document.getElementById("table-weightW-1"), document.getElementById("table-weightW-2"), document.getElementById("table-weightW-3")];
  
  
//     let weightP = parseFloat(weightPInput.value);
//     let weightQ = parseFloat(weightQInput.value);
//     let trialCount = 0;  //Starts from the very first trial
  
//     const showValuesBtn = document.getElementById("showValuesBtn");
//     const tableContainer = document.getElementById("tableContainer");
//       const addTrialBtn = document.getElementById("addTrial");
  
//     const boardWidth = 600;
//     const boardHeight = 300;
//     const pulleyOffset = 50;
//     let verticalStringLength = parseInt(verticalLengthInput.value);
  
//     // Keep track of what's dragged and the target
//     let draggedWeight = null;
//     let dropTarget = null;
  
//     //Track styling
//     let ptyle = {color: "#000", backgroundColor: "#FFF"};
//     let qWeightStyle = {color: "#000", backgroundColor: "#FFF"};
//     let pWeightEl = null;
//     let qWeightEl = null;
  
  



    
//       function saveValueToTable(){
//       const addMethod = addDataMethodSelect.value;
  
//       if (trialCount < 3) {
//           if(addMethod === "automatic"){
//               updateTableValues(trialCount, weightP, weightQ, theta1, theta2, Py, Qy, weightWValue);
//           }
//             document.getElementById(`trial${trialCount+1}`).style.display = "table-row";
//             trialCount++;
  
//           } else {
//               alert("Maximum number of trials reached (3).");
//           }

//       }
  
  
//     function drawApparatus(weightP, weightQ) {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//       // Draw background
//       ctx.fillStyle = "#f0e2e2";
//       // ctx.strokeStyle = "#ddd";

//       // Draw pulleys
//       function drawPulley(x, y) {
//         ctx.beginPath();
//         ctx.arc(x, y, 15, 0, Math.PI * 2);
//         ctx.fillStyle = "#d3d3d3";
//         ctx.fill();
//         ctx.strokeStyle = "#333";
//         ctx.lineWidth = 2;
//         ctx.stroke();
  
//         // Draw pulley details
//         ctx.beginPath();
//         ctx.arc(x, y, 10, 0, Math.PI * 2);
//         ctx.strokeStyle = "#666";
//         ctx.lineWidth = 1;
//         ctx.stroke();
  
//         ctx.beginPath();
//         ctx.arc(x, y, 3, 0, Math.PI * 2);
//         ctx.fillStyle = "#333";
//         ctx.fill();
//       }
  
//       drawPulley(pulleyOffset, 50);
//       drawPulley(boardWidth - pulleyOffset, 50);
  
//       // Calculate knot position based on weights
//       const totalWeight = weightP + weightQ;
//       const knotX = (boardWidth - 2 * pulleyOffset) * (weightQ / totalWeight) + pulleyOffset;
//       const knotY = boardHeight / 2;
  
//       // Draw strings
//       function drawString(startX, startY, endX, endY, color) {
//         ctx.beginPath();
//         ctx.moveTo(startX, startY);
//         ctx.lineTo(endX, endY);
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 2;
//         ctx.stroke();
//       }
  
//       drawString(pulleyOffset, 50, knotX, knotY, "#4169e1");
//       drawString(boardWidth - pulleyOffset, 50, knotX, knotY, "#4169e1");
//       drawString(knotX, knotY, knotX, boardHeight, "#13182c");
  
//       // Draw vertical strings for weights P and Q with adjustable length
//       drawString(pulleyOffset, 50, pulleyOffset, 50 + verticalStringLength, "#4169e1");
//       drawString(boardWidth - pulleyOffset, 50, boardWidth - pulleyOffset, 50 + verticalStringLength, "#4169e1");
  
//       // Draw weights
//       function drawWeight(x, y, color, label) {
//         // Add shadow
//         ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
//         ctx.shadowBlur = 5;
//         ctx.shadowOffsetX = 2;
//         ctx.shadowOffsetY = 2;
      
//         // Draw weight
//         ctx.fillStyle = color;
//         ctx.fillRect(x - 20, y, 40, 40);
//         ctx.strokeStyle = "#333";
//         ctx.lineWidth = 2;
//         ctx.strokeRect(x - 20, y, 40, 40);
      
//         // Reset shadow
//         ctx.shadowColor = "transparent";
      
//         // Draw label
//         ctx.fillStyle = "#fff";
//         ctx.font = "bold 16px Arial";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(label, x, y + 20);
//       }
//       // function drawWeight(x, y, color, label) {
//       //   ctx.fillStyle = color;
//       //   ctx.fillRect(x - 20, y, 40, 40);
//       //   ctx.strokeStyle = "#333";
//       //   ctx.lineWidth = 2;
//       //   ctx.strokeRect(x - 20, y, 40, 40);
  
//       //   ctx.fillStyle = "#fff";
//       //   ctx.font = "bold 16px Arial";
//       //   ctx.textAlign = "center";
//       //   ctx.textBaseline = "middle";
//       //   ctx.fillText(label, x, y + 20);
//       // }
  
//       drawWeight(pulleyOffset, 50 + verticalStringLength, pWeightStyle.backgroundColor, "P");
//       drawWeight(boardWidth - pulleyOffset, 50 + verticalStringLength, qWeightStyle.backgroundColor, "Q");
//       drawWeight(knotX, boardHeight - 40, "#0056b3", "W");
  
//       // Draw angles
//       const leftDX = knotX - pulleyOffset;
//       const rightDX = boardWidth - pulleyOffset - knotX;
//       const dY = knotY - 50;
  
//       const theta1 = Math.atan2(dY, leftDX) * (180 / Math.PI);
//       const theta2 = Math.atan2(dY, rightDX) * (180 / Math.PI);
  
//       ctx.fillStyle = "#333";
//       ctx.font = "14px Arial ";
//       ctx.fillText(`θ1: ${theta1.toFixed(2)}°`, knotX - 50, knotY + 5);
//       ctx.fillText(`θ2: ${theta2.toFixed(2)}°`, knotX + 50, knotY + 5);
  
//     }
//     let theta1 = 0;
//     let theta2 = 0;
//     let Py = 0;
//     let Qy = 0;
//     let weightWValue = 0;
  
//     let animationFrameId = null;

//     function animateString() {
//       if (animationFrameId) cancelAnimationFrame(animationFrameId);
//       animationFrameId = requestAnimationFrame(() => {
//         drawApparatus(weightP, weightQ);
//       });
//     }

//     function updateValues() {
//       weightP = Number.parseFloat(weightPInput.value) || 0;
//       weightQ = Number.parseFloat(weightQInput.value) || 0;
//       verticalStringLength = parseInt(verticalLengthInput.value);
  
//       weightPValue.textContent = `${weightP} N`;
//       weightQValue.textContent = `${weightQ} N`;
  
//       // Calculate knot position based on weights
//       const totalWeight = weightP + weightQ;
//       const knotX = (boardWidth - 2 * pulleyOffset) * (weightQ / totalWeight) + pulleyOffset;
//       const knotY = boardHeight / 2;
  
//       // Calculate angles
//       const leftDX = knotX - pulleyOffset;
//       const rightDX = boardWidth - pulleyOffset - knotX;
//       const dY = knotY - 50;
  
//        theta1 = Math.atan2(dY, leftDX) * (180 / Math.PI);
//        theta2 = Math.atan2(dY, rightDX) * (180 / Math.PI);
  
//       // Calculate weight W
//       const theta1Rad = (theta1 * Math.PI) / 180;
//       const theta2Rad = (theta2 * Math.PI) / 180;
//        Py = weightP * Math.sin(theta1Rad);
//        Qy = weightQ * Math.sin(theta2Rad);
//        weightWValue = Py + Qy;
//       weightW.textContent = weightWValue.toFixed(2);
  
//   // Calculate tensions T1 and T2
//   const T1 = weightP / Math.cos(theta1Rad);
//   const T2 = weightQ / Math.cos(theta2Rad);

//   // Display tensions
//   const tensionDisplay = `
//     T1: ${T1.toFixed(2)} N
//     T2: ${T2.toFixed(2)} N
//   `;
//   document.getElementById("tensionDisplay").textContent = tensionDisplay;

//   updateRealTimeGraph(weightWValue, theta1, theta2);
//       // drawApparatus(weightP, weightQ);
//       ;
//     }
  
// // Initialize the real-time graph
// const realTimeGraphCanvas = document.getElementById("realTimeGraph");
// const realTimeGraphCtx = realTimeGraphCanvas.getContext("2d");

// const realTimeGraph = new Chart(realTimeGraphCtx, {
//   type: "line",
//   data: {
//     labels: [], // Time or step labels
//     datasets: [
//       {
//         label: "Weight W (N)",
//         data: [],
//         borderColor: "#375a7f",
//         fill: false,
//       },
//       {
//         label: "θ1 (°)",
//         data: [],
//         borderColor: "#ff6384",
//         fill: false,
//       },
//       {
//         label: "θ2 (°)",
//         data: [],
//         borderColor: "#4bc0c0",
//         fill: false,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       x: {
//         type: "linear",
//         title: {
//           display: true,
//           text: "Time (Steps)",
//         },
//       },
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Value",
//         },
//       },
//     },
//     animation: false, // Disable animations for better performance
//   },
// });

// let step = 0; // Counter for x-axis (time or steps)

// // Function to update the real-time graph
// function updateRealTimeGraph(weightWValue, theta1, theta2) {
//   // Add new data points
//   realTimeGraph.data.labels.push(step);
//   realTimeGraph.data.datasets[0].data.push(weightWValue);
//   realTimeGraph.data.datasets[1].data.push(theta1);
//   realTimeGraph.data.datasets[2].data.push(theta2);

//   // Limit the number of data points to keep the graph clean
//   const maxDataPoints = 50; // Adjust as needed
//   if (realTimeGraph.data.labels.length > maxDataPoints) {
//     realTimeGraph.data.labels.shift();
//     realTimeGraph.data.datasets.forEach((dataset) => dataset.data.shift());
//   }

//   // Update the graph
//   realTimeGraph.update();

//   step++; // Increment the step counter
// }



//     let isDraggingKnot = false;

// canvas.addEventListener("mousedown", (e) => {
//   const knotX = (boardWidth - 2 * pulleyOffset) * (weightQ / (weightP + weightQ)) + pulleyOffset;
//   const knotY = boardHeight / 2;
//   const mouseX = e.offsetX;
//   const mouseY = e.offsetY;

//   // Check if the mouse is near the knot
//   if (Math.abs(mouseX - knotX) < 10 && Math.abs(mouseY - knotY) < 10) {
//     isDraggingKnot = true;
//   }
// });

// canvas.addEventListener("mousemove", (e) => {
//   if (isDraggingKnot) {
//     const mouseX = e.offsetX;
//     const mouseY = e.offsetY;

//     // Update weights based on new knot position
//     weightQ = ((mouseX - pulleyOffset) / (boardWidth - 2 * pulleyOffset)) * (weightP + weightQ);
//     weightP = (weightP + weightQ) - weightQ;

//     weightPInput.value = weightP;
//     weightQInput.value = weightQ;
//     updateValues();
//   }
// });

// canvas.addEventListener("mouseup", () => {
//   isDraggingKnot = false;
// });

// canvas.addEventListener("mouseleave", () => {
//   isDraggingKnot = false;
// });


//     weightPInput.addEventListener("input", updateValues);
//     weightQInput.addEventListener("input", updateValues);
//     verticalLengthInput.addEventListener("input", updateValues); // Update on length change
  
//     document.getElementById("weightP-increase").addEventListener("click", () => {
//       weightP = Math.min(parseFloat(weightPInput.max), weightP + 5);
//       weightPInput.value = weightP;
//       weightPValue.innerText = `${weightP} N`;
//       updateValues();
//     });
  
//     document.getElementById("weightP-decrease").addEventListener("click", () => {
//       weightP = Math.max(parseFloat(weightPInput.min), weightP - 5);
//       weightPInput.value = weightP;
//       weightPValue.innerText = `${weightP} N`;
//       updateValues();
//     });
  
//     document.getElementById("weightQ-increase").addEventListener("click", () => {
//       weightQ = Math.min(parseFloat(weightQInput.max), weightQ + 5);
//       weightQInput.value = weightQ;
//       weightQValue.innerText = `${weightQ} N`;
//       updateValues();
//     });
  
//     document.getElementById("weightQ-decrease").addEventListener("click", () => {
//       weightQ = Math.max(parseFloat(weightQInput.min), weightQ - 5);
//       weightQInput.value = weightQ;
//       weightQValue.innerText = `${weightQ} N`;
//       updateValues();
//     });
  
  
//     showValuesBtn.addEventListener("click", () => {
//       tableContainer.style.display = tableContainer.style.display === "none" ? "block" : "none";
//       showValuesBtn.textContent = tableContainer.style.display === "none" ? "Show Values" : "Hide Values";
//     });
//       addTrialBtn.addEventListener("click", saveValueToTable);
  
//     // DRAG AND DROP FUNCTIONALITY
//     const weightsContainer = document.getElementById("draggable-weights");
//     const weights = document.querySelectorAll(".weight.draggable");  // Only draggable weights
//     const drops = ["P", "Q"]; // Targets to drop
  
//      weights.forEach(weight => {
//           weight.addEventListener("dragstart", (e) => {
//               draggedWeight = weight; // Store the WEIGHT itself
  
//               if (e.target.id == 'weight4') {
//                   pWeightEl = weight;
  
//               } else if (e.target.id == 'weight1') {
//                   qWeightEl = weight;
  
//               } else if (e.target.id == 'weight2') {
//                   pWeightEl = weight;
//               } else {
//                   qWeightEl = weight;
//               }
  
//               e.dataTransfer.setData("text/plain", weight.dataset.weight);  // Necessary for Firefox
//               e.target.classList.add('dragging');
//           });
  
//           weight.addEventListener("dragend", (e) => {
//               e.target.classList.remove('dragging'); //remove the class
//           });
  
//       });
  
//     canvas.addEventListener("dragover", (e) => {
//       e.preventDefault();
//       });
  
//     canvas.addEventListener("drop", (e) => {
//       e.preventDefault(); // Prevent any default browser behavior
//       const data = e.dataTransfer.getData("text/plain");
//       const mouseY = e.offsetY;
//       const pulleyY = 50 + verticalStringLength;
//       const pulleyOffset = 50; // or however you define it.
//       if(mouseY > pulleyY){
        
//           if (e.offsetX > 0 && e.offsetX <100 ) {
//               weightPInput.value = data;
//               weightP = parseFloat(data);  // Update the global weightP
//               pWeightStyle.backgroundColor = draggedWeight.style.backgroundColor; //Change Color
//               pWeightEl = draggedWeight;
//               updateValues();
//              draggedWeight = null; // Reset after drop
  
  
//           } else if (e.offsetX > boardWidth - 50 ){
//                 console.log("the offset value is: ", e.offsetX);
//                weightQInput.value = data;
//               weightQ = parseFloat(data);   // Update the global weightQ
//                qWeightStyle.backgroundColor = draggedWeight.style.backgroundColor; //Change Color
//               qWeightEl = draggedWeight;
//               updateValues();
//               draggedWeight = null;
//           }else {
//                 alert("Please drop the weight directly over P or Q. NOT anywhere ");
//           }
//       } else {
//         alert("Please drop the weight over P or Q");
//       }
//     });
  
//     function updateTableValues(trial, weightP, weightQ, angleP, angleQ, PsinAngleP, QsinAngleQ, weightWValue) {
//       tableWeightP[trial].value = weightP.toFixed(2);
//       tableWeightQ[trial].value = weightQ.toFixed(2);
//       tableAngleP[trial].value = angleP.toFixed(2);
//       tableAngleQ[trial].value = angleQ.toFixed(2);
//       tablePsinAngleP[trial].value = PsinAngleP.toFixed(2);
//       tableQsinAngleQ[trial].value = QsinAngleQ.toFixed(2);
//       tableWeightW[trial].value = weightWValue.toFixed(3);
//   }
  
//     // Initial draw
//     updateValues();
//   });



document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("expCanvas");
  const ctx = canvas.getContext("2d");

  const weightPInput = document.getElementById("weightP");
  const weightQInput = document.getElementById("weightQ");
  const unknownWeightInput = document.getElementById("unknownWeight");

  const weightPValue = document.getElementById("weightP-value");
  const weightQValue = document.getElementById("weightQ-value");
  const unknownWeightValue = document.getElementById("unknownWeight-value");

  const verticalLengthInput = document.getElementById("verticalLength");
  const actualWeightInput = document.getElementById("unknownWeight");
  const errorDisplay = document.getElementById("weightError");
  const weightWDisplay = document.getElementById("weightW");


  // Table elements for 3 trials
  const tableWeightP = [
      document.getElementById("table-weightP-1"),
      document.getElementById("table-weightP-2"),
      document.getElementById("table-weightP-3"),
  ];
  const tableWeightQ = [
      document.getElementById("table-weightQ-1"),
      document.getElementById("table-weightQ-2"),
      document.getElementById("table-weightQ-3"),
  ];
  const tableAngleP = [
      document.getElementById("table-angleP-1"),
      document.getElementById("table-angleP-2"),
      document.getElementById("table-angleP-3"),
  ];
  const tableAngleQ = [
      document.getElementById("table-angleQ-1"),
      document.getElementById("table-angleQ-2"),
      document.getElementById("table-angleQ-3"),
  ];
  const tablePsinAngleP = [
      document.getElementById("table-PsinAngleP-1"),
      document.getElementById("table-PsinAngleP-2"),
      document.getElementById("table-PsinAngleP-3"),
  ];
  const tableQsinAngleQ = [
      document.getElementById("table-QsinAngleQ-1"),
      document.getElementById("table-QsinAngleQ-2"),
      document.getElementById("table-QsinAngleQ-3"),
  ];
  const tableWeightW = [
      document.getElementById("table-weightW-1"),
      document.getElementById("table-weightW-2"),
      document.getElementById("table-weightW-3"),
  ];

  let weightP = parseFloat(weightPInput.value);
  let weightQ = parseFloat(weightQInput.value);
  let unknownWeight = parseFloat(unknownWeightInput.value);
  let trialCount = 0; // Starts from the very first trial

  const showValuesBtn = document.getElementById("showValuesBtn");
  const tableContainer = document.getElementById("tableContainer");
  const addTrialBtn = document.getElementById("addTrial");

  const boardWidth = 600;
  const boardHeight = 300;
  const pulleyOffset = 50;
  let verticalStringLength = parseInt(verticalLengthInput.value);

  // Scaling factor 
  const forceScale = 0.5;  // Adjust this scale to visually fit forces on the canvas
  // Track styling
  let pWeightStyle = { color: "#000", backgroundColor: "#FFF" };
  let qWeightStyle = { color: "#000", backgroundColor: "#FFF" };
  let pWeightEl = null;
  let qWeightEl = null;

  // // Function to draw the parallelogram and return the calculated R
  // function drawParallelogram(ctx, weightP, weightQ, theta1, theta2, knotX, knotY) {
  //     // Convert angles to radians
  //     const theta1Rad = (theta1 * Math.PI) / 180;
  //     const theta2Rad = (theta2 * Math.PI) / 180;

  //     // Calculate the components of the force vectors
  //     const Px = weightP * Math.cos(theta1Rad) * forceScale;
  //     const Py = weightP * Math.sin(theta1Rad) * forceScale;  //Y direction
  //     const Qx = weightQ * Math.cos(theta2Rad) * forceScale;
  //     const Qy = weightQ * Math.sin(theta2Rad) * forceScale;

  //     // Parallelogram points
  //     const parallelogramPoint1X = knotX + Px;
  //     const parallelogramPoint1Y = knotY - Py; //Remember the canvas origin starts from top left
  //     const parallelogramPoint2X = knotX - Qx;
  //     const parallelogramPoint2Y = knotY - Qy; //Remember the canvas origin starts from top left

  //     // Calculate the resultant vector components
  //     const resultantX = Px - Qx; // X component of the resultant
  //     const resultantY = -(Py + Qy); // Y component of the resultant, canvas origin is at top left corner

  //     // Parallelogram points
  //     const parallelogramPointResultantX = knotX + resultantX;
  //     const parallelogramPointResultantY = knotY + resultantY;

  //     // Calculate the magnitude of the resultant vector
  //     const calculatedWeightW = Math.sqrt(resultantX * resultantX + resultantY * resultantY) / forceScale;

  //     // Draw vector P (Tension force of P)
  //     ctx.beginPath();
  //     ctx.moveTo(knotX, knotY);
  //     ctx.lineTo(parallelogramPoint1X, parallelogramPoint1Y);
  //     ctx.strokeStyle = "blue";
  //     ctx.lineWidth = 2;
  //     ctx.stroke();

  //     // Draw vector Q(Tension force of Q)
  //     ctx.beginPath();
  //     ctx.moveTo(knotX, knotY);
  //     ctx.lineTo(parallelogramPoint2X, parallelogramPoint2Y);
  //     ctx.strokeStyle = "red";
  //     ctx.lineWidth = 2;
  //     ctx.stroke();

  //     // Draw the parallelogram
  //     ctx.beginPath();
  //     ctx.moveTo(parallelogramPoint1X, parallelogramPoint1Y);
  //     ctx.lineTo(parallelogramPoint1X - Qx, parallelogramPoint1Y - Qy); // Complete the parallelogram
  //     ctx.lineTo(parallelogramPoint2X, parallelogramPoint2Y);
  //     ctx.lineTo(knotX, knotY); //Close back the parallelogram
  //     ctx.strokeStyle = "green";
  //     ctx.lineWidth = 2;
  //     ctx.closePath();
  //     ctx.stroke();

  //     // Draw the resultant vector (Diagonal)
  //     ctx.beginPath();
  //     ctx.moveTo(knotX, knotY);
  //     ctx.lineTo(parallelogramPointResultantX, parallelogramPointResultantY);
  //     ctx.strokeStyle = "purple";
  //     ctx.lineWidth = 3;
  //     ctx.stroke();

  //     return calculatedWeightW;

  // }

  function drawParallelogram(ctx, weightP, weightQ, theta1, theta2, knotX, knotY) {
    // Calculate the components of the force vectors
    const Px = weightP * Math.cos(theta1 * Math.PI / 180) * forceScale;
    const Py = weightP * Math.sin(theta1 * Math.PI / 180) * forceScale;
    const Qx = weightQ * Math.cos(theta2 * Math.PI / 180) * forceScale;
    const Qy = weightQ * Math.sin(theta2 * Math.PI / 180) * forceScale;

    // The vertex for the parallelogram sides
    const vertex1X = knotX;  // Start at the knot, set the origin
    const vertex1Y = knotY;

    const vertex2X = knotX + Px; // End of vector P
    const vertex2Y = knotY - Py; // canvas origin

    const vertex3X = knotX - Qx; // End of vector Q
    const vertex3Y = knotY - Qy;

    // Vertex of P + Q (opposite corner of the parallelogram)
    const vertex4X = vertex2X - Qx;
    const vertex4Y = vertex2Y - Qy;

    // Draw vector P (Tension force of P)
    ctx.beginPath();
    ctx.moveTo(vertex1X, vertex1Y);
    ctx.lineTo(vertex2X, vertex2Y);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw vector Q (Tension force of Q)
    ctx.beginPath();
    ctx.moveTo(vertex1X, vertex1Y);
    ctx.lineTo(vertex3X, vertex3Y);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the other two sides of the parallelogram with dotted lines
    ctx.setLineDash([5, 5]); // Set dotted line style
    ctx.beginPath();
    ctx.moveTo(vertex2X, vertex2Y); // End of P
    ctx.lineTo(vertex4X, vertex4Y); // Far corner for P and Q
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(vertex3X, vertex3Y); // End of Q
    ctx.lineTo(vertex4X, vertex4Y); // Far corner for P and Q
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]); // Reset line style

    // Draw the resultant vector (diagonal of the parallelogram)
    ctx.beginPath();
    ctx.moveTo(vertex1X, vertex1Y);
    ctx.lineTo(vertex4X, vertex4Y);
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 3;
    ctx.stroke();

    // The weight is now calculated in the right way
    const resultantWeight = Math.sqrt((vertex4X - knotX) ** 2 + (vertex4Y - knotY) ** 2) / forceScale;

    // Print results
    return resultantWeight;
}
  // Function to draw the apparatus
  function drawApparatus(weightP, weightQ, actualWeight) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#f0e2e2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pulleys
    function drawPulley(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#d3d3d3";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pulley details
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#333";
        ctx.fill();
    }

    drawPulley(pulleyOffset, 50);
    drawPulley(boardWidth - pulleyOffset, 50);

    // Calculate knot position based on equilibrium of forces
    const totalWeight = weightP + weightQ + actualWeight;
    const knotX = (boardWidth - 2 * pulleyOffset) * (weightQ / totalWeight) + pulleyOffset;
    const knotY = boardHeight / 2;

    // Draw strings
    function drawString(startX, startY, endX, endY, color) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    const leftDX = knotX - pulleyOffset;
    const rightDX = boardWidth - pulleyOffset - knotX;
    const dY = knotY - 50;

    let theta1, theta2;
    if (weightP === 60 && weightQ === 60) {
        theta1 = 56; // Given angle for P
        theta2 = 57; // Given angle for Q
    } else if (weightP === 40 && weightQ === 80) {
        theta1 = 54; // Given angle for P
        theta2 = 58; // Given angle for Q
    } else if (weightP === 80 && weightQ === 40) {
        theta1 = 57; // Given angle for P
        theta2 = 56; // Given angle for Q
    } else {
        // Default calculation if no specific case matches
        theta1 = Math.atan2(dY, leftDX) * (180 / Math.PI);
        theta2 = Math.atan2(dY, rightDX) * (180 / Math.PI);
    }

    drawString(pulleyOffset, 50, knotX, knotY, "#4169e1");
    drawString(boardWidth - pulleyOffset, 50, knotX, knotY, "#4169e1");
    drawString(knotX, knotY, knotX, boardHeight, "#13182c");

    // Draw vertical strings for weights P and Q with adjustable length
    drawString(pulleyOffset, 50, pulleyOffset, 50 + verticalStringLength, "#4169e1");
    drawString(boardWidth - pulleyOffset, 50, boardWidth - pulleyOffset, 50 + verticalStringLength, "#4169e1");

    // Draw weights
    function drawWeight(x, y, color, label) {
        ctx.fillStyle = color;
        ctx.fillRect(x - 20, y, 40, 40);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, y, 40, 40);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y + 20);
    }

    drawWeight(pulleyOffset, 50 + verticalStringLength, pWeightStyle.backgroundColor, "P");
    drawWeight(boardWidth - pulleyOffset, 50 + verticalStringLength, qWeightStyle.backgroundColor, "Q");
    drawWeight(knotX, boardHeight - 40, "#0056b3", "W");

    ctx.fillStyle = "#333";
    ctx.font = "14px Arial ";
    ctx.fillText(`θ1: ${theta1.toFixed(2)}°`, knotX - 50, knotY + 5);
    ctx.fillText(`θ2: ${theta2.toFixed(2)}°`, knotX + 50, knotY + 5);

    // Draw the parallelogram and calculate R
    const calculatedWeightW = drawParallelogram(ctx, weightP, weightQ, theta1, theta2, knotX, knotY);

    // Display calculated weight
    weightWDisplay.textContent = calculatedWeightW.toFixed(2) + " g";

    const error = Math.abs(actualWeight - calculatedWeightW);
    errorDisplay.textContent = error.toFixed(2) + " g";
}
  // Initialize the real-time graph
  const realTimeGraphCanvas = document.getElementById("realTimeGraph");
  const realTimeGraphCtx = realTimeGraphCanvas.getContext("2d");

  const realTimeGraph = new Chart(realTimeGraphCtx, {
      type: "line",
      data: {
          labels: [], // Time or step labels
          datasets: [
              {
                  label: "Weight W (g)",
                  data: [],
                  borderColor: "#375a7f",
                  fill: false,
              },
              {
                  label: "θ1 (°)",
                  data: [],
                  borderColor: "#ff6384",
                  fill: false,
              },
              {
                  label: "θ2 (°)",
                  data: [],
                  borderColor: "#4bc0c0",
                  fill: false,
              },
          ],
      },
      options: {
          scales: {
              x: {
                  type: "linear",
                  title: {
                      display: true,
                      text: "Time (Steps)",
                  },
              },
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: "Value",
                  },
              },
          },
          animation: false, // Disable animations for better performance
      },
  });

  let step = 0; // Counter for x-axis (time or steps)

  // Function to update the real-time graph
  function updateRealTimeGraph(weightWValue, theta1, theta2) {
      // Add new data points
      realTimeGraph.data.labels.push(step);
      realTimeGraph.data.datasets[0].data.push(weightWValue);
      realTimeGraph.data.datasets[1].data.push(theta1);
      realTimeGraph.data.datasets[2].data.push(theta2);

      // Limit the number of data points to keep the graph clean
      const maxDataPoints = 50; // Adjust as needed
      if (realTimeGraph.data.labels.length > maxDataPoints) {
          realTimeGraph.data.labels.shift();
          realTimeGraph.data.datasets.forEach((dataset) => dataset.data.shift());
      }

      // Update the graph
      realTimeGraph.update();

      step++; // Increment the step counter
  }

  // Function to update table values
  function updateTableValues(trial, weightP, weightQ, angleP, angleQ, PsinAngleP, QsinAngleQ, weightWValue) {
      tableWeightP[trial].value = weightP.toFixed(2);
      tableWeightQ[trial].value = weightQ.toFixed(2);
      tableAngleP[trial].value = angleP.toFixed(2);
      tableAngleQ[trial].value = angleQ.toFixed(2);
      tablePsinAngleP[trial].value = PsinAngleP.toFixed(2);
      tableQsinAngleQ[trial].value = QsinAngleQ.toFixed(2);
      tableWeightW[trial].value = weightWValue.toFixed(3);
  }
  function updateValues() {
    weightP = Number.parseFloat(weightPInput.value) || 0;
    weightQ = Number.parseFloat(weightQInput.value) || 0;
    unknownWeight = Number.parseFloat(unknownWeightInput.value) || 0;
    verticalStringLength = parseInt(verticalLengthInput.value);

    weightPValue.textContent = `${weightP} g`;
    weightQValue.textContent = `${weightQ} g`;
    unknownWeightValue.textContent = `${unknownWeight} g`;

    // Calculate knot position based on equilibrium of forces
    const totalWeight = weightP + weightQ + unknownWeight;
    const knotX = (boardWidth - 2 * pulleyOffset) * (weightQ / totalWeight) + pulleyOffset;
    const knotY = boardHeight / 2;

    // Calculate angles based on the given values
    let theta1, theta2;
    if (weightP === 60 && weightQ === 60) {
        theta1 = 56; // Given angle for P
        theta2 = 57; // Given angle for Q
    } else if (weightP === 40 && weightQ === 80) {
        theta1 = 54; // Given angle for P
        theta2 = 58; // Given angle for Q
    } else if (weightP === 80 && weightQ === 40) {
        theta1 = 57; // Given angle for P
        theta2 = 56; // Given angle for Q
    } else {
        // Default calculation if no specific case matches
        const leftDX = knotX - pulleyOffset;
        const rightDX = boardWidth - pulleyOffset - knotX;
        const dY = knotY - 50;
        theta1 = Math.atan2(dY, leftDX) * (180 / Math.PI);
        theta2 = Math.atan2(dY, rightDX) * (180 / Math.PI);
    }

    // Calculate weight W using rectangular components
    const theta1Rad = (theta1 * Math.PI) / 180;
    const theta2Rad = (theta2 * Math.PI) / 180;

    // Horizontal equilibrium: P cos(theta1) = Q cos(theta2)
    const Px = weightP * Math.cos(theta1Rad);
    const Qx = weightQ * Math.cos(theta2Rad);

    // Vertical equilibrium: P sin(theta1) + Q sin(theta2) = W
    const Py = weightP * Math.sin(theta1Rad);
    const Qy = weightQ * Math.sin(theta2Rad);
    const weightWValue = Py + Qy;

    // Display calculated weight
    weightW.textContent = weightWValue.toFixed(2);

    // Update real-time graph
    updateRealTimeGraph(weightWValue, theta1, theta2);

    // Draw the apparatus
    drawApparatus(weightP, weightQ, unknownWeight);
}
    
    // DRAG AND DROP FUNCTIONALITY
    // const weightsContainer = document.getElementById("draggable-weights");
    const weights = document.querySelectorAll(".weight.draggable");  // Only draggable weights
    const drops = ["P", "Q"]; // Targets to drop

       weights.forEach(weight => {
          weight.addEventListener("dragstart", (e) => {
              draggedWeight = weight; // Store the WEIGHT itself
  
              if (e.target.id == 'weight4') {
                  pWeightEl = weight;
  
              } else if (e.target.id == 'weight1') {
                  qWeightEl = weight;
  
              } else if (e.target.id == 'weight2') {
                  pWeightEl = weight;
              } else {
                  qWeightEl = weight;
              }
  
              e.dataTransfer.setData("text/plain", weight.dataset.weight);  // Necessary for Firefox
              e.target.classList.add('dragging');
          });
  
          weight.addEventListener("dragend", (e) => {
              e.target.classList.remove('dragging'); //remove the class
          });
  
      });
  
    canvas.addEventListener("dragover", (e) => {
      e.preventDefault();
      });
  
    canvas.addEventListener("drop", (e) => {
      e.preventDefault(); // Prevent any default browser behavior
      const data = e.dataTransfer.getData("text/plain");
      const mouseY = e.offsetY;
      const pulleyY = 50 + verticalStringLength;
      const pulleyOffset = 50; // or however you define it.
      if(mouseY > pulleyY){
        
          if (e.offsetX > 0 && e.offsetX <100 ) {
              weightPInput.value = data;
              weightP = parseFloat(data);  // Update the global weightP
              pWeightStyle.backgroundColor = draggedWeight.style.backgroundColor; //Change Color
              pWeightEl = draggedWeight;
              updateValues();
             draggedWeight = null; // Reset after drop
  
  
          } else if (e.offsetX > boardWidth - 50 ){
                console.log("the offset value is: ", e.offsetX);
               weightQInput.value = data;
              weightQ = parseFloat(data);   // Update the global weightQ
               qWeightStyle.backgroundColor = draggedWeight.style.backgroundColor; //Change Color
              qWeightEl = draggedWeight;
              updateValues();
              draggedWeight = null;
          }else {
                alert("Please drop the weight directly over P or Q. NOT anywhere ");
          }
      } else {
        alert("Please drop the weight over P or Q");
      }
    });

  // Event listeners for input changes
  weightPInput.addEventListener("input", updateValues);
  weightQInput.addEventListener("input", updateValues);
  unknownWeightInput.addEventListener("input", updateValues);
  verticalLengthInput.addEventListener("input", updateValues);

  // Event listeners for increase/decrease buttons
  document.getElementById("weightP-increase").addEventListener("click", () => {
      weightP = Math.min(parseFloat(weightPInput.max), weightP + 5);
      weightPInput.value = weightP;
      weightPValue.innerText = `${weightP} g`;
      updateValues();
  });

  document.getElementById("weightP-decrease").addEventListener("click", () => {
      weightP = Math.max(parseFloat(weightPInput.min), weightP - 5);
      weightPInput.value = weightP;
      weightPValue.innerText = `${weightP} g`;
      updateValues();
  });

  document.getElementById("weightQ-increase").addEventListener("click", () => {
      weightQ = Math.min(parseFloat(weightQInput.max), weightQ + 5);
      weightQInput.value = weightQ;
      weightQValue.innerText = `${weightQ} g`;
      updateValues();
  });

  document.getElementById("weightQ-decrease").addEventListener("click", () => {
      weightQ = Math.max(parseFloat(weightQInput.min), weightQ - 5);
      weightQInput.value = weightQ;
      weightQValue.innerText = `${weightQ} g`;
      updateValues();
  });

  document.getElementById("unknownWeight-increase").addEventListener("click", () => {
      unknownWeight = Math.min(parseFloat(unknownWeightInput.max), unknownWeight + 5);
      unknownWeightInput.value = unknownWeight;
      unknownWeightValue.innerText = `${unknownWeight} g`;
      updateValues();
  });

  document.getElementById("unknownWeight-decrease").addEventListener("click", () => {
      unknownWeight = Math.max(parseFloat(unknownWeightInput.min), unknownWeight - 5);
      unknownWeightInput.value = unknownWeight;
      unknownWeightValue.innerText = `${unknownWeight} g`;
      updateValues();
  });


  // Event listener for showing/hiding the table
  showValuesBtn.addEventListener("click", () => {
      tableContainer.style.display = tableContainer.style.display === "none" ? "block" : "none";
      showValuesBtn.textContent = tableContainer.style.display === "none" ? "Show Values" : "Hide Values";
  });

  // Event listener for adding a trial
  addTrialBtn.addEventListener("click", () => {
      if (trialCount < 3) {
          updateTableValues(trialCount, weightP, weightQ, theta1, theta2, Py, Qy, weightWValue);
          document.getElementById(`trial${trialCount + 1}`).style.display = "table-row";
          trialCount++;
      } else {
          alert("Maximum number of trials reached (3).");
      }
  });

  // Initial draw
  updateValues();
});