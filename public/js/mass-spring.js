
// -------------------------------------------------------------------------------------------------------------
// spring system
let isDragging = false;
let mouseYStart, springLengthStart;
let canvas, ctx;
let springTopX,
  springTopY = 15;
let naturalLength = 100,
  bobRadius = 20;
let springLength, mass, springConstant, maxOscillations, graavity;
let isOscillating = false,
  startTime;
let animationInstance;
const NORMAL_DIVISOR = 75;
const SLOW_DIVISOR = 120;
const Normal_diviser_scalingFactor=0.0028;
const slow_diviser_scalingFactor=0.005;
let currentDivisorScalingFactor=Normal_diviser_scalingFactor;
let currentDivisor = NORMAL_DIVISOR; 

let showScaleCheckbox = document.getElementById("showScale");

let selectedWeightData = {
  weight: 10, 
  width: 10, 
  height: 10, 
  color: "grey", 
};

showScaleCheckbox.addEventListener("change", () => {
  showScale = showScaleCheckbox.checked;
  drawSetup();
});

document.getElementById('addValuesBtn').addEventListener('click', function() {
  const tableContainer = document.getElementById('tableContainer');
  tableContainer.style.display = 'block';  
});

function initializeCanvas() {
  canvas = document.getElementById("simulationCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  springTopX = canvas.width / 2;
  springLength = springTopY + naturalLength;
  drawSetup();

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  document.getElementById("playNormal").classList.add('active');
}

function drawVerticalScale() {
  const scaleHeight = 1; 
  const pixelPerMeter = 400; 
  const scaleWidth = 45; 
  const originY = 116; 

  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    canvas.width / 2 - 80,
    originY - 10,
    scaleWidth,
    scaleHeight * pixelPerMeter + 20
  );

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 75, originY - 5);
  ctx.lineTo(canvas.width / 2 - 75, originY + scaleHeight * pixelPerMeter);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = 0; i <= scaleHeight * 100; i++) { 
    let y = originY + (i * pixelPerMeter) / 100; 

    ctx.beginPath();
    if (i % 5 === 0) {
      ctx.moveTo(canvas.width / 2 - 75, y);
      ctx.lineTo(canvas.width / 2 - 65, y); 
    } else {
      ctx.moveTo(canvas.width / 2 - 75, y);
      ctx.lineTo(canvas.width / 2 - 70, y); 
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (i % 5 === 0) {
      const label = i.toFixed(0); 
      ctx.font = "10px Arial";
      ctx.textAlign = "right";
      ctx.fillStyle = "black";
      ctx.fillText(label + " cm", canvas.width / 2 - 37, y + 3);
    }
  }
}

function drawSetup() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (showScale) {
    drawVerticalScale();
  }

  const coils = 15; 
  const coilLength = (springLength - springTopY) / coils;
  const amplitude = 20;
  ctx.beginPath();
  ctx.moveTo(springTopX, springTopY);

  for (let i = 0; i < coils; i++) {
    const x =
      i % 2 === 0 ? springTopX - amplitude : springTopX + amplitude;
    const y = springTopY + i * coilLength;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(springTopX, springLength);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(springTopX - 10, springLength);
  ctx.lineTo(springTopX + 10, springLength);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();

  if (selectedWeightData.isFromSlider) {
    ctx.beginPath();
    ctx.arc(
      springTopX,
      springLength + bobRadius, 
      bobRadius, 
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "gray";
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.rect(
      springTopX - selectedWeightData.width / 2, 
      springLength,
      selectedWeightData.width, 
      selectedWeightData.height 
    );
    ctx.fillStyle = selectedWeightData.color; 
    ctx.fill();
  }
 
}


function handleMouseDown(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const distToBob = Math.sqrt(
    (mouseX - springTopX) ** 2 +
    (mouseY - (springLength + bobRadius)) ** 2
  );

  if (distToBob <= bobRadius) {
    isDragging = true;
    mouseYStart = mouseY;
    springLengthStart = springLength;
  }
}
function handleMouseMove(e) {
  if (isDragging) {
    const mouseY = e.clientY;
    const dragDistance = mouseY - mouseYStart;
    springLength = springLengthStart + dragDistance;

    drawSetup(); 
  }
}

function handleMouseUp(e) {
  if (isDragging) {
    isDragging = false;

    const currentLength = springLength;
    springLength = springTopY + naturalLength; 
    startOscillation(currentLength); 
  }
}



function handleWeightClick(event) {
  stopOscillation();
  const selectedWeight = parseInt(event.target.getAttribute("data-weight"));

  document.getElementById("massSlider").value = selectedWeight;
  document.getElementById("massValue").textContent = `${selectedWeight} g`;
  selectedWeightData.weight = selectedWeight;
  selectedWeightData.isFromSlider = false;
  selectedWeightData.width = event.target.offsetWidth;
  selectedWeightData.height = event.target.offsetHeight;
  selectedWeightData.color = getComputedStyle(event.target).backgroundColor;
  springLength = calculateSpringLength();
  drawSetup();
}

function handleSliderChange(event) {
  stopOscillation();
  const sliderWeight = parseInt(event.target.value);
  document.getElementById("massValue").textContent = `${sliderWeight} g`;
  selectedWeightData.weight = sliderWeight;
  selectedWeightData.isFromSlider = true; 
  springLength = calculateSpringLength();
  drawSetup();
}
function handleSpringConSliderChange(event) {
  stopOscillation();
  const springCons = parseFloat(event.target.value);
  document.getElementById("springValue").textContent = `${springCons}`;
  springLength = calculateSpringLength();
  drawSetup();
}

document
  .getElementById("weight1")
  .addEventListener("click", handleWeightClick);
document
  .getElementById("weight2")
  .addEventListener("click", handleWeightClick);
document
  .getElementById("weight3")
  .addEventListener("click", handleWeightClick);
document
  .getElementById("weight4")
  .addEventListener("click", handleWeightClick);

function calculateSpringLength() {
  mass = document.getElementById("massSlider").value;
  springConstant = document.getElementById("springSlider").value;
  gravity= document.getElementById("gravity").value;

  let force = mass * gravity; // Force due to gravity (F = m * g)
  let extension = force / springConstant; // Hooke's Law: F = k * x
  extension = extension / currentDivisor; 

  return springTopY + naturalLength + extension;
}
function stopOscillation() {
if (isOscillating && springAnimation) {
  springAnimation.pause();
  isOscillating = false;
}
}
function startOscillation() {
  if (!isOscillating) {
    mass = document.getElementById("massSlider").value;
    springConstant = document.getElementById("springSlider").value;

      isOscillating = true;
      bobRadius = Math.round(mass / 30);

      springLength = calculateSpringLength();
      drawSetup();

      animateSpring();
  }
}

function animateSpring() {
  let frequency = (1 / (2 * Math.PI)) * Math.sqrt(springConstant / mass);
  console.log(`Frequency: ${frequency}`);

  const maxFrequency = 0.1; 
  frequency = Math.min(frequency, maxFrequency);

  let duration = 1000 / frequency; 
  const scalingFactor = currentDivisorScalingFactor; 
  duration = duration*scalingFactor 
    
  console.log(`Duration: ${duration}`);

  if (isNaN(duration) || duration <= 0) {
    console.error("Invalid duration value. Animation will not work.");
    return;
  }

  springAnimation = anime({
    targets: { value: springTopY + naturalLength },
    value: springLength,
    duration: duration,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
    update: function (anim) {
      springLength = anim.animations[0].currentValue;
      drawSetup();
    },
  });
}


function calculateVelocity(displacement, elapsedTime) {
  return displacement / elapsedTime;
}

function calculateAcceleration(displacement) {
  return -(springConstant / mass) * displacement;
}

function resetExperiment() {
  isOscillating = false;

  mass = 100; 
  bobRadius = 0; 
  springLength = springTopY + naturalLength;
  oscillationCount = 0;
  startTime = null;

  document.getElementById("massSlider").value = 100;
  document.getElementById("massValue").textContent = "100 g"; 
  document.getElementById("springSlider").value = 0.5;
  document.getElementById("springValue").textContent = "0.5";
  document.getElementById("gravity").value = 9.8;
  document.getElementById("gravity-value").textContent = "9.8 m/s²";

  selectedWeightData.isFromSlider = true;

  maxOscillations = 0;

  if (springAnimation) {
    springAnimation.pause(); 
  }

  drawSetup(); 
}


// document.getElementById("startBtn").addEventListener("click", startOscillation);
document.getElementById("resetBtn").addEventListener("click", resetExperiment);

document.getElementById("playNormal").addEventListener("click", function () {
  currentDivisor = NORMAL_DIVISOR;
  currentDivisorScalingFactor=Normal_diviser_scalingFactor;
  document.getElementById('playNormal').classList.add('active');
  document.getElementById('playSlow').classList.remove('active');

  resetExperiment();
});

document.getElementById("playSlow").addEventListener("click", function () {
  currentDivisor = SLOW_DIVISOR;
  currentDivisorScalingFactor=slow_diviser_scalingFactor;
  document.getElementById('playSlow').classList.add('active');
  document.getElementById('playNormal').classList.remove('active');
  resetExperiment();
});

document.getElementById("massSlider").addEventListener("input", handleSliderChange);
document.getElementById("springSlider").addEventListener("input", handleSpringConSliderChange);



//gravityyyy
document.getElementById("gravityBtn").addEventListener("click", function () {
  const gravityControl = document.getElementById("gravity-control");

  if (
    gravityControl.style.display === "none" ||
    gravityControl.style.display === ""
  ) {
    gravityControl.style.display = "block";
    this.value = "-";
    this.classList.add("expanded");
  } else {
    gravityControl.style.display = "none";
    this.value = "+";
    this.classList.remove("expanded");
  }
});

const gravityInput = document.getElementById("gravity");
const gravityValue = document.getElementById("gravity-value");

document.getElementById("gravity-increase").addEventListener("click", function () {
  if (springAnimation) {
    springAnimation.pause(); 
  }
  if (parseFloat(gravityInput.value) < 25) {
    gravityInput.value = (parseFloat(gravityInput.value) + 0.1).toFixed(1);
    gravityValue.innerText = `${gravityInput.value} m/s²`;
  }
});

document.getElementById("gravity-decrease").addEventListener("click", function () {
  if (springAnimation) {
    springAnimation.pause(); 
  }
  if (parseFloat(gravityInput.value) > 0) {
    gravityInput.value = (parseFloat(gravityInput.value) - 0.1).toFixed(
      1
    );
    gravityValue.innerText = `${gravityInput.value} m/s²`;
  }
});

gravityInput.addEventListener("input", function () {
  gravityValue.innerText = `${gravityInput.value} m/s²`;
});

const gravitySelect = document.getElementById("gravitySelect");

gravitySelect.addEventListener("change", function () {
  if (springAnimation) {
    springAnimation.pause(); 
  }
  gravityInput.value = this.value;
  gravityValue.innerText = `${this.value} m/s²`;
});

document
  .getElementById("controlButton")
  .addEventListener("click", function () {
    const buttonIcon = document.getElementById("buttonIcon");
    const buttonLabel = document.getElementById("buttonLabel");

    if (!isOscillating) {
      startOscillation();
      isAnimating = true;
      lastTimestamp = null; 
      buttonIcon.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABMElEQVR4nO2ZsWpDIRSGjUJyl9zXa/MQiXbIHNBuTYeUC02f5A5ZQ3UNBKp5GYv7uehwQkP5Pzib/PLrt4hCAADA/yTn2dz+6M6msbPxRM3Cxb3Y3fpq1u7WL2x6n8rpbBrnr2lT9mTv0bm06lzK1bHxWM+KX01ZLq34i9j40VYkXepZ6dJ4KIc7FElD2ynGazXLxWvjoQwoMgVuhABqcQC1CKAWB1CLAGpxALUIoBYHUOvR1FLaD8qEXBupffU9Uta0ZCntUWQS3AgB1OIAahFALQ6gFgHU4gBqEUAtDqDWw6llwqHpPWJC9aOnrGkqYgL/R4988c+Np/hZy1LGHxsfaU/sRYTIM6n9RuowSh1O1Cjt38T2vKxGrUOvdNhP5ciyh/lelz3vUAQAAMTf8wuBrki0KqZ7PAAAAABJRU5ErkJggg==";

    } else {
     stopOscillation();
      isAnimating = false;
      buttonIcon.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACI0lEQVR4nO3ZMU8bMRgG4E/+yp2zMDC3apd2aH8BY38BDO3auR2CDR0YT7HVioEFCQlYQGJkQ5EqBqQsNHa6goh9UdUtWRlYyMChIyKpIiqR5nKxo3ulb430yL43Ph9AkSJFigwnlOYLlfaUSnMQRL/fgI8pCbNMpU3+mptANBlECQGfEgh7MgTpjbC14PulP6tDK/b4UUgP0w2l3YCtOATXQ4Xd/idkADqnldYieA+RKcbcUmn2IIrnwWuI7E0obLskmh/Adwjtj6mWovg5+A+x6Xa7cqaq6TiQh+0m7VnwLX7rPYS6UNU0K8hg4rDSfD8LkCSt6lDYw/noYsFviOw/Ox0q7CfvIYMxVSpbL2YAYtMyuKbCrMNRgn5D5MN2M/U50XrnPYT2VqcbSrMJ0R/qN0T2n51OGDVfzQDEplW9mwkEmdpGrpOpDVM73kMI0234+vOlxxDVRa43Iapl97DnDSFc1ed4I/v6zQ3C1DVhah0+Hk3mDzEPCOGqCmu/JntEmSiEqQ5hOp9D42Qg6haZOoTVen7HeMweEuOqzv/FCjOD3FfqBpR/TOdVFzOAEKbPoKyne/mA40CYuiJcuXEdhP8Jua/Usnbngg5HhTDVRq7duzLFJ0PSStV7UNZuXmLjEyCEq/NnrOH2ZwWyoo+drdRRQrg6eXwVdA3WGv58ekOul4ZW4caZSh01hDc+E65Okel9WFGvR/6BIkWKFIExcwd2JeL9HIdFQwAAAABJRU5ErkJggg==";
    }
  });
  
// -----------------------------------------------------------------------------------------------------------------
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
  let milliseconds = Math.floor((time % 1000) / 10); 

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Function to start the stopwatch
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


// toooltippppp

function setupTooltips() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip bottom'; // Add 'bottom' class for positioning
  document.body.appendChild(tooltip);

  // Position tooltip at bottom with offset
  const positionTooltip = (element, text) => {
    const rect = element.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
    tooltip.style.top = `${rect.bottom + 8}px`; // 8px below element
    tooltip.classList.add('active');
  };

  // For elements with data-intro
  document.querySelectorAll('[data-intro]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      positionTooltip(e.target, e.target.dataset.intro);
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });

  // For weight elements
  document.querySelectorAll('.weight').forEach(weight => {
    weight.addEventListener('mouseenter', (e) => {
      positionTooltip(e.target, `Use ${weight.textContent} weight`);
    });
    
    weight.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });

  
  // For canvas hover detection
  const canvas = document.getElementById('simulationCanvas');
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const distToBob = Math.sqrt(
      Math.pow(x - springTopX, 2) + 
      Math.pow(y - (springLength + bobRadius), 2)
    );
    
    if (distToBob <= bobRadius + 20) {
      tooltip.textContent = 'Drag to stretch the spring';
      tooltip.style.left = `${e.clientX - tooltip.offsetWidth/2}px`;
      tooltip.style.top = `${e.clientY + 20}px`; // 20px below cursor
      tooltip.classList.add('active');
    } else {
      tooltip.classList.remove('active');
    }
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });

  // For elements with data-tooltip
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      positionTooltip(e.target, e.target.dataset.tooltip);
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  });
}

// Add this near the top of your mass-spring.js file
function setupTooltips() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);

  // Function to position and show tooltip
  function showTooltip(element, text) {
    const rect = element.getBoundingClientRect();
    tooltip.textContent = text;
    
    // Position below the element
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
    
    tooltip.classList.add('active');
  }

  // Add tooltips to all elements with data-intro
  document.querySelectorAll('[data-intro]').forEach(el => {
    el.addEventListener('mouseenter', () => showTooltip(el, el.dataset.intro));
    el.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
  });

  // Add tooltips to weight elements
  document.querySelectorAll('.weight').forEach(weight => {
    weight.addEventListener('mouseenter', () => 
      showTooltip(weight, `Click to use ${weight.textContent} weight`)
    );
    weight.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
  });

  // Add tooltip to canvas when hovering the bob
  const canvas = document.getElementById('simulationCanvas');
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const distToBob = Math.sqrt(
      Math.pow(x - springTopX, 2) + 
      Math.pow(y - (springLength + bobRadius), 2)
    );
    
    if (distToBob <= bobRadius + 20) {
      showTooltip(canvas, 'Drag to stretch the spring');
    } else {
      tooltip.classList.remove('active');
    }
  });

  canvas.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
}

// Add this to the end of your existing mass-spring.js file

tab.addEventListener("click", function(e) {
  // e.preventDefault(); ❌ remove or comment this line

  tab.forEach(function(t) {
    t.classList.remove("active");
  });

  this.classList.add("active");

  const section = this.getAttribute("data-section");
  console.log("Navigated to: " + section);
});

// Call this in your initialization
window.addEventListener('load', function() {
  initializeCanvas();
  setupTooltips();  // Make sure this is called
});

window.onload = initializeCanvas;
window.onresize = initializeCanvas;