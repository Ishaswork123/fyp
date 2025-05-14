// Add this at the very top of the file, before any other code

// Global variables
let canvas, ctx
let springTopX, springTopY
let naturalLength = 280
let bobRadius
let springLength,
  mass = 0,
  springConstant = 0.5,
  gravity = 9.8
let currentWeight = 0
let indicatorOffset = 0
let springExtension = 0
let animation
let targetIndicatorOffset
let showSpringBalances = false
let isDraggingScale = false
let scaleOffsetX = 0
let isScaleBalanced = true
let scaleRotation = 0
let showAllForces = false
let showWeightForce = false
const showGPoint = false
const balanceThreshold = 5
const scaleVisible = true
let wedgeVisible = true
let springBalancesVisible = false
let positionMode = "none"
let simulationRunning = false
let showMassLabels = true

// Add a new variable to track meter rod visibility
let meterRodVisible = false

// Add these variables near the top with the other global variables
const scaleBaseWeight = 15 // Base weight of the scale (15g on each side)
let displayedWeightScale = 1 // Scale factor for displayed weights

// Scale properties
let scaleX, scaleY
const scaleGravityPoint = { x: 0, y: 0 }
let scaleIsOnWedge = true

// Hook properties
let hookX, hookY
let fixedGPoint = { x: 0, y: 0 }

// Spring balance attachment points
let attachPointA = { x: 0, y: 0 }
let attachPointB = { x: 0, y: 0 }

// Weight properties
const weights = [
  { id: "weight1", mass: 100, width: 45, height: 25, color: "#77b5fe" },
  { id: "weight2", mass: 300, width: 50, height: 70, color: "hsla(203, 66%, 52%, 0.669)" },
  { id: "weight3", mass: 200, width: 45, height: 55, color: "#40acd7" },
  { id: "weight4", mass: 500, width: 55, height: 100, color: "#6488e4" },
]

// Draggable weights array - the single source of truth
let draggableWeights = []

// Global variables for dragging
let currentDraggedWeight = null
let dragStartX = 0
let dragStartY = 0
const elementStartX = 0
const elementStartY = 0

// Dragging state
const isDraggingWeight = false
let draggedWeightIndex = -1
let isDraggingSpringBalance = false
let draggedSpringBalance = ""
let mouseX = 0,
  mouseY = 0

// Selected weight data
let selectedWeightData = {
  weight: 0,
  width: 0,
  height: 0,
  color: "",
  isHanging: false,
}

// Configuration object for relative positioning and sizing
const config = {
  scaleXPercentage: 0.5, // Centered to start
  scaleYPercentage: 0.6,
  weightStartXPercentage: 0.8,
  weightStartYPercentage: 0.85,
  weightSpacingPercentage: 0.05,
  springTopYPercentage: 0.05,
  springTopXPercentage: 0.5, // added
  baseSizePercentage: 0.02,
  springBalanceYPercentage: 0.1, // Added for SpringBalance Y
}

// Sizes based on base size (initialized in initializeSizes)
let baseSize
let meterRodLength, meterRodHeight, wedgeBase, wedgeHeight
let wedgeFixedX, wedgeFixedY

// Declare missing variables
// let drawScaleMarkings
// let drawExtinguisher
let drawTrashCanFn
let resetScalePositionFn
// let drawSetup // Declare drawSetup
// let calculateTorque
// let handleWeightClick

// ============================== Utility Functions ==============================

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initializeSizes()
  initializePositions()
}

function isClickOnToggle(x, y) {
  const switchX = canvas.width / 2
  const switchY = canvas.height - baseSize * 4 //Position relative to baseSize
  const togglePosition = simulationRunning ? switchX + baseSize * 2 : switchX - baseSize * 2
  const distance = Math.sqrt((x - togglePosition) ** 2 + (y - switchY) ** 2)
  return distance <= baseSize * 1.5 // Slightly larger click area
}

function isClickOnSpringBalance(x, y) {
  const springTopY = canvas.height * config.springTopYPercentage
  const springLeftX = attachPointA.x
  const springRightX = attachPointB.x

  if (
    x >= springLeftX - baseSize * 2.25 &&
    x <= springLeftX + baseSize * 2.25 &&
    y >= springTopY &&
    y <= springTopY + baseSize * 14
  ) {
    isDraggingSpringBalance = true
    draggedSpringBalance = "left"
    return true
  }

  if (
    x >= springRightX - baseSize * 2.25 &&
    x <= springRightX + baseSize * 2.25 &&
    y >= springTopY &&
    y <= springTopY + baseSize * 14
  ) {
    isDraggingSpringBalance = true
    draggedSpringBalance = "right"
    return true
  }

  return false
}

function isClickOnScale(x, y) {
  return x >= scaleX && x <= scaleX + meterRodLength && y >= scaleY && y <= scaleY + meterRodHeight
}

function isClickOnWeight(x, y) {
  for (let i = 0; i < draggableWeights.length; i++) {
    const weight = draggableWeights[i]
    if (
      !weight.onScale &&
      x >= weight.x - weight.width / 2 &&
      x <= weight.x + weight.width / 2 &&
      y >= weight.y - weight.height &&
      y <= weight.y
    ) {
      draggedWeightIndex = i
      return true
    }
  }
  return false
}

function isMouseOnScale(x, y) {
  // Check if coordinates are within scale bounds
  return x >= scaleX && x <= scaleX + meterRodLength && y >= scaleY && y <= scaleY + meterRodHeight
}

// ============================== Initialization Functions ==============================

function initializeWeights() {
  // Clear existing weights
  draggableWeights = [];

  // Create new weights
  draggableWeights = [
      {
          id: "extinguisher1",
          type: "extinguisher",
          mass: 5,
          // width: 48,
          // height: 96,
          color: "red",
          onScale: false,
          scalePosition: 0,
          isDragging: false,
          x: 0,
          y: 0,
      },
      {
          id: "extinguisher2",
          type: "extinguisher",
          mass: 5,
          // width: 48,
          // height: 96,
          color: "red",
          onScale: false,
          scalePosition: 0,
          isDragging: false,
          x: 0,
          y: 0,
      },
      {
          id: "trashcan1",
          type: "trashcan",
          mass: 10,
          // width: 64,
          // height: 112,
          color: "#888888",
          onScale: false,
          scalePosition: 0,
          isDragging: false,
          x: 0,
          y: 0,
      },
  ];

  // Position the weights
  // resetWeightsPosition();
}

function initializeSizes() {
  // Calculate base size based on the smaller dimension
  baseSize = Math.min(canvas.width, canvas.height) * config.baseSizePercentage * 1.5

  // Initialize sizes relative to baseSize
  meterRodLength = baseSize * 30
  meterRodHeight = baseSize * 1
  wedgeBase = baseSize * 3
  wedgeHeight = baseSize * 4.5
  bobRadius = baseSize * 1
  naturalLength = baseSize * 14 // Example, adjust as needed

  // Initialize draggable weights dimensions
  // draggableWeights.forEach((weight) => {
  //   weight.width = baseSize * (weight.type === "extinguisher" ? 2 : 3)
  //   weight.height = baseSize * (weight.type === "extinguisher" ? 4 : 5)
  // })
  if (draggableWeights && draggableWeights.length > 0) {
    draggableWeights.forEach((weight) => {
        if (weight.type === "extinguisher") {
            // Adjust these multipliers for desired proportions relative to baseSize
            weight.width = baseSize * 2;
            weight.height = baseSize * 3.5;
        } else if (weight.type === "trashcan") {
            // Adjust these multipliers for desired proportions relative to baseSize
            weight.width = baseSize * 2.3;
            weight.height = baseSize * 4; // Slightly taller/wider than extinguisher
        } else {
            // Fallback for any other types
            weight.width = baseSize * 2;
            weight.height = baseSize * 2;
        }
    });
} else {
    // This might happen if initializeSizes runs before initializeWeights somehow
    console.warn("Attempted to size weights before they were initialized.");
}
}

function initializePositions() {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // Initialize draggable weights if not already done
  if (!draggableWeights) {
    initializeDraggableWeights()
  }

  // Meter rod centered horizontally, 60% down
  scaleX = canvasWidth * config.scaleXPercentage - meterRodLength / 2
  scaleY = canvasHeight * config.scaleYPercentage

  // FIXED: Ensure the fixed G point is exactly at the center of the scale
  fixedGPoint = {
    x: scaleX + meterRodLength / 2,
    y: scaleY + meterRodHeight / 2,
  }

  // Wedge position (centered under the meter rod)
  wedgeFixedX = canvasWidth * 0.5 - wedgeBase / 2
  wedgeFixedY = scaleY + meterRodHeight

  // Spring balance attachment points
  attachPointA = {
    x: canvasWidth * 0.3,
    y: canvasHeight * config.springBalanceYPercentage,
  }
  attachPointB = {
    x: canvasWidth * 0.7,
    y: canvasHeight * config.springBalanceYPercentage,
  }

  // Draggable weights initial positions (bottom right)
  const weightSpacing = canvasWidth * config.weightSpacingPercentage
  const startX = canvasWidth * config.weightStartXPercentage
  const startY = canvasHeight * config.weightStartYPercentage

  // Only proceed if draggableWeights is initialized
  if (draggableWeights && draggableWeights.length > 0) {
    draggableWeights[0].x = startX
    draggableWeights[0].y = startY
    draggableWeights[1].x = startX + weightSpacing
    draggableWeights[1].y = startY
    draggableWeights[2].x = startX + 2 * weightSpacing
    draggableWeights[2].y = startY
  }

  springTopX = canvasWidth * config.springTopXPercentage
  springTopY = canvasHeight * config.springTopYPercentage

  hookX = canvasWidth / 2
  hookY = scaleY + meterRodHeight

  // Position the weights
  resetWeightsPosition()
}

function resetScalePosition() {
  const canvasWidth = canvas.width
  scaleX = canvasWidth * config.scaleXPercentage - meterRodLength / 2 // re-center

  scaleY = canvas.height * config.scaleYPercentage
  hookX = canvasWidth / 2
  hookY = scaleY + meterRodHeight

  // FIXED: Ensure the fixed G point is exactly at the center of the scale
  fixedGPoint = {
    x: scaleX + meterRodLength / 2, // Exact center of the scale
    y: scaleY + meterRodHeight / 2,
  }

  wedgeFixedX = canvasWidth * 0.5 - wedgeBase / 2
  wedgeFixedY = scaleY + meterRodHeight

  // Reset rotation to ensure balance
  scaleRotation = 0
}
function resetWeightsPosition() {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  const spacingMultiplier = 1.2;
  const weightSpacing = canvasWidth * config.weightSpacingPercentage * spacingMultiplier;
  const startX = canvasWidth * config.weightStartXPercentage // 80% from left
  const startY = canvasHeight * config.weightStartYPercentage // 85% from top

  // Position each weight
  draggableWeights.forEach((weight, index) => {
    weight.x = startX + index * weightSpacing 
    weight.y = startY
    weight.onScale = false
    weight.isDragging = false
  })
}

// ============================== Drawing Functions ==============================

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, "#87CEEB")
  gradient.addColorStop(1, "#B0E0E6")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#8FBC8F"
  ctx.fillRect(0, canvas.height - 100, canvas.width, canvas.height)
}

function drawWithWedge() {
  scaleIsOnWedge = true
  wedgeFixedX = canvas.width * 0.5 - wedgeBase / 2 // Keep it centered
  wedgeFixedY = scaleY + meterRodHeight

  if (wedgeVisible) {
    drawWedge()
  }

  if (!simulationRunning) {
    drawSupports()
  }

  drawScale(scaleX, scaleY, scaleRotation)
}

function drawWedge() {
  ctx.fillStyle = "red"
  ctx.beginPath()
  ctx.moveTo(wedgeFixedX, wedgeFixedY + wedgeHeight)
  ctx.lineTo(wedgeFixedX + wedgeBase, wedgeFixedY + wedgeHeight)
  ctx.lineTo(wedgeFixedX + wedgeBase / 2, wedgeFixedY)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawSupports() {
  const supportWidth = baseSize // Make it relative to baseSize
  const supportHeight = baseSize * 4

  // Left support
  ctx.fillStyle = "#CCCCCC"
  ctx.fillRect(scaleX - supportWidth, scaleY + meterRodHeight, supportWidth, supportHeight)
  ctx.strokeStyle = "#888888"
  ctx.strokeRect(scaleX - supportWidth, scaleY + meterRodHeight, supportWidth, supportHeight)

  // Base for left support
  ctx.fillStyle = "#AAAAAA"
  ctx.fillRect(scaleX - supportWidth - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20)
  ctx.strokeStyle = "#888888"
  ctx.strokeRect(scaleX - supportWidth - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20)

  // Right support
  ctx.fillStyle = "#CCCCCC"
  ctx.fillRect(scaleX + meterRodLength, scaleY + meterRodHeight, supportWidth, supportHeight)
  ctx.strokeStyle = "#888888"
  ctx.strokeRect(scaleX + meterRodLength, scaleY + meterRodHeight, supportWidth, supportHeight)

  // Base for right support
  ctx.fillStyle = "#AAAAAA"
  ctx.fillRect(scaleX + meterRodLength - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20)
  ctx.strokeStyle = "#888888"
  ctx.strokeRect(scaleX + meterRodLength - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20)
}

function drawWithoutWedge() {
  scaleIsOnWedge = false

  if (springBalancesVisible) {
    scaleY = springTopY + baseSize * 15.25 // Adjust based on baseSize

    if (isDraggingSpringBalance) {
      if (draggedSpringBalance === "left") {
        attachPointA.x = Math.max(baseSize * 2.5, Math.min(canvas.width - baseSize * 2.5, mouseX - 50))
        attachPointA.y = Math.max(baseSize * 2.5, Math.min(canvas.height - baseSize * 15, mouseY))
      } else if (draggedSpringBalance === "right") {
        attachPointB.x = Math.max(baseSize * 2.5, Math.min(canvas.width - baseSize * 2.5, mouseX - 50))
        attachPointB.y = Math.max(baseSize * 2.5, Math.min(canvas.height - baseSize * 15, mouseY))
      }
    }

    // Remove the isDraggingScale condition to prevent scale dragging when connected to meter rods

    drawSpringBalances(true, scaleY)
    drawScale(scaleX, scaleY, scaleRotation)

    // Center the hook on the meter rod
    hookX = scaleX + meterRodLength / 2
    hookY = scaleY + meterRodHeight
    drawHook(hookX, hookY)

    if (selectedWeightData.isHanging) {
      drawWeight(hookX, hookY)
    }
  } else {
    drawScale(scaleX, scaleY, scaleRotation)
  }
}

// IMPROVED: Scale drawing with proper rotation
function drawScale(x, y, rotation = 0) {
  ctx.save() // Save the current context state

  // Apply rotation around the fixed G point if the simulation is running
  if (simulationRunning) {
    ctx.translate(fixedGPoint.x, fixedGPoint.y)
    ctx.rotate(rotation)
    ctx.translate(-fixedGPoint.x, -fixedGPoint.y)
  }

  // Draw the scale at the updated position
  ctx.fillStyle = "#E8C48E" // Light wood color
  ctx.fillRect(x, y, meterRodLength, meterRodHeight)
  ctx.strokeStyle = "#8B4513" // Dark brown for border
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, meterRodLength, meterRodHeight)


  if (springBalancesVisible) {
    drawSpringBalanceScaleMarkings(x, y);
    } else if (positionMode === "rulers") {
      drawScaleMarkings(x, y);
    }


  // Draw scale markings if rulers are enabled
  // if (positionMode === "rulers") {
  //   drawScaleMarkings(x, y)
  // }

  // Draw the G point indicator only if showGPoint is true
  if (showGPoint) {

    ctx.arc(fixedGPoint.x, fixedGPoint.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "Green"
    ctx.font = "bold " + baseSize + "px Arial"
    const centerX = x + meterRodLength / 2
    ctx.fillText("G", centerX - 5, y - 10)

    // Draw the gravity point indicator
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(fixedGPoint.x, fixedGPoint.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore() // Restore the original context state
}

function drawSpringBalanceScaleMarkings(x, y) {
  const totalCm = 200; // The scale represents 200 cm
  const stepCm = 10;   // Markings every 10 cm
  const pixelsPerCm = meterRodLength / totalCm;

  ctx.fillStyle = "black";
  ctx.font = `bold ${baseSize * 0.6}px Arial`; // Slightly smaller font
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom"; // Align text bottom edge just above the mark line

  // --- Draw CM Markings and Labels ---
  for (let cm = 0; cm <= totalCm; cm += stepCm) {
      const markX = x + cm * pixelsPerCm;
      const markStartY = y; // Top edge of the scale
      const markEndY = y + baseSize * 0.6; // Length of the tick mark

      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(markX, markStartY);
      ctx.lineTo(markX, markEndY);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw label (every 10 cm)
      ctx.fillText(`${cm}`, markX, markStartY - baseSize * 0.2); // Position slightly above scale
  }
   // Add "cm" unit label near the center
   ctx.fillText("cm", x + meterRodLength / 2, y - baseSize * 1.2);


  // --- Draw A, G, B Labels ---
  ctx.font = `bold ${baseSize * 0.8}px Arial`; // Slightly larger for A, G, B
  ctx.fillStyle = "blue"; // Use a distinct color for A, G, B
  ctx.textBaseline = "bottom"; // Align text bottom edge just above the scale

  // Label A (Left Attachment Point)
  // Map the spring balance X to the scale's coordinate system
  const labelAX = attachPointA.x; // Directly use the spring balance attach X
  ctx.fillText("A", labelAX, y + baseSize * 0.8);

  // Label G (Center of Gravity - Fixed Point)
  const labelGX = fixedGPoint.x; // Center of the scale
  ctx.fillText("G", labelGX, y + baseSize * 0.8);

  // Label B (Right Attachment Point)
  const labelBX = attachPointB.x; // Directly use the spring balance attach X
  ctx.fillText("B", labelBX, y + baseSize * 0.8);
}

function drawScaleMarkings(x, y) {
  ctx.fillStyle = "black"
  ctx.font = "bold " + baseSize / 2 + "px Arial"
  ctx.textAlign = "center"

  // Draw "Meters" label on both sides
  ctx.fillText("Meters", x + meterRodLength * 0.25, y + baseSize * 2)
  ctx.fillText("Meters", x + meterRodLength * 0.75, y + baseSize * 2)

  // Draw center mark
  ctx.beginPath()
  ctx.moveTo(x + meterRodLength / 2, y)
  ctx.lineTo(x + meterRodLength / 2, y + baseSize / 2)
  ctx.stroke()

  // Draw markings in meters (0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2) on both sides
  const markings = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
  const centerX = x + meterRodLength / 2

  // Calculate the distance between marks (in pixels)
  const meterInPixels = meterRodLength / 4 // 2 meters on each side = 4 meters total

  // Draw right side markings (positive)
  for (let i = 0; i < markings.length; i++) {
    const markX = centerX + markings[i] * meterInPixels

    // Draw the mark
    ctx.beginPath()
    ctx.moveTo(markX, y)
    ctx.lineTo(markX, y + baseSize / 2)
    ctx.stroke()

    // Draw the label
    ctx.fillText(markings[i].toString(), markX, y - baseSize / 2)
  }

  // Draw left side markings (negative)
  for (let i = 0; i < markings.length; i++) {
    const markX = centerX - markings[i] * meterInPixels

    // Draw the mark
    ctx.beginPath()
    ctx.moveTo(markX, y)
    ctx.lineTo(markX, y + baseSize / 2)
    ctx.stroke()

    // Draw the label
    ctx.fillText(markings[i].toString(), markX, y - baseSize / 2)
  }
}

// Modify the drawSpringBalance function to show the 15g weight on the indicator
function drawSpringBalance(springTopX, springTopY, attachRod = false, rodY = 0) {
  // When spring balances are visible, we need to calculate the weight distribution
  // Base weight of the scale (15g on each side)
  const scaleBaseWeight = 15

  // Calculate the total weight on the rod including any hanging weights
  let totalWeight = scaleBaseWeight * 2 // 15g on each side of the rod

  // Add any hanging weight
  if (selectedWeightData.isHanging && selectedWeightData.weight > 0) {
    totalWeight += selectedWeightData.weight
  }

  // Since we have two spring balances, each takes half the weight
  const weightPerBalance = totalWeight / 2

  // Define colors and gradients for 3D effect
  const casingColor = "#c0c0c0" // Light grey for casing
  const innerAreaColor = "#ffffff" // White for measurement area

  // Create a gradient for the casing
  const casingGradient = ctx.createLinearGradient(
    springTopX - baseSize * 2.25,
    springTopY,
    springTopX + baseSize * 2.25,
    springTopY,
  )
  casingGradient.addColorStop(0, "#808080") // Darker grey
  casingGradient.addColorStop(0.5, casingColor)
  casingGradient.addColorStop(1, "#a9a9a9") // Medium grey

  // Casing with a 3D effect using gradients
  ctx.fillStyle = casingGradient
  ctx.fillRect(springTopX - baseSize * 2.25, springTopY, baseSize * 4.5, baseSize * 14)

  // Inner measurement area (white)
  ctx.fillStyle = innerAreaColor
  ctx.fillRect(springTopX - baseSize * 2, springTopY + baseSize * 1.25, baseSize * 4, baseSize * 12)

  // Draw scales
  ctx.font = baseSize / 2 + "px Arial"
  ctx.fillStyle = "black"

  // Draw N and g labels
  ctx.fillText("N", springTopX - baseSize * 1.25, springTopY + baseSize * 2.25)
  ctx.fillText("g", springTopX + baseSize * 0.75, springTopY + baseSize * 2.25)

  // Left scale (Newtons) with small divisions
  for (let i = 0; i <= 10; i++) {
    const y = springTopY + baseSize * 3 + i * baseSize
    ctx.fillText(i, springTopX - baseSize * 1.25, y)
    // Draw main division line
    ctx.beginPath()
    ctx.moveTo(springTopX - baseSize * 0.5, y - baseSize / 25)
    ctx.lineTo(springTopX, y - baseSize / 25)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw small divisions between main points
    for (let j = 1; j < 5; j++) {
      const smallY = y + (j * baseSize) / 5
      ctx.beginPath()
      ctx.moveTo(springTopX - baseSize * 0.25, smallY - baseSize / 25)
      ctx.lineTo(springTopX, smallY - baseSize / 25)
      ctx.stroke()
    }
  }

  // Right scale (grams) with small divisions
  for (let i = 0; i <= 10; i++) {
    const y = springTopY + baseSize * 3 + i * baseSize

    // Draw main division label and line
    ctx.fillText(i * 100, springTopX + baseSize * 0.75, y)
    ctx.beginPath()
    ctx.moveTo(springTopX, y - baseSize / 25)
    ctx.lineTo(springTopX + baseSize * 0.5, y - baseSize / 25)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw small divisions (4 per section)
    for (let j = 1; j < 5; j++) {
      const smallY = y + (j * baseSize) / 5 // Properly spaced small lines
      ctx.beginPath()
      ctx.moveTo(springTopX, smallY - baseSize / 25)
      ctx.lineTo(springTopX + baseSize * 0.25, smallY - baseSize / 25)
      ctx.stroke()
    }
  }

  // Draw vertical line between scales
  ctx.beginPath()
  ctx.moveTo(springTopX, springTopY + baseSize * 3 - baseSize / 25)
  ctx.lineTo(springTopX, springTopY + baseSize * 13 - baseSize / 25)
  ctx.strokeStyle = "black"
  ctx.lineWidth = 1
  ctx.stroke()

  // Calculate the indicator position based on physics
  const scaleHeight = baseSize * 10 // Height of the scale area

  // Calculate extension based on physics: F = k*x, where F = m*g
  // So x = (m*g)/k
  const forceInNewtons = (weightPerBalance / 1000) * gravity // Convert grams to kg, then multiply by g
  const extensionRatio = Math.max(0, Math.min(1, forceInNewtons / (springConstant * 10))) // Scale to 0-1 range

  // Position the indicator based on the weight
  const indicatorPosition = springTopY + baseSize * 3 + extensionRatio * scaleHeight

  // Draw the indicator with the calculated position
  drawIndicator(springTopX, indicatorPosition)

  // Bottom Hook
  drawHook(springTopX, springTopY + baseSize * 14)

  // **If attaching the rod, draw a line connecting the spring balance to the rod**
  if (attachRod) {
    ctx.beginPath()
    ctx.moveTo(springTopX, springTopY + baseSize * 14) // From the bottom hook
    ctx.lineTo(springTopX, rodY) // To the meter rod
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function drawSpringBalances(attachRod = false, rodY = 0) {
  const springTopY = canvas.height * config.springTopYPercentage
  const springLeftX = attachPointA.x
  const springRightX = attachPointB.x

  drawSpringBalance(springLeftX, springTopY, attachRod, rodY)
  drawSpringBalance(springRightX, springTopY, attachRod, rodY)
}

function drawIndicator(springTopX, indicatorPosition) {
  ctx.beginPath()
  ctx.moveTo(springTopX - baseSize * 1.25, indicatorPosition)
  ctx.lineTo(springTopX + baseSize * 1.25, indicatorPosition)
  ctx.strokeStyle = "red"
  ctx.lineWidth = 3
  ctx.stroke()
}

function drawHook(x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + baseSize)
  ctx.arc(x, y + baseSize, baseSize / 4, 0, Math.PI)
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawWeight(x, y) {
  if (selectedWeightData.isHanging && selectedWeightData.weight > 0) {
    ctx.fillStyle = selectedWeightData.color
    const weightWidth = baseSize * 2.5
    const weightHeight = baseSize * 2

    ctx.fillRect(x - weightWidth / 2, y + baseSize * 1.25, weightWidth, weightHeight)
    ctx.strokeStyle = "black"
    ctx.strokeRect(x - weightWidth / 2, y + baseSize * 1.25, weightWidth, weightHeight)

    ctx.fillStyle = "white"
    ctx.font = "bold " + baseSize / 1.25 + "px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`${selectedWeightData.weight}g`, x, y + baseSize * 2.5)

    if (showWeightForce) {
      const force = (selectedWeightData.weight / 1000) * gravity
      drawForceArrow(x, y + baseSize * 1.25 + weightHeight / 2, "down", `${force.toFixed(2)}N`)
    }
    const massSlider= document.getElementById("massSlider");
    massSlider.value = Number.parseInt(selectedWeightData.weight);
  document.getElementById("massValue").textContent = `${selectedWeightData.weight} g`

  }
}

function drawForceArrow(x, y, direction, label, angle = 0) {
  ctx.save()
  ctx.setLineDash([5, 3])
  ctx.lineWidth = 2
  ctx.strokeStyle = direction === "down" ? "red" : "blue"
  const arrowLength = baseSize * 3.5
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.translate(-x, -y) // Rotate coordinate system
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + arrowLength) // Draw line along new Y axis
  ctx.lineTo(x - baseSize / 8, y + arrowLength - baseSize / 4) // Arrowhead part 1
  ctx.moveTo(x, y + arrowLength)
  ctx.lineTo(x + baseSize / 8, y + arrowLength - baseSize / 4) // Arrowhead part 2
  ctx.stroke()
  ctx.translate(x, y)
  ctx.rotate(-angle)
  ctx.translate(-x, -y) // Rotate back for text
  ctx.font = baseSize / 1.5 + "px Arial"
  ctx.fillStyle = ctx.strokeStyle
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillText(label, x, y + arrowLength + 5) // Position text below arrow
  ctx.restore()
}


function drawDraggableWeights() {
  draggableWeights.forEach((weight) => {
      if (!weight.onScale && !weight.isDragging) {
          if (weight.type === "extinguisher") {
              drawExtinguisher(weight.x, weight.y, weight.width, weight.height, weight.mass);
          } else if (weight.type === "trashcan") {
              drawTrashCan(weight.x, weight.y, weight.width, weight.height, weight.mass);
          }
      }
  });

  // Draw weights on scale with rotation if simulation is running
  ctx.save();
  if (simulationRunning) {
      ctx.translate(fixedGPoint.x, fixedGPoint.y);
      ctx.rotate(scaleRotation);
      ctx.translate(-fixedGPoint.x, -fixedGPoint.y);
  }

  draggableWeights.forEach((weight) => {
      if (weight.onScale && !weight.isDragging) {
          const x = weight.scalePosition;
          const y = scaleY;

          if (weight.type === "extinguisher") {
              drawExtinguisher(x, y, weight.width, weight.height, weight.mass);
          } else if (weight.type === "trashcan") {
              drawTrashCan(x, y, weight.width, weight.height, weight.mass);
          }
      }
  });

  ctx.restore();

  // Draw weights being dragged (always on top)
  draggableWeights.forEach((weight) => {
      if (weight.isDragging) {
          if (weight.type === "extinguisher") {
              drawExtinguisher(weight.x, weight.y, weight.width, weight.height, weight.mass);
          } else if (weight.type === "trashcan") {
              drawTrashCan(weight.x, weight.y, weight.width, weight.height, weight.mass);
          }
      }
  });

  // Draw force arrows if enabled
  if (showAllForces) {
      draggableWeights.forEach((weight) => {
          if (weight.onScale && !weight.isDragging) {
              const force = weight.mass * gravity;
              drawForceArrow(weight.scalePosition, scaleY - weight.height / 2, "down", `${force.toFixed(1)}N`);
          }
      });
  }
}

function drawExtinguisher(x, y, width, height, mass) {
  // Draw the extinguisher body with black border
  const topLeftX = x - width / 2;
  const topLeftY = y - height;
  
  ctx.fillStyle = "red";
  ctx.fillRect(topLeftX, topLeftY, width, height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeftX, topLeftY, width, height);

  const nozzleWidth = width * 0.5; 
  const nozzleHeight = width * 0.2; 
  // Draw the nozzle
  ctx.fillStyle = "black"
  ctx.fillRect(x - nozzleWidth / 2, topLeftY - nozzleHeight, nozzleWidth, nozzleHeight);

  // Draw the label if mass labels are enabled
  if (showMassLabels) {
        ctx.fillStyle = "white";
        ctx.font = `bold ${baseSize * 0.8}px Arial`; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 

        const displayMass = Math.round(mass / displayedWeightScale);
        ctx.fillText(`${displayMass} kg`, x, y - height / 2);
    }
}

function drawTrashCan(x, y, width, height, mass) {
  // Calculate top-left coordinates from center-bottom (x, y)
  const topLeftX = x - width / 2;
  const topLeftY = y - height;

  // Draw the trashcan body
  ctx.fillStyle = "#888888";
  ctx.fillRect(topLeftX, topLeftY, width, height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeftX, topLeftY, width, height);

  // Draw the lid (proportional, positioned above body)
  const lidWidth = width * 1.1; 
  const lidHeight = height * 0.1; 
  ctx.fillStyle = "#666666";
  ctx.fillRect(x - lidWidth / 2, topLeftY - lidHeight, lidWidth, lidHeight);

  // Draw the label if mass labels are enabled (responsive font size)
  if (showMassLabels) {
      ctx.fillStyle = "white";
      ctx.font = `bold ${baseSize * 0.8}px Arial`; 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"; 

      const displayMass = Math.round(mass / displayedWeightScale);
      ctx.fillText(`${displayMass} kg`, x, y - height / 2);
  }
}

function drawToggleSwitch() {
  // Don't draw the toggle switch if meter rod is visible
  if (meterRodVisible) {
    return
  }

  const switchX = canvas.width / 2
  const switchY = canvas.height - baseSize * 4 //Position relative to baseSize
  const switchWidth = baseSize * 7.5
  const switchHeight = baseSize * 2
  const togglePosition = simulationRunning ? switchX + baseSize * 2 : switchX - baseSize * 2

  ctx.fillStyle = "#EEEEEE"
  ctx.strokeStyle = "#333333"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(switchX - switchWidth / 2, switchY - switchHeight / 2, switchWidth, switchHeight, baseSize)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = simulationRunning ? "#4CAF50" : "#F44336"
  ctx.beginPath()
  ctx.arc(togglePosition, switchY, baseSize, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = "#333333"
  ctx.stroke()

  ctx.fillStyle = "#333333"
  ctx.font = baseSize / 1.5 + "px Arial"
  ctx.textAlign = "center"

  // Draw power symbol
  ctx.beginPath()
  ctx.moveTo(switchX - baseSize * 2.25, switchY)
  ctx.lineTo(switchX - baseSize * 2.25, switchY + baseSize / 2)
  ctx.lineTo(switchX - baseSize * 2, switchY)
  ctx.lineTo(switchX - baseSize * 2.5, switchY)
  ctx.closePath()
  ctx.fillStyle = "#FFFF00"
  ctx.fill()
  ctx.stroke()

  // Draw play symbol
  ctx.beginPath()
  ctx.moveTo(switchX + baseSize * 1.5, switchY - baseSize / 4)
  ctx.lineTo(switchX + baseSize * 3, switchY + baseSize / 4)
  ctx.strokeStyle = "#333333"
  ctx.stroke()
}

// ============================== Update Functions ==============================

function updateCurrentWeight() {
  const scaleWeight = 110
  currentWeight = scaleWeight + mass
}

function updateSpringExtension() {
  springExtension = ((mass / 1000) * gravity) / springConstant
  if (animation) {
    animation.pause()
  }

  animation = anime({
    targets: this,
    springExtension: springExtension,
    duration: 800,
    easing: "easeInOutQuad",
    update: () => {
      drawSetup()
    },
  })
}

function updateIndicatorOffset() {
  targetIndicatorOffset = springExtension

  if (animation) {
    animation.pause()
  }

  animation = anime({
    targets: this,
    indicatorOffset: targetIndicatorOffset,
    duration: 800,
    easing: "easeInOutQuad",
    update: drawSetup,
  })
}

function updateWeightFromSlider(event) {
  const sliderWeight = Number.parseInt(event.target.value)
  document.getElementById("massValue").textContent = `${sliderWeight} g`
  mass = sliderWeight
  selectedWeightData = {
    weight: sliderWeight,
    width: baseSize * 1.5, //relative
    height: baseSize * 2, //relative
    color: "gray",
    isHanging: true,
  }
  updateCurrentWeight()
  updateSpringExtension()
  updateIndicatorOffset()
  drawSetup()
}

function updateSpringConstant(event) {
  const sliderValue = Number.parseFloat(event.target.value)
  document.getElementById("springValue").textContent = sliderValue.toFixed(1)
  springConstant = sliderValue

  // Update the display scale based on spring constant
  // When spring constant is 0.5, we'll scale the displayed weights
  if (sliderValue === 0.5) {
    displayedWeightScale = 2 // Scale down by factor of 2
  } else {
    displayedWeightScale = 1 // No scaling for other values
  }

  updateSpringExtension()
  drawSetup() // Redraw to update displayed weights
}

function updateGravity(event) {
  const newGravity = Number.parseFloat(event.target.value)
  gravity = newGravity
  document.getElementById("gravity-value").innerText = `${newGravity} m/s²`
  updateSpringExtension()
  updateIndicatorOffset()
  drawSetup()
}

// ============================== Control Functions ==============================

function decreaseMass() {
  const massSlider = document.getElementById("massSlider")
  if (Number.parseInt(massSlider.value) > Number.parseInt(massSlider.min)) {
    massSlider.value = Number.parseInt(massSlider.value) - Number.parseInt(massSlider.step)
    updateWeightFromSlider({ target: massSlider })
  }
}

function increaseMass() {
  const massSlider = document.getElementById("massSlider")
  if (Number.parseInt(massSlider.value) < Number.parseInt(massSlider.max)) {
    massSlider.value = Number.parseInt(massSlider.value) + Number.parseInt(massSlider.step)
    updateWeightFromSlider({ target: massSlider })
  }
}

function decreaseSpringConstant() {
  const springSlider = document.getElementById("springSlider")
  if (Number.parseFloat(springSlider.value) > Number.parseFloat(springSlider.min)) {
    springSlider.value = (Number.parseFloat(springSlider.value) - Number.parseFloat(springSlider.step)).toFixed(1)
    updateSpringConstant({ target: springSlider })
  }
}

function increaseSpringConstant() {
  const springSlider = document.getElementById("springSlider")
  if (Number.parseFloat(springSlider.value) < Number.parseFloat(springSlider.max)) {
    springSlider.value = (Number.parseFloat(springSlider.value) + Number.parseFloat(springSlider.step)).toFixed(1)
    updateSpringConstant({ target: springSlider })
  }
}

function decreaseGravity() {
  const gravityInput = document.getElementById("gravity")
  if (Number.parseFloat(gravityInput.value) > 0) {
    gravityInput.value = (Number.parseFloat(gravityInput.value) - 0.1).toFixed(1)
    updateGravity({ target: gravityInput })
  }
}

function increaseGravity() {
  const gravityInput = document.getElementById("gravity")
  if (Number.parseFloat(gravityInput.value) < 25) {
    gravityInput.value = (Number.parseFloat(gravityInput.value) + 0.1).toFixed(1)
    updateGravity({ target: gravityInput })
  }
}

function toggleShowAllForces(event) {
  showAllForces = event.target.checked
  drawSetup()
}

function toggleShowWeightForce(event) {
  showWeightForce = event.target.checked
  drawSetup()
}

function toggleNoDisplayScale(event) {
  if (event.target.checked) {
    positionMode = "none"
    drawSetup()
  }
}

function toggleRulers(event) {
  if (event.target.checked) {
    positionMode = "rulers"
    drawSetup()
  }
}

function toggleGravityControls() {
  const gravityControl = document.getElementById("gravity-control")
  const gravityBtn = document.getElementById("gravityBtn")

  if (gravityControl.style.display === "none" || gravityControl.style.display === "") {
    gravityControl.style.display = "block"
    gravityBtn.value = "-"
    gravityBtn.classList.add("expanded")
  } else {
    gravityControl.style.display = "none"
    gravityBtn.value = "+"
    gravityBtn.classList.remove("expanded")
  }
}

function selectGravity(event) {
  const value = event.target.value
  document.getElementById("gravity").value = value
  updateGravity({ target: { value: value } })
}

// Replace toggleWedge with this simple version
function toggleWedge() {
  wedgeVisible = !wedgeVisible
  console.log("Wedge visibility:", wedgeVisible)
  drawSetup()
}

// Modify the toggleSpringBalances function to update the meterRodVisible flag
function toggleSpringBalances() {
  springBalancesVisible = !springBalancesVisible
  console.log("Spring balances toggled:", springBalancesVisible)

  // Update meter rod visibility flag
  meterRodVisible = springBalancesVisible

  // Reset weights that were on the scale to their initial positions
  draggableWeights.forEach((weight) => {
    if (weight.onScale) {
      weight.onScale = false
    }
  })

  // Center the hook on the meter rod when spring balances are visible
  hookX = scaleX + meterRodLength / 2
  hookY = scaleY + meterRodHeight

  if (!springBalancesVisible) {
    // Reset the hanging weight
    selectedWeightData.isHanging = false
  }

  // Reset rotation
  scaleRotation = 0

  // Reset all weights to ensure they're properly hidden/shown
  resetWeightsPosition()

  // Redraw everything
  drawSetup()
}

function toggleTable() {
  const tableContainer = document.getElementById("tableContainer")
  tableContainer.style.display = tableContainer.style.display === "none" ? "block" : "none"
}

// IMPROVED: Toggle simulation with proper torque calculation
function toggleSimulation() {
  simulationRunning = !simulationRunning

  if (simulationRunning) {
    // Start with fresh calculation
    scaleRotation = 0
    calculateTorque()
  } else {
    // Reset rotation
    scaleRotation = 0

    // Reset scale position
    resetScalePosition()
  }

  drawSetup()
}

// Update the resetExperiment function to also reset draggable weights
function resetExperiment() {
  // Reset all variables
  mass = 0
  springConstant = 0.5
  gravity = 9.8
  currentWeight = 0
  indicatorOffset = 0
  springExtension = 0
  showSpringBalances = false
  isDraggingScale = false
  scaleOffsetX = 0
  isScaleBalanced = true
  scaleRotation = 0
  simulationRunning = false
  showAllForces = false
  showWeightForce = false
  positionMode = "none"
  springBalancesVisible = false
  wedgeVisible = true

  // Reset UI elements
  const massSlider = document.getElementById("massSlider")
  if (massSlider) {
    massSlider.value = mass
    document.getElementById("massValue").textContent = `${mass} g`
  }

  const springSlider = document.getElementById("springSlider")
  if (springSlider) {
    springSlider.value = springConstant
    document.getElementById("springValue").textContent = springConstant
  }

  const gravityInput = document.getElementById("gravity")
  if (gravityInput) {
    gravityInput.value = gravity
    document.getElementById("gravity-value").innerText = `${gravity} m/s²`
  }

  const showAllForcesCheckbox = document.getElementById("showAllForces")
  if (showAllForcesCheckbox) showAllForcesCheckbox.checked = false

  const showWeightForceCheckbox = document.getElementById("showWeightForce")
  if (showWeightForceCheckbox) showWeightForceCheckbox.checked = false

  const noDisplayScaleRadio = document.getElementById("NoDisplayScale")
  if (noDisplayScaleRadio) noDisplayScaleRadio.checked = true

  const rulersRadio = document.getElementById("Rulers")
  if (rulersRadio) rulersRadio.checked = false

  // Reset positions
  resetScalePosition()

  // Reset draggable weights
  initializeWeights()

  // Reset hanging weight
  selectedWeightData = {
    weight: 0,
    width: 0,
    height: 0,
    color: "",
    isHanging: false,
  }

  drawSetup()
}

// ============================== Mouse Event Handlers ==============================

function handleMouseDown(e) {
  // If meter rod is visible, ignore mouse events for simulation and weights
  if (meterRodVisible) {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top

    // Only allow interactions with the meter rod icon to toggle back
    const meterRodIconRect = document.getElementById("meterRodIcon").getBoundingClientRect()
    const meterRodIconX = meterRodIconRect.left - rect.left
    const meterRodIconY = meterRodIconRect.top - rect.top
    const meterRodIconWidth = meterRodIconRect.width
    const meterRodIconHeight = meterRodIconRect.height

    if (
      mouseX >= meterRodIconX &&
      mouseX <= meterRodIconX + meterRodIconWidth &&
      mouseY >= meterRodIconY &&
      mouseY <= meterRodIconY + meterRodIconHeight
    ) {
      toggleSpringBalances()
    }

    return // Ignore all other mouse events
  }

  const rect = canvas.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top

  // Check if clicking on the toggle switch
  if (isClickOnToggle(mouseX, mouseY)) {
    toggleSimulation()
    return
  }

  // Check if clicking on the wedge icon
  const wedgeIconRect = document.getElementById("wedgeIcon").getBoundingClientRect()
  const wedgeIconX = wedgeIconRect.left - rect.left
  const wedgeIconY = wedgeIconRect.top - rect.top
  const wedgeIconWidth = wedgeIconRect.width
  const wedgeIconHeight = wedgeIconRect.height

  if (
    mouseX >= wedgeIconX &&
    mouseX <= wedgeIconX + wedgeIconWidth &&
    mouseY >= wedgeIconY &&
    mouseY <= wedgeIconY + wedgeIconHeight
  ) {
    toggleWedge()
    return
  }

  // Check if clicking on the meter rod icon
  const meterRodIconRect = document.getElementById("meterRodIcon").getBoundingClientRect()
  const meterRodIconX = meterRodIconRect.left - rect.left
  const meterRodIconY = meterRodIconRect.top - rect.top
  const meterRodIconWidth = meterRodIconRect.width
  const meterRodIconHeight = meterRodIconRect.height

  if (
    mouseX >= meterRodIconX &&
    mouseX <= meterRodIconX + meterRodIconWidth &&
    mouseY >= meterRodIconY &&
    mouseY <= meterRodIconY + meterRodIconHeight
  ) {
    toggleSpringBalances()
    return
  }

  // Check if clicking on a weight on the scale
  for (let i = 0; i < draggableWeights.length; i++) {
    const weight = draggableWeights[i]
    if (weight.onScale) {
      const weightX = weight.scalePosition
      const weightY = scaleY - weight.height / 2

      if (
        mouseX >= weightX - weight.width / 2 &&
        mouseX <= weightX + weight.width / 2 &&
        mouseY >= weightY - weight.height / 2 &&
        mouseY <= weightY + weight.height / 2
      ) {
        currentDraggedWeight = weight
        dragStartX = e.clientX
        dragStartY = e.clientY
        weight.isDragging = true

        // Store that it was on the scale
        weight.wasOnScale = true
        weight.previousScalePosition = weight.scalePosition

        // Temporarily remove from scale during drag
        weight.onScale = false

        return
      }
    }
  }

  // Check if clicking on a weight not on the scale
  if (isClickOnWeight(mouseX, mouseY)) {
    currentDraggedWeight = draggableWeights[draggedWeightIndex]
    dragStartX = e.clientX
    dragStartY = e.clientY
    currentDraggedWeight.isDragging = true
    return
  }

  // Check if clicking on the scale - only allow dragging if not connected to meter rods
  if (isClickOnScale(mouseX, mouseY) && !springBalancesVisible) {
    isDraggingScale = true
    return
  }

  // Check if clicking on a spring balance
  if (springBalancesVisible && isClickOnSpringBalance(mouseX, mouseY)) {
    return
  }
}

function handleMouseMove(e) {
  const rect = canvas.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top

  // Handle dragging a weight
  if (currentDraggedWeight && currentDraggedWeight.isDragging) {
    currentDraggedWeight.x = mouseX
    currentDraggedWeight.y = mouseY
    drawSetup()
  }
}

function handleMouseUp(e) {
  // Handle dropping a dragged weight
  if (currentDraggedWeight && currentDraggedWeight.isDragging) {
    // Check if dropped on scale
    if (
      mouseY >= scaleY - 50 &&
      mouseY <= scaleY + meterRodHeight + 50 &&
      mouseX >= scaleX &&
      mouseX <= scaleX + meterRodLength
    ) {
      // Place on scale
      currentDraggedWeight.onScale = true

      // Calculate position on scale - limit to scale boundaries
      currentDraggedWeight.scalePosition = Math.max(scaleX, Math.min(scaleX + meterRodLength, mouseX))

      // If simulation is running, recalculate torque
      if (simulationRunning) {
        calculateTorque()
      }
    } else {
      // Not dropped on scale, reset to container position
      currentDraggedWeight.onScale = false

      // Find its index to position it properly in the container area
      const index = draggableWeights.findIndex((w) => w.id === currentDraggedWeight.id)
      if (index !== -1) {
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        const weightSpacing = canvasWidth * config.weightSpacingPercentage * 3
        const startX = canvasWidth * config.weightStartXPercentage
        const startY = canvasHeight * config.weightStartYPercentage

        currentDraggedWeight.x = startX + index * weightSpacing
        currentDraggedWeight.y = startY
      }
    }

    // Reset dragging state
    currentDraggedWeight.isDragging = false
    currentDraggedWeight = null
  }

  // Reset other dragging states
  isDraggingSpringBalance = false
  isDraggingScale = false
  draggedSpringBalance = ""
  draggedWeightIndex = -1

  drawSetup()
}

function handleTouchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const rect = canvas.getBoundingClientRect()
  const touchX = touch.clientX - rect.left
  const touchY = touch.clientY - rect.top

  // Convert touch to mouse event
  const mouseEvent = {
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => {},
  }

  handleMouseDown(mouseEvent)
}

function handleTouchMove(e) {
  e.preventDefault()
  const touch = e.touches[0]

  // Convert touch to mouse event
  const mouseEvent = {
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => {},
  }

  handleMouseMove(mouseEvent)
}

function handleTouchEnd(e) {
  e.preventDefault()

  // Convert touch to mouse event
  const mouseEvent = {
    clientX: e.changedTouches[0].clientX,
    clientY: e.changedTouches[0].clientY,
    preventDefault: () => {},
  }

  handleMouseUp(mouseEvent)
}

// ============================== Physics Calculations ==============================

function calculateTorque() {
  let totalTorque = 0
  const g = 9.8 // Acceleration due to gravity
  const centerX = fixedGPoint.x // Center point for torque calculation

  // First, check if we have weights on the scale
  const leftWeights = []
  const rightWeights = []

  // Collect weights on each side
  draggableWeights.forEach((weight) => {
    if (weight.onScale) {
      if (weight.scalePosition < centerX) {
        leftWeights.push(weight)
      } else if (weight.scalePosition > centerX) {
        rightWeights.push(weight)
      }
      // Weights exactly at center contribute no torque
    }
  })

  // Calculate torques for each side
  let leftTorque = 0
  let rightTorque = 0

  // Add base weight torque (15g on each side at fixed positions)
  // Convert grams to kg for calculation
  const baseWeightKg = scaleBaseWeight / 1000

  // Left base weight at 25% of the rod length
  const leftBaseDistance = (centerX - (scaleX + meterRodLength * 0.25)) / (meterRodLength / 4)
  leftTorque += baseWeightKg * g * leftBaseDistance

  // Right base weight at 75% of the rod length
  const rightBaseDistance = (scaleX + meterRodLength * 0.75 - centerX) / (meterRodLength / 4)
  rightTorque += baseWeightKg * g * rightBaseDistance

  // Calculate left side torque from added weights
  leftWeights.forEach((weight) => {
    // Calculate distance from center in meters (convert pixels to meters)
    // Assuming 1 meter = meterRodLength/4 pixels (since the scale is 4 meters total)
    const distanceInPixels = centerX - weight.scalePosition
    const distanceInMeters = distanceInPixels / (meterRodLength / 4)

    // Calculate torque: mass * g * distance
    const torque = weight.mass * g * distanceInMeters
    leftTorque += torque
  })

  // Calculate right side torque from added weights
  rightWeights.forEach((weight) => {
    // Calculate distance from center in meters
    const distanceInPixels = weight.scalePosition - centerX
    const distanceInMeters = distanceInPixels / (meterRodLength / 4)

    // Calculate torque: mass * g * distance
    const torque = weight.mass * g * distanceInMeters
    rightTorque += torque
  })

  // Total torque (positive = clockwise, negative = counterclockwise)
  totalTorque = rightTorque - leftTorque

  // Check if the torques are balanced within a small threshold
  const torqueDifference = Math.abs(rightTorque - leftTorque)
  const balanceThreshold = 0.5 // Small threshold to account for pixel precision

  if (torqueDifference < balanceThreshold) {
    scaleRotation = 0
    return
  }

  // Calculate the angle of rotation based on the total torque
  const momentOfInertia = 10 // Increased for more stability
  const angularAcceleration = totalTorque / momentOfInertia
  const deltaTime = 0.02 // Time step

  // Apply a smaller change to rotation for more stability
  scaleRotation += angularAcceleration * deltaTime

  // Apply stronger damping to reduce oscillation
  const dampingFactor = 0.1 // Increased damping
  scaleRotation *= 1 - dampingFactor

  // Limit the rotation angle
  const maxRotation = 0.1
  scaleRotation = Math.max(-maxRotation, Math.min(maxRotation, scaleRotation))

  // If rotation is very small, just set it to zero
  if (Math.abs(scaleRotation) < 0.001) {
    scaleRotation = 0
  }
}

// ============================== Main Drawing Function ==============================

function drawSetup() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBackground()

  if (simulationRunning) {
    calculateTorque()
  }

  if (scaleVisible) {
    if (springBalancesVisible) {
      drawWithoutWedge()
      if (selectedWeightData.isHanging && selectedWeightData.weight > 0) {
        drawWeight(hookX, hookY)
      }
    } else {
      if (wedgeVisible) {
        drawWithWedge()
      } else {
        drawScale(scaleX, scaleY, scaleRotation)
      }
    }
  }

  // Draw all draggable weights
  if (!meterRodVisible) {
    drawDraggableWeights()
  }

  // Draw toggle switch if not in meter rod mode
  if (!meterRodVisible) {
    drawToggleSwitch()
  }
}

// ========================== Initialization and Event Listener Setup ==========================

function setupEventListeners() {
  // Canvas click for toggle switch
  canvas.addEventListener("click", handleCanvasClick)

  // Weight buttons
  const weight1 = document.getElementById("weight1")
  if (weight1) weight1.addEventListener("click", handleWeightClick)

  const weight2 = document.getElementById("weight2")
  if (weight2) weight2.addEventListener("click", handleWeightClick)

  const weight3 = document.getElementById("weight3")
  if (weight3) weight3.addEventListener("click", handleWeightClick)

  const weight4 = document.getElementById("weight4")
  if (weight4) weight4.addEventListener("click", handleWeightClick)

  // Sliders
  const massSlider = document.getElementById("massSlider")
  if (massSlider) massSlider.addEventListener("input", updateWeightFromSlider)

  const springSlider = document.getElementById("springSlider")
  if (springSlider) springSlider.addEventListener("input", updateSpringConstant)

  // Arrow buttons
  const massDecrease = document.getElementById("mass-decrease")
  if (massDecrease) massDecrease.addEventListener("click", decreaseMass)

  const massIncrease = document.getElementById("mass-increase")
  if (massIncrease) massIncrease.addEventListener("click", increaseMass)

  const springDecrease = document.getElementById("spring-decrease")
  if (springDecrease) springDecrease.addEventListener("click", decreaseSpringConstant)

  const springIncrease = document.getElementById("spring-increase")
  if (springIncrease) springIncrease.addEventListener("click", increaseSpringConstant)

  // Checkboxes and radio buttons
  const showAllForcesCheckbox = document.getElementById("showAllForces")
  if (showAllForcesCheckbox) showAllForcesCheckbox.addEventListener("change", toggleShowAllForces)

  const showWeightForceCheckbox = document.getElementById("showWeightForce")
  if (showWeightForceCheckbox) showWeightForceCheckbox.addEventListener("change", toggleShowWeightForce)

  const noDisplayScaleRadio = document.getElementById("NoDisplayScale")
  if (noDisplayScaleRadio) noDisplayScaleRadio.addEventListener("change", toggleNoDisplayScale)

  const rulersRadio = document.getElementById("Rulers")
  if (rulersRadio) rulersRadio.addEventListener("change", toggleRulers)

  // Gravity controls
  const gravityBtn = document.getElementById("gravityBtn")
  if (gravityBtn) gravityBtn.addEventListener("click", toggleGravityControls)

  const gravityInput = document.getElementById("gravity")
  if (gravityInput) gravityInput.addEventListener("input", updateGravity)

  const gravityIncrease = document.getElementById("gravity-increase")
  if (gravityIncrease) gravityIncrease.addEventListener("click", increaseGravity)

  const gravityDecrease = document.getElementById("gravity-decrease")
  if (gravityDecrease) gravityDecrease.addEventListener("click", decreaseGravity)

  const gravitySelect = document.getElementById("gravitySelect")
  if (gravitySelect) gravitySelect.addEventListener("change", selectGravity)

  // Other controls
  const resetBtn = document.getElementById("resetBtn")
  if (resetBtn) resetBtn.addEventListener("click", resetExperiment)

  const wedgeIcon = document.getElementById("wedgeIcon")
  if (wedgeIcon) wedgeIcon.addEventListener("click", toggleWedge)

  const meterRodIcon = document.getElementById("meterRodIcon")
  if (meterRodIcon) meterRodIcon.addEventListener("click", toggleSpringBalances)

  const addValuesBtn = document.getElementById("addValuesBtn")
  if (addValuesBtn) addValuesBtn.addEventListener("click", toggleTable)

  // Window events
  window.addEventListener("resize", handleResize)

  const showMassLabelsCheckbox = document.getElementById("showMassLabels")
  if (showMassLabelsCheckbox) {
    showMassLabelsCheckbox.addEventListener("change", function () {
      showMassLabels = this.checked
      drawSetup()
    })
  }

  // Canvas interactions
  canvas.addEventListener("mousedown", handleMouseDown)
  canvas.addEventListener("mousemove", handleMouseMove)
  canvas.addEventListener("mouseup", handleMouseUp)
  canvas.addEventListener("mouseleave", handleMouseUp)

  // Touch events
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
  canvas.addEventListener("touchend", handleTouchEnd, { passive: false })
}

function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (isClickOnToggle(x, y)) {
    toggleSimulation()
    return // Stop further processing
  }

  // Handle other canvas clicks if needed
}

function handleResize() {
  resizeCanvas()
  initializeSizes()
  initializePositions()
  drawSetup()
}

// Handle weight click function
function handleWeightClick(event) {
  const weightId = event.target.id
  let weightValue = 0
  let weightWidth = 0
  let weightHeight = 0
  let weightColor = ""

  switch (weightId) {
    case "weight1":
      weightValue = 100
      weightWidth = 45
      weightHeight = 25
      weightColor = "#77b5fe"
      break
    case "weight2":
      weightValue = 300
      weightWidth = 50
      weightHeight = 70
      weightColor = "hsla(203, 66%, 52%, 0.669)"
      break
    case "weight3":
      weightValue = 200
      weightWidth = 45
      weightHeight = 55
      weightColor = "#40acd7"
      break
    case "weight4":
      weightValue = 500
      weightWidth = 55
      weightHeight = 100
      weightColor = "#6488e4"
      break
  }

  selectedWeightData = {
    weight: weightValue,
    width: weightWidth,
    height: weightHeight,
    color: weightColor,
    isHanging: true,
  }

  drawSetup()
}



// Fix the invalid use before declaration error for typeof anime
// Define anime if it's not available
if (typeof anime === "undefined") {
  var anime = (params) => {
    // Simple animation fallback
    const obj = params.targets
    obj[params.springExtension] = params.springExtension
    if (params.update) params.update()
    return {
      pause: () => {},
    }
  }
}

// Modify the initialize function to set initial UI visibility
function initialize() {
  canvas = document.getElementById("simulationCanvas")
  if (!canvas) {
    console.error("Canvas element not found")
    return
  }

  ctx = canvas.getContext("2d")

  // Initialize weights
  initializeWeights()

  // Initialize sizes and positions
  resizeCanvas()

  // Set up event listeners
  setupEventListeners()

  // Set initial UI visibility
  meterRodVisible = springBalancesVisible

  // Start animation loop
  requestAnimationFrame(animate)
}

// Animation loop
function animate() {
  drawSetup()
  requestAnimationFrame(animate)
}

// Function to initialize the canvas
function initializeCanvas() {
  canvas = document.getElementById("simulationCanvas")
  resizeCanvas()
  ctx = canvas.getContext("2d")

  initializeSizes()
  initializePositions()
  setupEventListeners()
  drawSetup()
}

// Function to reset weight position
function resetWeightPosition(element) {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const weightSpacing = canvasWidth * config.weightSpacingPercentage
  const startX = canvasWidth * config.weightStartXPercentage
  const startY = canvasHeight * config.weightStartYPercentage
  const index = Array.from(element.parentNode.children).indexOf(element)

  element.style.left = startX + index * weightSpacing + "px"
  element.style.top = startY + "px"
  element.style.position = ""
  element.style.transform = ""
  element.dataset.onScale = "false"
  element.dataset.scalePosition = "0"
}

function checkForDuplicateWeights() {
  const allWeights = document.querySelectorAll(".draggable-weight")
  const ids = new Set()

  allWeights.forEach((weight) => {
    if (ids.has(weight.id)) {
      console.error(`Duplicate weight found: ${weight.id}`)
    }
    ids.add(weight.id)
  })

  console.log(`Total weights: ${allWeights.length}, Unique IDs: ${ids.size}`)
}

// Initialize on page load
window.onload = initialize
