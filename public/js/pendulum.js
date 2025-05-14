
const graphCanvas = document.getElementById("graphCanvas");
const graphCtx = graphCanvas.getContext("2d");
const displacementCanvas = document.getElementById("displacementCanvas");
const velocityCanvas = document.getElementById("velocityCanvas");
const accelerationCanvas = document.getElementById("accelerationCanvas");
const kineticEnergyCanvas = document.getElementById("KineticEnergy");
const potentialEnergyCanvas = document.getElementById("potentialEnergy");
const totalEnergyCanvas = document.getElementById("TotalEnergy");

const displacementCtx = displacementCanvas.getContext("2d");
const velocityCtx = velocityCanvas.getContext("2d");
const accelerationCtx = accelerationCanvas.getContext("2d");
const kineticEnergyCtx = kineticEnergyCanvas.getContext("2d");
const potentialEnergyCtx = potentialEnergyCanvas.getContext("2d");
const totalEnergyCtx = totalEnergyCanvas.getContext("2d");

let lengthInput = document.getElementById("length");
let radiusInput = document.getElementById("radius");
let gravityInput = document.getElementById("gravity");
let lengthValue = document.getElementById("length-value");
let radiusValue = document.getElementById("radius-value");
let gravityValue = document.getElementById("gravity-value");
let dampingInput = document.getElementById("damping"); 
let dampingValue = document.getElementById("damping-value"); 

let IangleInput = document.getElementById("Iangle");
let IangleValue = document.getElementById("Iangle-value");
let IangleIncrease = document.getElementById("Iangle-increase");
let IangleDecrease = document.getElementById("Iangle-decrease");

let angleDisplay = document.getElementById("angle");
let periodDisplay = document.getElementById("period");
let massDisplay= document.getElementById("mass")

let showScaleCheckbox = document.getElementById("showScale");
let graphContainer = document.getElementById("graphContainer");

//-------------------------------------------------------------------------------
// tootlip

// Tooltip functionality
// function setupTooltips() {
//   // Create tooltip element
//   const tooltip = document.createElement('div');
//   tooltip.className = 'tooltip';
//   document.body.appendChild(tooltip);

//   // Function to position and show tooltip
//   function showTooltip(element, text) {
//     const rect = element.getBoundingClientRect();
//     tooltip.textContent = text;
//     tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
//     tooltip.style.top = `${rect.bottom + 8}px`;
//     tooltip.classList.add('active');
//   }

//   // Add tooltips to all elements with data-intro
//   document.querySelectorAll('[data-intro]').forEach(el => {
//     el.addEventListener('mouseenter', () => showTooltip(el, el.dataset.intro));
//     el.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
//   });

//   // Add tooltips to buttons and controls
//   document.querySelectorAll('button').forEach(button => {
//     if (!button.dataset.intro) {
//       button.addEventListener('mouseenter', () => {
//         let tooltipText = '';
//         if (button.id === 'controlButton') tooltipText = 'Start/pause the pendulum';
//         else if (button.id === 'reset') tooltipText = 'Reset the experiment';
//         else if (button.id === 'start') tooltipText = 'Start the simulation';
//         else if (button.id === 'saveGraphsBtn') tooltipText = 'Save graph data as CSV';
//         else if (button.id === 'saveGraphsBtnimg') tooltipText = 'Save graphs as images';
//         else if (button.id === 'addValuesBtn') tooltipText = 'Show data table';
//         else if (button.classList.contains('dropbtn')) tooltipText = 'Show/hide graphs';
        
//         if (tooltipText) showTooltip(button, tooltipText);
//       });
//       button.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
//     }
//   });

//   // Add tooltip to canvas when hovering the bob
//   canvas.addEventListener('mousemove', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     // Calculate distance to bob
//     const bobX = originX + length * 400 * Math.sin(angle);
//     const bobY = originY + length * 400 * Math.cos(angle);
//     const distToBob = Math.sqrt(Math.pow(x - bobX, 2) + Math.pow(y - bobY, 2));
    
//     if (distToBob <= radius + 20) {
//       showTooltip(canvas, 'Drag to change pendulum position');
//       tooltip.style.left = `${e.clientX}px`;
//       tooltip.style.top = `${e.clientY + 20}px`;
//     } else {
//       tooltip.classList.remove('active');
//     }
//   });

//   canvas.addEventListener('mouseleave', () => {
//     tooltip.classList.remove('active');
//   });

//   // Add tooltips to input sliders
//   document.querySelectorAll('.input-group').forEach(group => {
//     const label = group.querySelector('label');
//     if (label) {
//       group.addEventListener('mouseenter', () => {
//         let tooltipText = '';
//         if (label.htmlFor === 'length') tooltipText = 'Adjust pendulum length';
//         else if (label.htmlFor === 'radius') tooltipText = 'Adjust bob radius';
//         else if (label.htmlFor === 'gravity') tooltipText = 'Adjust gravity value';
//         else if (label.htmlFor === 'Iangle') tooltipText = 'Set initial angle';
//         else if (label.htmlFor === 'damping') tooltipText = 'Adjust damping factor';
        
//         if (tooltipText) showTooltip(group, tooltipText);
//       });
//       group.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
//     }
//   });
// }

// Call this in your initialization
window.addEventListener('load', function() {
  resizeCanvas();
  // setupTooltips();  // Add this line
});

// Show table --------------------------------------------------------------------------------------
document.getElementById('addValuesBtn').addEventListener('click', function() {

  const tableContainer = document.getElementById('tableContainer');
  tableContainer.style.display = 'block';  
});


let isGraphVisible = true;
document.addEventListener('DOMContentLoaded', function () {
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

  
  document.getElementById('showGraph').addEventListener('change', function () {
    graphCanvas.style.display = this.checked ? 'block' : 'none';
  });
  document.getElementById('showDisGraph').addEventListener('change', function () {
    displacementCanvas.style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('showVelGraph').addEventListener('change', function () {
    velocityCanvas.style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('showAccGraph').addEventListener('change', function () {
    accelerationCanvas.style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('showKineticGraph').addEventListener('change', function () {
    kineticEnergyCanvas.style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('showPotentialGraph').addEventListener('change', function () {
    potentialEnergyCanvas.style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('showTotalEnergyGraph').addEventListener('change', function () {
    totalEnergyCanvas.style.display = this.checked ? 'block' : 'none';
  });

  const initGraphVisibility = () => {
    graphCanvas.style.display = document.getElementById('showGraph').checked ? 'block' : 'none';
    displacementCanvas.style.display = document.getElementById('showDisGraph').checked ? 'block' : 'none';
    velocityCanvas.style.display = document.getElementById('showVelGraph').checked ? 'block' : 'none';
    accelerationCanvas.style.display = document.getElementById('showAccGraph').checked ? 'block' : 'none';
    kineticEnergyCanvas.style.display = document.getElementById('showKineticGraph').checked ? 'block' : 'none';
    potentialEnergyCanvas.style.display = document.getElementById('showPotentialGraph').checked ? 'block' : 'none';
    totalEnergyCanvas.style.display = document.getElementById('showTotalEnergyGraph').checked ? 'block' : 'none';
  };

  initGraphVisibility();
});

const convertDataToCSV = (data, title) => {
  let csvContent = `data:text/csv;charset=utf-8,${title}\nIndex,Value\n`;
  data.forEach((value, index) => {
    csvContent += `${index},${value}\n`;
  });
  return csvContent;
};

const downloadCSV = (csvContent, filename) => {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link); 
  link.click();
  document.body.removeChild(link);
};

document.getElementById('saveGraphsBtn').addEventListener('click', function () {
  if (document.getElementById('showDisGraph').checked) {
    const displacementCSV = convertDataToCSV(displacementData, 'Displacement Data');
    downloadCSV(displacementCSV, 'displacement_graph.csv');
  }
  if (document.getElementById('showVelGraph').checked) {
    const velocityCSV = convertDataToCSV(velocityData, 'Velocity Data');
    downloadCSV(velocityCSV, 'velocity_graph.csv');
  }
  if (document.getElementById('showAccGraph').checked) {
    const accelerationCSV = convertDataToCSV(accelerationData, 'Acceleration Data');
    downloadCSV(accelerationCSV, 'acceleration_graph.csv');
  }
  if (document.getElementById('showKineticGraph').checked) {
    const kineticEnergyCSV = convertDataToCSV(kineticEnergyData, 'Kinetic Energy Data');
    downloadCSV(kineticEnergyCSV, 'kinetic_energy_graph.csv');
  }
  if (document.getElementById('showPotentialGraph').checked) {
    const potentialEnergyCSV = convertDataToCSV(potentialEnergyData, 'Potential Energy Data');
    downloadCSV(potentialEnergyCSV, 'potential_energy_graph.csv');
  }
  if (document.getElementById('showTotalEnergyGraph').checked) {
    const totalEnergyCSV = convertDataToCSV(totalEnergyData, 'Total Energy Data');
    downloadCSV(totalEnergyCSV, 'total_energy_graph.csv');
  }});
showScaleCheckbox.addEventListener("change", () => {
  showScale = showScaleCheckbox.checked;
  drawPendulum();
});

function saveGraphAsImage(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(); 
  link.click();
}

function saveAllGraphsAsImages() {
  const canvasElements = [
    { canvas: document.getElementById('displacementCanvas'), filename: 'displacement_graph.png' },
    { canvas: document.getElementById('velocityCanvas'), filename: 'velocity_graph.png' },
    { canvas: document.getElementById('accelerationCanvas'), filename: 'acceleration_graph.png' },
    { canvas: document.getElementById('kineticEnergyCanvas'), filename: 'kinetic_energy_graph.png' },
    { canvas: document.getElementById('potentialEnergyCanvas'), filename: 'potential_energy_graph.png' },
    { canvas: document.getElementById('totalEnergyCanvas'), filename: 'total_energy_graph.png' }
    
  ];

  canvasElements.forEach(({ canvas, filename }) => {
    if (!canvas.classList.contains('hidden')) {
      saveGraphAsImage(canvas, filename);
    }
  });
}

document.getElementById('saveGraphsBtnimg').addEventListener('click', saveAllGraphsAsImages);

// draw the complete graph ------------------------------------------------------------------------------
const graphWidth = graphCanvas.width;
const graphHeight = graphCanvas.height;
let maxPoints = 10000;
let timeData = [];
let displacementData = [];
let velocityData = [];
let accelerationData = [];
let energyData = [];
let kineticEnergyData = [];
let potentialEnergyData = [];
let currentDataIndex = 0;
let zoomOutFactor = 0.5;
let maxPointsVisible = 10000;

document.getElementById("zoomInBtn").addEventListener("click", () => {
  if (maxPointsVisible > 100) {
    maxPointsVisible = Math.floor(maxPointsVisible / 2);
    drawGraphs();
  }
});

document.getElementById("zoomOutBtn").addEventListener("click", () => {
  if (maxPointsVisible < maxPoints) {
    maxPointsVisible = Math.min(maxPointsVisible * 2, maxPoints);
    drawGraphs();
  }
});


function drawCanvasButtons(ctx) {
  // Zoom In Button
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(700, 10, 70, 30); // x, y, width, height
  ctx.strokeStyle = "#000";
  ctx.strokeRect(700, 10, 70, 30);
  ctx.fillStyle = "#000";
  ctx.font = "16px sans-serif";
  ctx.fillText("Zoom +", 710, 30);

  // Zoom Out Button
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(700, 50, 70, 30);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(700, 50, 70, 30);
  ctx.fillStyle = "#000";
  ctx.fillText("Zoom -", 710, 70);
}


function drawGraphs() {
  drawLineChart(
    graphCtx,
    displacementData,
    velocityData,
    accelerationData,
    energyData
  );

  drawSingleVariableChart(
    displacementCtx,
    displacementData,
    "Displacement",
    "blue"
  );
  drawSingleVariableChart(velocityCtx, velocityData, "Valocity", "red");
  drawSingleVariableChart(
    accelerationCtx,
    accelerationData,
    "Acceleration",
    "green"
  );
  drawSingleVariableChart(
    kineticEnergyCtx,
    kineticEnergyData,
    "Kinetic Energy",
    "orange"
  );
  drawSingleVariableChart(
    potentialEnergyCtx,
    potentialEnergyData,
    "Potential Energy",
    "purple"
  );
  drawSingleVariableChart(
    totalEnergyCtx,
    energyData,
    "Total Energy",
    "brown"
  );
}
   function drawSingleVariableChart(ctx, data, label, color) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.clearRect(0, 0, width, height);    
    drawGridLines(ctx);

    ctx.beginPath();
    ctx.moveTo(10, 0); 
    ctx.lineTo(10, height);
    ctx.moveTo(10, height / 2); 
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = color;
    let yScaleFactor = height / (Math.max(...data) - Math.min(...data)) || 1;
    const startIdx = Math.max(0, data.length - maxPointsVisible);
for (let i = startIdx; i < data.length; i++) {
  let x = 10 + i * ((width - 10) / maxPointsVisible); 
  let y = height / 2 - data[i] * yScaleFactor;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(label, 200, 20);
  }
 function drawGridLines(ctx) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 0.5;

  for (let i = 30; i <= width; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  for (let i = 0; i <= height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
}

function drawLineChart() {
  const graphOffsetY = graphHeight / 1.75; 
  graphCtx.clearRect(0, 0, graphWidth, graphHeight); 
  graphCtx.beginPath();
  graphCtx.moveTo(50, 0); 
  graphCtx.lineTo(50, graphHeight);
  graphCtx.moveTo(0, graphOffsetY); 
  graphCtx.lineTo(graphWidth, 200);
  graphCtx.strokeStyle = "#000";
  graphCtx.lineWidth = 1;
  graphCtx.stroke();

  graphCtx.strokeStyle = "#ccc";
  for (let i = graphOffsetY; i <= graphHeight; i += 50) {
    graphCtx.beginPath();
    graphCtx.moveTo(50, i);
    graphCtx.lineTo(graphWidth, i);
    graphCtx.stroke();
  }
  for (let i = graphOffsetY; i >= 0; i -= 50) {
    graphCtx.beginPath();
    graphCtx.moveTo(50, i);
    graphCtx.lineTo(graphWidth, i);
    graphCtx.stroke();
  }
  for (let i = 50; i <= graphWidth; i += 50) {
    graphCtx.beginPath();
    graphCtx.moveTo(i, 0);
    graphCtx.lineTo(i, graphHeight);
    graphCtx.stroke();
  }

  graphCtx.font = "12px Arial";
  graphCtx.fillStyle = "black";
  graphCtx.fillText("Time", graphWidth / 2, graphHeight - 10); 
  graphCtx.save();
  graphCtx.rotate(-Math.PI / 2); 
  graphCtx.fillText("Values", -graphHeight / 2, 20); 
  graphCtx.restore();

  const maxYValue = Math.max(
    Math.abs(
      Math.min(
        ...displacementData,
        ...velocityData,
        ...accelerationData,
        ...energyData
      )
    ),
    Math.max(
      ...displacementData,
      ...velocityData,
      ...accelerationData,
      ...energyData
    ),
    1 
  );

  if (currentDataIndex > maxPointsVisible) {
    zoomOutFactor = currentDataIndex / maxPointsVisible;
  }

  const yScaleFactor = (graphHeight / 2 - 20) / maxYValue; 
  const xScaleFactor = graphWidth / maxPointsVisible; 

  plotLine(
    graphCtx,
    displacementData,
    "blue",
    yScaleFactor,
    xScaleFactor,
    graphOffsetY
  );
  plotLine(
    graphCtx,
    velocityData,
    "red",
    yScaleFactor,
    xScaleFactor,
    graphOffsetY
  );
  plotLine(
    graphCtx,
    accelerationData,
    "green",
    yScaleFactor,
    xScaleFactor,
    graphOffsetY
  );
  plotLine(
    graphCtx,
    energyData,
    "orange",
    yScaleFactor,
    xScaleFactor,
    graphOffsetY
  );

  graphCtx.fillStyle = "blue";
  graphCtx.fillText("Displacement", graphWidth - 100, 40);
  graphCtx.fillStyle = "red";
  graphCtx.fillText("Valocity", graphWidth - 100, 60);
  graphCtx.fillStyle = "green";
  graphCtx.fillText("Acceleration", graphWidth - 100, 80);
  graphCtx.fillStyle = "orange";
  graphCtx.fillText("Energy", graphWidth - 100, 100);
}

function plotLine(
  graphCtx,
  data,
  color,
  yScaleFactor,
  xScaleFactor,
  graphOffsetY
) {
  graphCtx.beginPath();
  graphCtx.strokeStyle = color;
  const startIdx = Math.max(0, data.length - maxPointsVisible);
for (let i = startIdx; i < data.length; i++) {
  let x = (i - startIdx) * xScaleFactor + 50;
    let y = graphOffsetY - data[i] * yScaleFactor; 
    if (i === 0) {
      graphCtx.moveTo(x, y); 
    } else {
      graphCtx.lineTo(x, y); 
    }
  }
  graphCtx.stroke();
}
// --------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------
// pendulum 
const canvas = document.getElementById("pendulumCanvas");
const ctx = canvas.getContext("2d");

let length = parseFloat(lengthInput.value);
let radius = parseFloat(radiusInput.value);
let gravity = parseFloat(gravityInput.value);
let angle = 0;
let angleVelocity = 0;
let angleAcceleration = 0;
let damping = parseFloat(dampingInput.value); 
let savedAngleVelocity = 0;
let originX = canvas.width / 2;
let originY = 0;
let isAnimating = false;
let dragging = false;
let lastTimestamp = null;
let period = 0;
let initialX, initialY;
const maxSwingAngle = Math.PI / 3; 
let savedAngle = 0; 
let savedAngleDisplacement=0;
let radiusInMeters= radius/100;

let baseRadius = 0.05; //  5 cm
let baseMass = 1; // 1 kg for 5 cm radius
let Mass = baseMass * (radiusInMeters / baseRadius);








function resizeCanvas() {
  const pendulumContainer = document.getElementById("pendulum-container");
  canvas.width = pendulumContainer.clientWidth;
  canvas.height = pendulumContainer.clientHeight;
  originX = canvas.width / 2;
  originY = 50;
  drawPendulum();
  drawProtractor();
  unblockMouseEvents();
}
function radToDeg(radians) {
  return radians * (180 / Math.PI);
}


function updateDisplayedAngle(angle) {
  let degAngle = radToDeg(angle);
  IangleInput.value = degAngle.toFixed(0); 
  IangleValue.textContent = `${degAngle.toFixed(0)} deg`; 
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

// Vertical scale and protactor------------------------------------------------------------------------------
function drawVerticalScale() {
  
  const scaleHeight = 1;
  const pixelPerMeter = 400;
  const scaleWidth = 40;

  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    canvas.width / 2 - 150,
    originY - 30,
    scaleWidth,
    scaleHeight * pixelPerMeter + 20
  );

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 145, originY-20); 
  ctx.lineTo(
    canvas.width / 2 - 145,
    originY-20 + scaleHeight * pixelPerMeter
  ); 
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = 0; i <= scaleHeight * 10; i++) {
    let y = originY-20 + (i * pixelPerMeter) / 10; 
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 145, y);
    ctx.lineTo(canvas.width / 2 - 140, y); 
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (i % 1 === 0) {
      const label = (i * 10).toFixed(0); 
      ctx.font = "10px Arial";
      ctx.textAlign = "right";
      ctx.fillStyle = "black";
      ctx.fillText(label + " cm", canvas.width / 2 - 110, y + 3); 
    }
  }
}


function drawProtractor() {
  
  let startX= originX;
  let startY=originY-35
  ctx.beginPath();
  ctx.arc(startX,startY , 60, Math.PI * 2.5 + 10, (Math.PI * 3) / 2);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let i = -90; i <= 90; i += 10) {
    let rad = (i * Math.PI) / 180;
    let x1 = startX + 62 * Math.sin(rad);
    let y1 = startY + 62 * Math.cos(rad);
    let x2 = startX + 68 * Math.sin(rad);
    let y2 = startY + 70 * Math.cos(rad);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }

  let maxRad = maxAngle;
  let minRad = minAngle;
  ctx.strokeStyle="red";
  ctx.lineWidth = 1;

  // Positive angle
  ctx.beginPath();
  let xMax = originX + 60 * Math.sin(maxRad);
  let yMax = originY + 60 * Math.cos(maxRad);
  ctx.moveTo(originX, originY-20);
  ctx.lineTo(xMax, yMax-20);
  ctx.stroke();

  // Negative angle
  ctx.beginPath();
  let xMin = originX + 60 * Math.sin(minRad);
  let yMin = originY + 60 * Math.cos(minRad);
  ctx.moveTo(originX, originY-20);
  ctx.lineTo(xMin, yMin-20);
  ctx.stroke();
}

// ----------------------------------------------------------------------------------------------------------
// draw pendulum 

function drawPendulum() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawProtractor();
  graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

  let x = originX + length * 400 * Math.sin(angle);
  let y = originY + length * 400 * Math.cos(angle);

  ctx.beginPath();
  ctx.moveTo(originX, originY-20);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // let bobRadius = radiusInMeters * 400;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#7393B3";
  ctx.fill();

  if (angle > maxAngle) maxAngle = angle;
  if (angle < minAngle) minAngle = angle;

  drawProtractor();
  if (showScale) {
    drawVerticalScale();
  }
  if (showGraph) {
    drawLineChart();
  }

  angleDisplay.textContent = (angle * (180 / Math.PI)).toFixed(1);
}


function animate(timestamp) {
  if (isAnimating) {
    updatePendulum(timestamp);
    drawPendulum();
  }
  requestAnimationFrame(animate);
}
let lastTime = performance.now();
let maxDeltaTime = 0.05; 

function updatePendulum(currentTime) {
  blockMouseEvents();

  let deltaTime = (currentTime - lastTime) / 1000; 
  lastTime = currentTime;

  deltaTime = Math.min(deltaTime, maxDeltaTime);

  if (angle > maxSwingAngle) angle = maxSwingAngle;
  if (angle < -maxSwingAngle) angle = -maxSwingAngle;

  angleAcceleration = ((-1 * gravity) / length) * Math.sin(angle);
  angleVelocity += angleAcceleration * deltaTime;
  angleVelocity *= damping;
  angle += angleVelocity * deltaTime;

  let displacement = length * Math.sin(angle); // x = L * sin(θ)
  let velocity = angleVelocity * length; // v = θ' * L
  let acceleration = angleAcceleration * length; // a = θ'' * L
  let kineticEnergy = 0.5 * Mass * Math.pow(velocity, 2); 
  let potentialEnergy = Mass * gravity * length * (1 - Math.cos(angle)); 
  let totalEnergy = kineticEnergy + potentialEnergy;
  if (timeData.length >= maxPoints) {
    timeData.shift();
    displacementData.shift();
    velocityData.shift();
    accelerationData.shift();
    energyData.shift();
    kineticEnergy.shift();
    potentialEnergy.shift();
  }

  timeData.push(currentTime / 1000); 
  displacementData.push(displacement);
  velocityData.push(velocity);
  accelerationData.push(acceleration);
  kineticEnergyData.push(kineticEnergy);
  potentialEnergyData.push(potentialEnergy);
  energyData.push(totalEnergy);


    period = 2 * Math.PI * Math.sqrt(length / gravity);
    periodDisplay.textContent = period.toFixed(4) + " s";
    massDisplay.textContent =Mass.toFixed(3) + " kg";
  drawGraphs();
}



function limitLength(x, y) {
  const maxLengthInPixels = 1 * 400;
  let newLengthInPixels = Math.sqrt(
    (x - originX) ** 2 + (y - originY) ** 2
  );
  newLengthInPixels = Math.min(newLengthInPixels, maxLengthInPixels);
  let newLengthInMeters = newLengthInPixels / 400;
  return Math.max(0.1, newLengthInMeters);
}

// -----------------------------------------------------------------------------------------------------------------------------------
function handleMouseMove(e) {
  if (dragging) {
    let x = e.offsetX;
    let y = e.offsetY;
    length = limitLength(x, y);

    let dx = x - originX;
    let dy = y - originY;
    angle = Math.atan2(dx, dy);

    newAngle = angle; 
    lengthInput.value = length;
    lengthValue.textContent = length.toFixed(2) + " m";
    angle = Math.max(-maxSwingAngle, Math.min(maxSwingAngle, angle)); // Limit angle
    angleDisplay.textContent = (angle * (180 / Math.PI)).toFixed(1);
    updateDisplayedAngle(angle);
    drawPendulum();
  }
}

function handleMouseDown(e) {
  dragging = true;
  initialX = e.offsetX;
  initialY = e.offsetY;
}

function handleMouseUp(e) {
  dragging = false;
  if (length > 0) {
    angleVelocity = 0; 
    isAnimating = true;
  }
}

function blockMouseEvents() {
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);
}

// Function to unblock mouse events by adding listeners
function unblockMouseEvents() {
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
}

unblockMouseEvents();

document.getElementById("controlButton")
  .addEventListener("click", function () {
    const buttonIcon = document.getElementById("buttonIcon");
    const buttonLabel = document.getElementById("buttonLabel");

    if (!isAnimating) {
      angleVelocity = savedAngleVelocity;
      angle = savedAngle;
      isAnimating = true;
      lastTimestamp = null; 
      // unblockMouseEvents();
      buttonIcon.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABMElEQVR4nO2ZsWpDIRSGjUJyl9zXa/MQiXbIHNBuTYeUC02f5A5ZQ3UNBKp5GYv7uehwQkP5Pzib/PLrt4hCAADA/yTn2dz+6M6msbPxRM3Cxb3Y3fpq1u7WL2x6n8rpbBrnr2lT9mTv0bm06lzK1bHxWM+KX01ZLq34i9j40VYkXepZ6dJ4KIc7FElD2ynGazXLxWvjoQwoMgVuhABqcQC1CKAWB1CLAGpxALUIoBYHUOvR1FLaD8qEXBupffU9Uta0ZCntUWQS3AgB1OIAahFALQ6gFgHU4gBqEUAtDqDWw6llwqHpPWJC9aOnrGkqYgL/R4988c+Np/hZy1LGHxsfaU/sRYTIM6n9RuowSh1O1Cjt38T2vKxGrUOvdNhP5ciyh/lelz3vUAQAAMTf8wuBrki0KqZ7PAAAAABJRU5ErkJggg==";
      buttonLabel.textContent = "Pause";
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
      // blockMouseEvents();
      savedAngleVelocity = angleVelocity;
      savedAngle = angle;
      buttonIcon.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACI0lEQVR4nO3ZMU8bMRgG4E/+yp2zMDC3apd2aH8BY38BDO3auR2CDR0YT7HVioEFCQlYQGJkQ5EqBqQsNHa6goh9UdUtWRlYyMChIyKpIiqR5nKxo3ulb430yL43Ph9AkSJFigwnlOYLlfaUSnMQRL/fgI8pCbNMpU3+mptANBlECQGfEgh7MgTpjbC14PulP6tDK/b4UUgP0w2l3YCtOATXQ4Xd/idkADqnldYieA+RKcbcUmn2IIrnwWuI7E0obLskmh/Adwjtj6mWovg5+A+x6Xa7cqaq6TiQh+0m7VnwLX7rPYS6UNU0K8hg4rDSfD8LkCSt6lDYw/noYsFviOw/Ox0q7CfvIYMxVSpbL2YAYtMyuKbCrMNRgn5D5MN2M/U50XrnPYT2VqcbSrMJ0R/qN0T2n51OGDVfzQDEplW9mwkEmdpGrpOpDVM73kMI0234+vOlxxDVRa43Iapl97DnDSFc1ed4I/v6zQ3C1DVhah0+Hk3mDzEPCOGqCmu/JntEmSiEqQ5hOp9D42Qg6haZOoTVen7HeMweEuOqzv/FCjOD3FfqBpR/TOdVFzOAEKbPoKyne/mA40CYuiJcuXEdhP8Jua/Usnbngg5HhTDVRq7duzLFJ0PSStV7UNZuXmLjEyCEq/NnrOH2ZwWyoo+drdRRQrg6eXwVdA3WGv58ekOul4ZW4caZSh01hDc+E65Okel9WFGvR/6BIkWKFIExcwd2JeL9HIdFQwAAAABJRU5ErkJggg==";
      buttonLabel.textContent = "Resume";
    }
  });
document.getElementById("start").addEventListener("click", () => {
  updateParameters(); 
  isAnimating = true;
  lastTimestamp = null;
  maxAngle = angle;
  minAngle = angle;
});

document.getElementById("reset").addEventListener("click", resetCanvas);
lengthInput.addEventListener("input", () => {
  length = parseFloat(lengthInput.value);
  lengthValue.textContent = length.toFixed(2) + " m";
  drawPendulum();
});

document.getElementById("length-increase").addEventListener("click", () => {
  length = Math.min(parseFloat(lengthInput.max), length + 0.01);
  lengthInput.value = length.toFixed(2);
  lengthValue.innerText = `${length.toFixed(2)} m`;
drawPendulum(); 
});

document.getElementById("length-decrease").addEventListener("click", () => {
  length = Math.max(parseFloat(lengthInput.min), length - 0.01);
  lengthInput.value = length.toFixed(2);
  lengthValue.innerText = `${length.toFixed(2)} m`;
drawPendulum(); 
});

IangleInput.addEventListener("input", () => {
  let inputAngle = parseFloat(IangleInput.value);
  angle = (inputAngle * Math.PI) / 180;
  IangleValue.textContent = `${inputAngle} °`;
  drawPendulum();
});

IangleIncrease.addEventListener("click", () => {
  let inputAngle = parseFloat(IangleInput.value);
  if (inputAngle < 60) {
    inputAngle += 1;
    IangleInput.value = inputAngle;
    angle = (inputAngle * Math.PI) / 180;
    IangleValue.textContent = `${inputAngle} °`;
    drawPendulum();
  }
});

IangleDecrease.addEventListener("click", () => {
  let inputAngle = parseFloat(IangleInput.value);
  if (inputAngle > -60) {
    inputAngle -= 1;
    IangleInput.value = inputAngle;
    angle = (inputAngle * Math.PI) / 180;
    IangleValue.textContent = `${inputAngle} °`;
    drawPendulum();
  }
});

radiusInput.addEventListener("input", () => {
  radius = parseFloat(radiusInput.value);
  radiusValue.textContent = radius.toFixed(2) + " cm";
  drawPendulum(); 
});

gravityInput.addEventListener("input", () => {
  gravity = parseFloat(gravityInput.value);
  gravityValue.textContent = gravity.toFixed(1) + " m/s²";
  drawPendulum(); 
});



document.getElementById("radius-increase").addEventListener("click", () => {
  radius = Math.min(parseFloat(radiusInput.max), radius + 0.01);
  radiusValue.innerText = `${radius.toFixed(2)} cm`;
  drawPendulum(); 

});

document.getElementById("radius-decrease").addEventListener("click", () => {
  radius = Math.max(parseFloat(radiusInput.min), radius - 0.01);
  radiusValue.innerText = `${radius.toFixed(2)} cm`;
  drawPendulum(); 

});

document
  .getElementById("gravity-increase")
  .addEventListener("click", () => {
    gravity = Math.min(parseFloat(gravityInput.max), gravity + 0.1);
    gravityInput.value = gravity.toFixed(1);
    gravityValue.innerText = `${gravity.toFixed(1)} m/s²`;
    drawPendulum();
  });

document
  .getElementById("gravity-decrease")
  .addEventListener("click", () => {
    gravity = Math.max(parseFloat(gravityInput.min), gravity - 0.1);
    gravityInput.value = gravity.toFixed(1);
    gravityValue.innerText = `${gravity.toFixed(1)} m/s²`;
    drawPendulum();
  });
dampingInput.addEventListener("input", () => {
  damping = parseFloat(dampingInput.value); 
  dampingValue.textContent = damping.toFixed(3); 
});

document
  .getElementById("damping-increase")
  .addEventListener("click", () => {
    damping = Math.min(1, damping + 0.001); 
    dampingInput.value = damping.toFixed(3);
    dampingValue.innerText = damping.toFixed(3);
  });

document
  .getElementById("damping-decrease")
  .addEventListener("click", () => {
    damping = Math.max(0.95, damping - 0.001); 
    dampingInput.value = damping.toFixed(3);
    dampingValue.innerText = damping.toFixed(3);
  });
  function updateParameters() {
    length = parseFloat(lengthInput.value);
    radius = parseFloat(radiusInput.value);
    gravity = parseFloat(gravityInput.value);
    damping = parseFloat(dampingInput.value);
    radiusInMeters = radius / 100; // Convert to meters
    Mass = baseMass * (radiusInMeters / baseRadius); // Update mass based on radius
    console.log("Updated parameters - Length:", length, "Radius:", radius, "Gravity:", gravity, "Damping:", damping, "Mass:", Mass);
}


  function resetCanvas() {
    radiusValue.innerText = 1.0 + ' kg';
    lengthValue.textContent = 0.5 + ' m'; 
    IangleValue.textContent = 0 + ' °';
    gravityValue.textContent = 9.8 + ' m/s²';
    dampingValue.textContent = 0.999;
  
    lengthInput.value = 0.5;  
    radiusInput.value = 1.0;
    gravityInput.value = 9.8;
    dampingInput.value = 0.999;
    IangleInput.value=0;
  
    length = 0.5;  
    angle = 0;  
    angleVelocity = 0;
    angleAcceleration = 0;
    period = 0;
    maxAngle = 0;
    minAngle = 0;
    periodDisplay.textContent = "0.0000 s";
    angleDisplay.textContent= "0.00 °";
    massDisplay.textContent= "0.000000 kg";
  
      timeData.length =
      displacementData.length =
      velocityData.length =
      accelerationData.length =
      energyData.length =
      kineticEnergyData.length =
      potentialEnergyData.length = 0;
      window.location.reload();
      unblockMouseEvents();
      drawPendulum();
    // requestAnimationFrame(animate);
    // window.onload = initializeCanvas;
  
  }
  
//stop watch.....................................-------------------------------------------------------------

// stop watch

let elapsedTime = 0;
let stopwatchInterval;
let isRunning = false;
let isPaused = false;

const display = document.getElementById("stopwatch-display");
const startBtn = document.getElementById("start-btn");
const pauseResumeBtn = document.getElementById("pause-resume-btn");
const resetBtn = document.getElementById("reset-btn");

function updateDisplay(time) {
  let hours = Math.floor(time / (60 * 60 * 1000));
  let minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
  let seconds = Math.floor((time % (60 * 1000)) / 1000);
  let milliseconds = Math.floor((time % 1000) / 10); // Show 2 digits for milliseconds

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
// Stop watch---------------------------------------------------------
      function startStopwatch() {
        startTime = Date.now() - elapsedTime;
        stopwatchInterval = setInterval(() => {
          elapsedTime = Date.now() - startTime;
          updateDisplay(elapsedTime);
        }, 10); 
        isRunning = true;
        startBtn.disabled = true;
        pauseResumeBtn.disabled = false;
        resetBtn.disabled = false;
      }

      function togglePauseResume() {
        if (isPaused) {
          startStopwatch();
          pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          clearInterval(stopwatchInterval);
          isRunning = false;
          pauseResumeBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        isPaused = !isPaused;
      }

      function resetStopwatch() {
        clearInterval(stopwatchInterval);
        elapsedTime = 0;
        updateDisplay(0);

        startBtn.disabled = false;
        pauseResumeBtn.disabled = true;
        resetBtn.disabled = true;
        pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPaused = false;
      }

      startBtn.addEventListener("click", startStopwatch);
      pauseResumeBtn.addEventListener("click", togglePauseResume);
      resetBtn.addEventListener("click", resetStopwatch);



maxAngle = angle;
minAngle = angle;
drawPendulum();
requestAnimationFrame(animate);
