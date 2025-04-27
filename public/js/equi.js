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

const draggableWeights = [
  {
    id: "extinguisher1",
    type: "extinguisher",
    mass: 5,
    width: 48, // Match your CSS width (3rem = ~48px)
    height: 96, // Match your CSS height (6rem = ~112px)
    color: "red",
    onScale: false,
    scalePosition: 0,
    element: null,
  },
  {
    id: "extinguisher2",
    type: "extinguisher",
    mass: 5,
    width: 48,
    height: 96,
    color: "red",
    onScale: false,
    scalePosition: 0,
    element: null,
  },
  {
    id: "trashcan1",
    type: "trashcan",
    mass: 10,
    width: 64, // Match your CSS width (4rem = ~64px)
    height: 112, // Match your CSS height (7rem = ~112px)
    color: "#888888",
    onScale: false,
    scalePosition: 0,
    element: null,
  },
]

// Global variables for dragging
let currentDraggedWeight = null
let dragStartX = 0
let dragStartY = 0
let elementStartX = 0
let elementStartY = 0

// Dragging state
let isDraggingWeight = false
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
let drawScaleMarkings
let drawExtinguisher
let drawTrashCanFn
let resetScalePositionFn
let drawSetup // Declare drawSetup
let calculateTorque
let handleWeightClick


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

function isClickOnWeight(index, x, y) {
  const weight = draggableWeights[index]
  return (
    x >= weight.x - weight.width / 2 &&
    x <= weight.x + weight.width / 2 &&
    y >= weight.y - weight.height &&
    y <= weight.y
  )
}

function isMouseOnScale(x, y) {
  // Convert to canvas coordinates
  const canvasRect = canvas.getBoundingClientRect()
  const canvasX = x - canvasRect.left
  const canvasY = y - canvasRect.top

  // Check if coordinates are within scale bounds
  return (
    canvasX >= scaleX && canvasX <= scaleX + meterRodLength && canvasY >= scaleY && canvasY <= scaleY + meterRodHeight
  )
}

// ============================== Initialization Functions ==============================

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
  draggableWeights.forEach((weight) => {
    weight.width = baseSize * 2
    weight.height = baseSize * 3.5
  })
}

function initializePositions() {
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // Meter rod centered horizontally, 60% down
  scaleX = canvasWidth * config.scaleXPercentage - meterRodLength / 2 // shift by half the length for centering
  scaleY = canvasHeight * config.scaleYPercentage

  // FIXED: Ensure the fixed G point is exactly at the center of the scale
  fixedGPoint = {
    x: scaleX + meterRodLength / 2, // Exact center of the scale
    y: scaleY + meterRodHeight / 2,
  }

  // Wedge position (centered under the meter rod)
  wedgeFixedX = canvasWidth * 0.5 - wedgeBase / 2 // centered
  wedgeFixedY = scaleY + meterRodHeight

  // Spring balance attachment points
  attachPointA = {
    x: canvasWidth * 0.3,
    y: canvasHeight * config.springBalanceYPercentage,
  } // 30% from left, 10% from top
  attachPointB = {
    x: canvasWidth * 0.7,
    y: canvasHeight * config.springBalanceYPercentage,
  } // 70% from left, 10% from top

  // Draggable weights initial positions (bottom right)
  const weightSpacing = canvasWidth * config.weightSpacingPercentage // 5% spacing
  const startX = canvasWidth * config.weightStartXPercentage // 80% from left
  const startY = canvasHeight * config.weightStartYPercentage // 85% from top

  weights.forEach((weight, index) => {
    const element = document.getElementById(weight.id)
    if (element) {
      element.style.left = `${startX + index * weightSpacing}px`
      element.style.top = `${startY}px`
    }
  })

  draggableWeights[0].x = startX
  draggableWeights[0].y = startY
  draggableWeights[1].x = startX + weightSpacing
  draggableWeights[1].y = startY
  draggableWeights[2].x = startX + 2 * weightSpacing
  draggableWeights[2].y = startY

  springTopX = canvasWidth * config.springTopXPercentage
  springTopY = canvasHeight * config.springTopYPercentage

  hookX = canvasWidth / 2 // Centered
  hookY = scaleY + meterRodHeight
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

  const weightSpacing = canvasWidth * config.weightSpacingPercentage // 5% spacing
  const startX = canvasWidth * config.weightStartXPercentage // 80% from left
  const startY = canvasHeight * config.weightStartYPercentage // 85% from top

  draggableWeights[0].x = startX
  draggableWeights[0].y = startY
  draggableWeights[1].x = startX + weightSpacing
  draggableWeights[1].y = startY
  draggableWeights[2].x = startX + 2 * weightSpacing
  draggableWeights[2].y = startY

  draggableWeights.forEach((weight) => (weight.onScale = false))

  // Reset HTML weights
  const weightElements = document.querySelectorAll(".weight")
  weightElements.forEach((element) => {
    resetWeightPosition(element)
    element.style.position = ""
    element.style.left = ""
    element.style.top = ""
    element.style.transform = ""
    element.dataset.onScale = "false"
    element.dataset.scalePosition = "0"
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

  // Draw scale markings if rulers are enabled
  if (positionMode === "rulers") {
    drawScaleMarkingsFn(x, y)
  }

  // Draw the G point indicator only if showGPoint is true
  if (showGPoint) {
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

function drawScaleMarkingsFn(x, y) {
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

// Fix 2: Modify drawWeightsOnScale to ensure force arrows are always visible
function drawWeightsOnScale() {
  ctx.save()

  // Only apply rotation if simulation is running
  if (simulationRunning) {
    ctx.translate(fixedGPoint.x, fixedGPoint.y)
    ctx.rotate(scaleRotation)
    ctx.translate(-fixedGPoint.x, -fixedGPoint.y)
  }

  for (const weight of draggableWeights) {
    if (weight.onScale && !weight.isDragging) {
      // Calculate position on the scale
      const x = weight.scalePosition
      const y = scaleY

      // Draw the appropriate weight type
      if (weight.type === "extinguisher") {
        drawExtinguisherFn(x, y, weight.width, weight.height, weight.mass)
      } else if (weight.type === "trashcan") {
        drawTrashCanWeightFn(x, y, weight.width, weight.height, weight.mass)
      }
    }
  }

  ctx.restore()

  // CRITICAL: Draw force arrows AFTER restoring context to ensure they're not rotated
  if (showAllForces) {
    for (const weight of draggableWeights) {
      if (weight.onScale && !weight.isDragging) {
        const force = weight.mass * gravity
        // Draw force arrow with original coordinates
        drawForceArrow(weight.scalePosition, scaleY - weight.height / 2, "down", `${force.toFixed(1)}N`)
      }
    }
  }
}

// Modify the drawToggleSwitch function to not draw when meter rod is visible
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
      drawSetupFn()
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
    update: drawSetupFn,
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
  drawSetupFn()
}

// Modify the updateSpringConstant function to update the weight display scale
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
  drawSetupFn() // Redraw to update displayed weights
}

function updateGravity(event) {
  const newGravity = Number.parseFloat(event.target.value)
  gravity = newGravity
  document.getElementById("gravity-value").innerText = `${newGravity} m/s²`
  updateSpringExtension()
  updateIndicatorOffset()
  drawSetupFn()
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
  drawSetupFn()
}

function toggleShowWeightForce(event) {
  showWeightForce = event.target.checked
  drawSetupFn()
}

function toggleNoDisplayScale(event) {
  if (event.target.checked) {
    positionMode = "none"
    drawSetupFn()
  }
}

function toggleRulers(event) {
  if (event.target.checked) {
    positionMode = "rulers"
    drawSetupFn()
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
  alert("Wedge button clicked!")
  wedgeVisible = !wedgeVisible
  console.log("Wedge visibility:", wedgeVisible)
  drawSetupFn()
}

// Modify the toggleSpringBalances function to update the meterRodVisible flag
function toggleSpringBalances() {
  springBalancesVisible = !springBalancesVisible
  console.log("Spring balances toggled:", springBalancesVisible)

  // Update meter rod visibility flag
  meterRodVisible = springBalancesVisible

  // Update UI elements visibility based on meter rod visibility
  updateUIVisibility()

  // Get the static weights container
  const staticWeightsContainer = document.getElementById("static-weights-container")

  if (springBalancesVisible) {
    // When spring balances are visible, show static weights
    if (staticWeightsContainer) {
      staticWeightsContainer.style.display = "flex"
    }

    // Reset weights that were on the scale to their initial positions
    draggableWeights.forEach((weight) => {
      if (weight.onScale && weight.element) {
        weight.onScale = false
        weight.element.dataset.onScale = "false"

        // Reset to initial position
        const container = document.getElementById("draggable-weights-container")
        if (container) {
          const index = draggableWeights.findIndex((w) => w.id === weight.id)
          const spacing = 20

          // Reset position to container
          weight.element.style.position = "static"
          weight.element.style.display = "none" // Hide the weights
          weight.element.style.visibility = "hidden"
          weight.element.style.opacity = "0"
          weight.element.style.transform = "none"
          weight.element.style.left = ""
          weight.element.style.top = ""

          // Reset the weight's position in the array
          if (index >= 0) {
            draggableWeights[index].x = container.offsetLeft + index * (weight.width + spacing)
            draggableWeights[index].y = container.offsetTop
          }
        }
      }
    })

    // Center the hook on the meter rod when spring balances are visible
    hookX = scaleX + meterRodLength / 2
    hookY = scaleY + meterRodHeight
  } else {
    // When spring balances are not visible, hide static weights
    if (staticWeightsContainer) {
      staticWeightsContainer.style.display = "none"
    }

    // Reset the hanging weight
    selectedWeightData.isHanging = false
  }

  // Reset rotation
  scaleRotation = 0

  // Update draggable weights visibility
  updateDraggableWeightsVisibility()

  // Force a reset of all weights to ensure they're properly hidden/shown
  resetDraggableWeights()

  // Redraw everything
  drawSetupFn()
}

// Add a new function to update UI visibility based on meter rod visibility
function updateUIVisibility() {
  const simulationToggleContainer = document.getElementById("simulation-toggle-container")
  const draggableWeightsContainer = document.getElementById("draggable-weights-container")

  if (meterRodVisible) {
    // Hide simulation button when meter rod is visible
    if (simulationToggleContainer) {
      simulationToggleContainer.style.display = "none"
    }

    // Hide draggable weights when meter rod is visible
    if (draggableWeightsContainer) {
      draggableWeightsContainer.style.display = "none"
    }
  } else {
    // Show simulation button when meter rod is not visible
    if (simulationToggleContainer) {
      simulationToggleContainer.style.display = "flex"
    }

    // Show draggable weights when meter rod is not visible
    if (draggableWeightsContainer) {
      draggableWeightsContainer.style.display = "flex"
    }
  }
}

// Update the updateDraggableWeightsVisibility function to properly hide weights
function updateDraggableWeightsVisibility() {
  const draggableWeightsContainer = document.getElementById("draggable-weights-container")
  if (draggableWeightsContainer) {
    if (meterRodVisible) {
      // Hide weights container when meter rod is visible
      draggableWeightsContainer.style.display = "none"
      draggableWeightsContainer.style.visibility = "hidden"
      draggableWeightsContainer.style.opacity = "0"

      // Make sure all weight elements are hidden
      const weightElements = document.querySelectorAll(".draggable-weight")
      weightElements.forEach((element) => {
        element.style.display = "none"
        element.style.visibility = "hidden"
        element.style.opacity = "0"
      })
    } else {
      // Show weights container when meter rod is not visible
      draggableWeightsContainer.style.display = "flex"
      draggableWeightsContainer.style.visibility = "visible"
      draggableWeightsContainer.style.opacity = "1"

      // Make sure all weight elements are visible
      const weightElements = document.querySelectorAll(".draggable-weight")
      weightElements.forEach((element) => {
        if (!element.dataset.onScale || element.dataset.onScale === "false") {
          element.style.display = "block"
          element.style.visibility = "visible"
          element.style.opacity = "1"
        }
      })
    }
  }
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

    // Reset weight positions on scale
    const canvasRect = canvas.getBoundingClientRect()
    const weightsOnScale = document.querySelectorAll('.weight[data-on-scale="true"]')

    weightsOnScale.forEach((weight) => {
      const rect = weight.getBoundingClientRect()
      const scalePosition = Number.parseFloat(weight.dataset.scalePosition || 0)

      if (isNaN(scalePosition)) return

      // Position without rotation
      weight.style.left = `${scaleX + scalePosition - rect.width / 2 + canvasRect.left}px`
      weight.style.top = `${scaleY - rect.height + canvasRect.top}px`
      weight.style.transform = ""
    })

    // Reset draggable weights
    draggableWeights.forEach((weight) => {
      if (weight.onScale && weight.element) {
        const rect = weight.element.getBoundingClientRect()

        // Position without rotation
        weight.element.style.left = `${scaleX + weight.scalePosition - rect.width / 2 + canvasRect.left}px`
        weight.element.style.top = `${scaleY - rect.height + canvasRect.top}px`
        weight.element.style.transform = ""
      }
    })
  }

  drawSetupFn()
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

  // Reset all weights
  const weightElements = document.querySelectorAll(".weight")
  weightElements.forEach((element) => {
    resetWeightPosition(element)
  })

  // Reset draggable weights
  resetDraggableWeights()

  // Reset hanging weight
  selectedWeightData = {
    weight: 0,
    width: 0,
    height: 0,
    color: "",
    isHanging: false,
  }

  // Show draggable weights container
  const weightsContainer = document.getElementById("draggable-weights-container")
  if (weightsContainer) {
    weightsContainer.style.display = "flex"
  }

  drawSetupFn()
}

// Fix 5: Improve resetDraggableWeights to ensure weights are properly reset and visible
function resetDraggableWeights() {
  const container = document.getElementById("draggable-weights-container")
  if (!container) return

  console.log("Resetting draggable weights")

  // Set container visibility based on meter rod visibility
  if (meterRodVisible) {
    container.style.display = "none"
    container.style.visibility = "hidden"
    container.style.opacity = "0"
  } else {
    container.style.display = "flex"
    container.style.visibility = "visible"
    container.style.opacity = "1"
  }

  // Reset all weights
  draggableWeights.forEach((weight, index) => {
    if (weight.element) {
      // Reset position
      const spacing = 20
      weight.element.style.position = "static"
      weight.element.style.left = ""
      weight.element.style.top = ""
      weight.element.style.transform = ""
      weight.element.style.zIndex = ""
      weight.element.classList.remove("dragging")

      // Set visibility based on meter rod visibility
      if (meterRodVisible) {
        weight.element.style.display = "none"
        weight.element.style.visibility = "hidden"
        weight.element.style.opacity = "0"
      } else {
        weight.element.style.display = "block"
        weight.element.style.visibility = "visible"
        weight.element.style.opacity = "1"
      }

      // Reset state
      weight.onScale = false
      weight.element.dataset.onScale = "false"
      weight.scalePosition = 0

      // Reset position in the array
      weight.x = container.offsetLeft + index * (weight.width + spacing)
      weight.y = container.offsetTop
    }
  })

  // Force redraw
  drawSetupFn()
}

function handleWeightMouseDown(e) {
  e.preventDefault()
  const weightElement = e.currentTarget
  const weightId = weightElement.id
  const weightIndex = draggableWeights.findIndex((w) => w.id === weightId)

  if (weightIndex >= 0) {
    currentDraggedWeight = draggableWeights[weightIndex]
    dragStartX = e.clientX
    dragStartY = e.clientY

    // Store initial position
    const rect = weightElement.getBoundingClientRect()
    elementStartX = rect.left
    elementStartY = rect.top

    // Set dragging state
    weightElement.classList.add("dragging")
    weightElement.style.zIndex = "1000"

    // Store original position if it was on scale
    currentDraggedWeight.wasOnScale = currentDraggedWeight.onScale
    currentDraggedWeight.isDragging = true

    // If it was on scale, remove from scale temporarily
    if (currentDraggedWeight.onScale) {
      currentDraggedWeight.onScale = false
      weightElement.dataset.onScale = "false"
    }
  }
}
// Function to handle weight touch start event
function handleWeightTouchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const weightElement = e.currentTarget
  const weightId = weightElement.id
  const weightIndex = draggableWeights.findIndex((w) => w.id === weightId)

  if (weightIndex >= 0) {
    currentDraggedWeight = draggableWeights[weightIndex]
    dragStartX = touch.clientX
    dragStartY = touch.clientY

    const rect = weightElement.getBoundingClientRect()
    elementStartX = rect.left
    elementStartY = rect.top

    // Set dragging visual state
    weightElement.classList.add("dragging")
    weightElement.style.zIndex = "1000"

    // Store whether the weight was on the scale before dragging
    currentDraggedWeight.wasOnScale = currentDraggedWeight.onScale
    currentDraggedWeight.previousScalePosition = currentDraggedWeight.scalePosition

    // Mark as being dragged but don't remove from scale yet
    currentDraggedWeight.isDragging = true
  }
}

// Fix 1: Modify the handleWeightMouseMove function to ensure weights remain visible during dragging
function handleWeightMouseMove(e) {
  if (!currentDraggedWeight || !currentDraggedWeight.element) return

  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY

  // Update element position
  currentDraggedWeight.element.style.position = "fixed"
  currentDraggedWeight.element.style.left = `${elementStartX + dx}px`
  currentDraggedWeight.element.style.top = `${elementStartY + dy}px`
  currentDraggedWeight.element.style.transform = "none" // Remove any transforms
}
function handleWeightTouchMove(e) {
  if (!currentDraggedWeight || !currentDraggedWeight.element) return
  e.preventDefault()

  const touch = e.touches[0]
  const dx = touch.clientX - dragStartX
  const dy = touch.clientY - dragStartY

  // Update element position
  currentDraggedWeight.element.style.position = "fixed"
  currentDraggedWeight.element.style.left = `${elementStartX + dx}px`
  currentDraggedWeight.element.style.top = `${elementStartY + dy}px`
  currentDraggedWeight.element.style.transform = "" // Remove rotation when dragging
  currentDraggedWeight.element.style.display = "block" // CRITICAL: Ensure visibility during drag
  currentDraggedWeight.element.style.opacity = "1" // Ensure full opacity

  // Update weight object position
  currentDraggedWeight.x = touch.clientX
  currentDraggedWeight.y = touch.clientY

  // If the weight is being dragged and was on the scale, temporarily remove it from torque calculations
  // but don't make it invisible
  if (currentDraggedWeight.isDragging && currentDraggedWeight.onScale) {
    currentDraggedWeight.onScale = false
    currentDraggedWeight.element.dataset.onScale = "false"

    // Recalculate torque if simulation is running
    if (simulationRunning) {
      calculateTorque()
    }
  }

  // Force redraw to ensure the weight is visible
  drawSetupFn()
}

// Fix 4: Improve handleWeightMouseUp to ensure weights are always visible when returned to container
function handleWeightMouseUp(e) {
  if (!currentDraggedWeight || !currentDraggedWeight.element) return

  currentDraggedWeight.element.classList.remove("dragging")
  currentDraggedWeight.isDragging = false

  // Check if dropped on scale
  const canvasRect = canvas.getBoundingClientRect()
  const mouseX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX)
  const mouseY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY)

  // Convert to canvas coordinates
  const canvasX = mouseX - canvasRect.left
  const canvasY = mouseY - canvasRect.top

  // Improved detection for dropping on scale
  const scaleTop = scaleY - 50
  const scaleBottom = scaleY + meterRodHeight + 50
  const scaleLeft = scaleX
  const scaleRight = scaleX + meterRodLength

  if (canvasX >= scaleLeft && canvasX <= scaleRight && canvasY >= scaleTop && canvasY <= scaleBottom) {
    // Place on scale
    currentDraggedWeight.onScale = true

    // Calculate position on scale - limit to scale boundaries
    currentDraggedWeight.scalePosition = Math.max(scaleLeft, Math.min(scaleRight, canvasX))

    // Store the weight's mass for torque calculation
    currentDraggedWeight.element.dataset.mass = currentDraggedWeight.mass
    currentDraggedWeight.element.dataset.onScale = "true"
    currentDraggedWeight.element.dataset.scalePosition = currentDraggedWeight.scalePosition

    // Position element on scale, accounting for rotation if simulation is running
    const weightWidth = currentDraggedWeight.element.offsetWidth
    const weightHeight = currentDraggedWeight.element.offsetHeight

    if (simulationRunning && Math.abs(scaleRotation) > 0.001) {
      // Calculate rotated position
      const centerX = fixedGPoint.x
      const centerY = fixedGPoint.y
      const distanceFromCenter = currentDraggedWeight.scalePosition - centerX

      // Apply rotation to get new position
      const rotatedX = centerX + distanceFromCenter * Math.cos(scaleRotation)
      const rotatedY = centerY + distanceFromCenter * Math.sin(scaleRotation)

      // Update position with proper offset calculation
      currentDraggedWeight.element.style.position = "absolute"
      currentDraggedWeight.element.style.left = `${rotatedX - weightWidth / 2 + canvasRect.left}px`
      currentDraggedWeight.element.style.top = `${rotatedY - weightHeight + canvasRect.top}px`
      currentDraggedWeight.element.style.transform = `rotate(${scaleRotation}rad)`
    } else {
      // Position without rotation
      currentDraggedWeight.element.style.position = "absolute"
      currentDraggedWeight.element.style.left = `${canvasRect.left + currentDraggedWeight.scalePosition - weightWidth / 2}px`
      currentDraggedWeight.element.style.top = `${canvasRect.top + scaleY - weightHeight}px`
      currentDraggedWeight.element.style.transform = ""
    }

    if (simulationRunning) {
      calculateTorque()
    }
  } else {
    // CRITICAL FIX: Return to container with proper positioning and visibility
    const container = document.getElementById("draggable-weights-container")
    if (container) {
      // Find weight index for positioning
      const index = draggableWeights.findIndex((w) => w.id === currentDraggedWeight.id)
      const spacing = 20

      // Reset position to container
      currentDraggedWeight.element.style.position = "static" // Use static instead of relative
      currentDraggedWeight.element.style.display = "block"
      currentDraggedWeight.element.style.visibility = "visible"
      currentDraggedWeight.element.style.opacity = "1"
      currentDraggedWeight.element.style.transform = "none"

      // Reset the weight's state
      currentDraggedWeight.onScale = false
      currentDraggedWeight.element.dataset.onScale = "false"

      // Force redraw of the container
      container.style.display = "flex"

      // Reset the weight's position in the array
      draggableWeights[index].x = container.offsetLeft + index * (currentDraggedWeight.width + spacing)
      draggableWeights[index].y = container.offsetTop
    }
  }

  // Force redraw to ensure weights are visible
  drawSetupFn()

  currentDraggedWeight = null
}

// Function to set up draggable weights
function setupDraggableWeights() {
  console.log("Setting up draggable weights")

  // Get all draggable weight elements
  const weightElements = document.querySelectorAll(".draggable-weight")

  // Clear existing event listeners if any
  weightElements.forEach((element) => {
    element.removeEventListener("mousedown", handleWeightMouseDown)
    element.removeEventListener("touchstart", handleWeightTouchStart)
  })

  // Add event listeners to each weight
  weightElements.forEach((element) => {
    element.addEventListener("mousedown", handleWeightMouseDown)
    element.addEventListener("touchstart", handleWeightTouchStart, { passive: false })
    console.log(`Added listeners to ${element.id}`)

    // Initialize weight object data
    const weightId = element.id
    const weightIndex = draggableWeights.findIndex((w) => w.id === weightId)

    if (weightIndex >= 0) {
      // Update existing weight object
      draggableWeights[weightIndex].element = element

      // Initialize position based on element's current position
      const rect = element.getBoundingClientRect()
      draggableWeights[weightIndex].x = rect.left + rect.width / 2
      draggableWeights[weightIndex].y = rect.top + rect.height / 2

      // Make sure mass is correctly set
      const mass = Number.parseFloat(element.getAttribute("data-mass")) || draggableWeights[weightIndex].mass
      draggableWeights[weightIndex].mass = mass

      // Set the text content for trashcan weights
      if (draggableWeights[weightIndex].type === "trashcan") {
        element.textContent = `${mass} kg`
      }

      // Make sure the element is visible
      element.style.display = "block"
    }
  })

  // Add document-level event listeners for drag and drop
  document.removeEventListener("mousemove", handleWeightMouseMove)
  document.removeEventListener("mouseup", handleWeightMouseUp)
  document.removeEventListener("touchmove", handleWeightTouchMove)
  document.removeEventListener("touchend", handleWeightMouseUp)

  document.addEventListener("mousemove", handleWeightMouseMove)
  document.addEventListener("mouseup", handleWeightMouseUp)
  document.addEventListener("touchmove", handleWeightTouchMove, { passive: false })
  document.addEventListener("touchend", handleWeightMouseUp)
}

// Fix 4: Modify the drawSetupFn to ensure weights are always visible
const drawSetupFn = () => {
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

  // Always draw weights on scale
  drawWeightsOnScale()

  // Draw dragged weight with correct shape
  if (currentDraggedWeight && currentDraggedWeight.isDragging) {
    const x = currentDraggedWeight.x
    const y = currentDraggedWeight.y
    const width = currentDraggedWeight.width
    const height = currentDraggedWeight.height

    if (currentDraggedWeight.type === "extinguisher") {
      // Draw extinguisher
      ctx.fillStyle = "red"
      ctx.fillRect(x - width / 2, y - height, width, height)
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y - height, width, height)

      // Draw nozzle
      ctx.fillStyle = "black"
      ctx.fillRect(x - width / 4, y - height - width / 4, width / 2, width / 4)

      // Draw label
      ctx.fillStyle = "white"
      ctx.font = "bold " + baseSize / 2 + "px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${currentDraggedWeight.mass} kg`, x, y - height / 2)
    } else if (currentDraggedWeight.type === "trashcan") {
      // Draw trashcan
      ctx.fillStyle = "#888888"
      ctx.fillRect(x - width / 2, y - height, width, height)
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y - height, width, height)

      // Draw lid
      ctx.fillStyle = "#666666"
      ctx.fillRect(x - width / 2 - width / 10, y - height, width + width / 5, height / 10)

      // Draw label
      ctx.fillStyle = "white"
      ctx.font = "bold " + baseSize / 2 + "px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${currentDraggedWeight.mass} kg`, x, y - height / 2)
    }
  }

  // Only draw toggle switch if meter rod is not visible
  if (!meterRodVisible) {
    drawToggleSwitch()
  }

  // Update draggable weights container visibility
  const weightsContainer = document.getElementById("draggable-weights-container")
  if (weightsContainer) {
    if (meterRodVisible) {
      weightsContainer.style.display = "none"
      weightsContainer.style.visibility = "hidden"
      weightsContainer.style.opacity = "0"
    } else {
      weightsContainer.style.display = "flex"
      weightsContainer.style.visibility = "visible"
      weightsContainer.style.opacity = "1"

      // Force all weights to be visible if not on meter rod mode
      const weightElements = document.querySelectorAll(".draggable-weight")
      weightElements.forEach((element) => {
        if (!element.dataset.onScale || element.dataset.onScale === "false") {
          element.style.display = "block"
          element.style.visibility = "visible"
          element.style.opacity = "1"
        }
      })
    }
  }
}
// Modify placeWeightOnScaleAtIndex to update the DOM element position
function placeWeightOnScaleAtIndexFn(weightIndex, mouseX) {
  const weight = draggableWeights[weightIndex]
  weight.onScale = true

  // FIXED: Calculate position on scale - limit to scale boundaries and ensure it's relative to scale
  const scaleLeft = scaleX
  const scaleRight = scaleX + meterRodLength

  // Adjust position to be on the scale
  if (simulationRunning && scaleRotation !== 0) {
    // Calculate position on the rotated scale
    const centerX = fixedGPoint.x

    // Limit the position to be on the scale
    const limitedX = Math.max(scaleLeft, Math.min(scaleRight, mouseX))

    // Calculate distance from center
    weight.scalePosition = limitedX
  } else {
    weight.scalePosition = Math.max(scaleLeft, Math.min(scaleRight, mouseX))
  }

  // Set base at scale surface
  weight.y = scaleY

  // Update the DOM element position if it exists
  if (weight.element) {
    const canvasRect = canvas.getBoundingClientRect()
    const weightWidth = weight.element.offsetWidth
    const weightHeight = weight.element.offsetHeight

    // Position without rotation initially
    weight.element.style.position = "absolute"
    weight.element.style.left = `${canvasRect.left + weight.scalePosition - weightWidth / 2}px`
    weight.element.style.top = `${canvasRect.top + scaleY - weightHeight}px`
    weight.element.style.transform = ""
    weight.element.style.display = "block" // CRITICAL: Ensure visibility
    weight.element.style.opacity = "1" // Ensure full opacity

    // Store data for torque calculation
    weight.element.dataset.onScale = "true"
    weight.element.dataset.scalePosition = weight.scalePosition
  }

  // Recalculate torque if simulation is running
  if (simulationRunning) {
    calculateTorque()
  }

  drawSetupFn()
}

// Modify handleMouseDown to prevent interactions when meter rod is visible
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

  // Check if clicking on a draggable weight
  for (let i = 0; i < draggableWeights.length; i++) {
    // First check weights that are on the scale
    if (draggableWeights[i].onScale) {
      // For weights on the scale, we need to check if the click is within the weight's area
      const weight = draggableWeights[i]
      const weightX = weight.scalePosition
      const weightY = scaleY - weight.height / 2

      // Check if click is within the weight's bounds
      if (
        mouseX >= weightX - weight.width / 2 &&
        mouseX <= weightX + weight.width / 2 &&
        mouseY >= weightY - weight.height / 2 &&
        mouseY <= weightY + weight.height / 2
      ) {
        isDraggingWeight = true
        draggedWeightIndex = i

        // Set up dragging state
        currentDraggedWeight = draggableWeights[i]
        dragStartX = e.clientX
        dragStartY = e.clientY

        if (currentDraggedWeight.element) {
          const rect = currentDraggedWeight.element.getBoundingClientRect()
          elementStartX = rect.left
          elementStartY = rect.top

          // Set dragging visual state
          currentDraggedWeight.element.classList.add("dragging")
          currentDraggedWeight.element.style.zIndex = "1000"
        }

        // Store that it was on the scale
        currentDraggedWeight.wasOnScale = true
        currentDraggedWeight.previousScalePosition = currentDraggedWeight.scalePosition
        currentDraggedWeight.isDragging = true

        return
      }
    }
    // Then check weights that are not on the scale
    else if (isClickOnWeight(i, mouseX, mouseY)) {
      isDraggingWeight = true
      draggedWeightIndex = i
      return
    }
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
  const rawMouseX = e.clientX - rect.left
  const rawMouseY = e.clientY - rect.top

  // Adjust mouse position for weights when they're on the scale
  if (isDraggingWeight && draggedWeightIndex !== -1) {
    if (simulationRunning && scaleRotation !== 0 && isMouseOnScale(rawMouseX, rawMouseY)) {
      // Transform mouse coordinates to account for rotation when near the scale
      const centerX = fixedGPoint.x
      const centerY = fixedGPoint.y

      // Translate to origin
      const translatedX = rawMouseX - centerX
      const translatedY = rawMouseY - centerY

      // Rotate coordinates in the opposite direction of scale rotation
      const rotatedX = translatedX * Math.cos(-scaleRotation) - translatedY * Math.sin(-scaleRotation)
      const rotatedY = translatedX * Math.sin(-scaleRotation) + translatedY * Math.cos(-scaleRotation)

      // Translate back
      mouseX = rotatedX + centerX
      mouseY = rotatedY + centerY
    } else {
      mouseX = rawMouseX
      mouseY = rawMouseY
    }

    // Update the position of the dragged weight
    draggableWeights[draggedWeightIndex].x = mouseX
    draggableWeights[draggedWeightIndex].y = mouseY
  } else {
    mouseX = rawMouseX
    mouseY = rawMouseY
  }

  // Redraw the scene
  drawSetupFn()
}

function handleMouseUp() {
  if (isDraggingWeight && draggedWeightIndex !== -1) {
    // Check if we're dropping the weight on the scale
    if (isMouseOnScale(mouseX, mouseY)) {
      placeWeightOnScaleAtIndexFn(draggedWeightIndex, mouseX)
    }
  }

  // Reset all dragging states
  isDraggingSpringBalance = false
  isDraggingScale = false
  isDraggingWeight = false
  draggedSpringBalance = ""
  draggedWeightIndex = -1
}

function placeWeightOnScaleAtIndex(weightIndex, mouseX) {
  const weight = draggableWeights[weightIndex]
  weight.onScale = true

  // Adjust position to be on the scale
  if (simulationRunning && scaleRotation !== 0) {
    // Calculate position on the rotated scale
    const centerX = fixedGPoint.x

    // Limit the position to be on the scale
    const limitedX = Math.max(scaleX, Math.min(scaleX + meterRodLength, mouseX))

    // Calculate distance from center
    weight.scalePosition = limitedX
  } else {
    weight.scalePosition = Math.max(scaleX, Math.min(scaleX + meterRodLength, mouseX))
  }

  // Set base at scale surface
  weight.y = scaleY

  drawSetupFn()
}

function handleResize() {
  resizeCanvas()
  initializeSizes()
  initializePositions()
  drawSetupFn()
}

// Fix 5: Improve the drawing functions for weights to ensure correct shapes
// Modify drawExtinguisherFn to scale displayed weights
function drawExtinguisherFn(x, y, width, height, mass) {
  // Draw the extinguisher body with black border
  ctx.fillStyle = "red"
  ctx.fillRect(x - width / 2, y - height, width, height)
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.strokeRect(x - width / 2, y - height, width, height)

  // Draw the nozzle
  ctx.fillStyle = "black"
  ctx.fillRect(x - width / 4, y - height - width / 4, width / 2, width / 4)

  // Draw the label if mass labels are enabled
  if (showMassLabels) {
    ctx.fillStyle = "white"
    ctx.font = "bold " + baseSize / 2 + "px Arial"
    ctx.textAlign = "center"

    // Apply scaling based on spring constant
    const displayMass = Math.round(mass / displayedWeightScale)
    ctx.fillText(`${displayMass} kg`, x, y - height / 2)
  }

  // Draw force arrow if forces are enabled
  if (showAllForces && simulationRunning) {
    const force = mass * gravity
    drawForceArrow(x, y - height / 2, "down", `${force.toFixed(1)}N`)
  }
}

// Modify drawTrashCanWeightFn to scale displayed weights
function drawTrashCanWeightFn(x, y, width, height, mass) {
  // Draw the trashcan body with black border
  ctx.fillStyle = "#888888"
  ctx.fillRect(x - width / 2, y - height, width, height)
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2
  ctx.strokeRect(x - width / 2, y - height, width, height)

  // Draw the lid
  ctx.fillStyle = "#666666"
  ctx.fillRect(x - width / 2 - width / 10, y - height, width + width / 5, height / 10)

  // Draw the label if mass labels are enabled
  if (showMassLabels) {
    ctx.fillStyle = "white"
    ctx.font = "bold " + baseSize / 2 + "px Arial"
    ctx.textAlign = "center"

    // Apply scaling based on spring constant
    const displayMass = Math.round(mass / displayedWeightScale)
    ctx.fillText(`${displayMass} kg`, x, y - height / 2)
  }

  // Draw force arrow if forces are enabled
  if (showAllForces && simulationRunning) {
    const force = mass * gravity
    drawForceArrow(x, y - height / 2, "down", `${force.toFixed(1)}N`)
  }
}

// ========================== Initialization and Event Listener Setup ==========================

function setupEventListeners() {
  // Canvas click for toggle switch
  canvas.addEventListener("click", handleCanvasClick)

  // Weight buttons
  document.getElementById("weight1").addEventListener("click", handleWeightClick)
  document.getElementById("weight2").addEventListener("click", handleWeightClick)
  document.getElementById("weight3").addEventListener("click", handleWeightClick)
  document.getElementById("weight4").addEventListener("click", handleWeightClick)

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
  window.addEventListener("resize", resizeCanvas)

  const showMassLabelsCheckbox = document.getElementById("showMassLabels")
  if (showMassLabelsCheckbox) {
    showMassLabelsCheckbox.addEventListener("change", function () {
      showMassLabels = this.checked
      drawSetupFn()
    })
  }

  // Canvas interactions
  canvas.addEventListener("mousedown", handleMouseDown)
  canvas.addEventListener("mousemove", handleMouseMove)
  canvas.addEventListener("mouseup", handleMouseUp)
  canvas.addEventListener("mouseleave", handleMouseUp)
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

// Animation loop
function animate() {
  drawSetupFn()
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
  drawSetupFn()
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

  // Initialize sizes and positions
  resizeCanvas()

  // Set up event listeners
  setupEventListeners()

  // Set up draggable weights
  setupDraggableWeights()

  // Set initial UI visibility
  meterRodVisible = springBalancesVisible
  updateUIVisibility()

  // Start animation loop
  requestAnimationFrame(animate)
}

// Initialize on page load
window.onload = () => {
  initialize()

  // Verify draggable weights are set up
  setTimeout(() => {
    const weights = document.querySelectorAll(".draggable-weight")
    console.log(`Found ${weights.length} draggable weights`)

    // Force setup again if needed
    if (weights.length > 0) {
      console.log("Re-initializing draggable weights")
      setupDraggableWeights()
    }
  }, 500)
}

// Define startDrag function for HTML weights
function startDrag(e) {
  e.preventDefault()
  const weight = e.target

  // Set up drag state
  weight.isDragging = true
  weight.dragStartX = e.clientX || (e.touches && e.touches[0].clientX)
  weight.dragStartY = e.clientY || (e.touches && e.touches[0].clientY)

  // Store initial position
  const rect = weight.getBoundingClientRect()
  weight.startLeft = rect.left
  weight.startTop = rect.top

  // Add event listeners for drag
  document.addEventListener("mousemove", dragWeight)
  document.addEventListener("mouseup", stopDrag)
  document.addEventListener("touchmove", dragWeight, { passive: false })
  document.addEventListener("touchend", stopDrag)

  // Set visual state
  weight.style.zIndex = "1000"
  weight.style.cursor = "grabbing"
}

// Define dragWeight function
function dragWeight(e) {
  const weight = e.target
  if (!weight.isDragging) return

  e.preventDefault()

  const clientX = e.clientX || (e.touches && e.touches[0].clientX)
  const clientY = e.clientY || (e.touches && e.touches[0].clientY)

  const dx = clientX - weight.dragStartX
  const dy = clientY - weight.dragStartY

  weight.style.left = weight.startLeft + dx + "px"
  weight.style.top = weight.startTop + dy + "px"
}

// Define stopDrag function
function stopDrag(e) {
  const weight = e.target
  if (!weight.isDragging) return

  weight.isDragging = false
  weight.style.zIndex = ""
  weight.style.cursor = "grab"

  // Remove event listeners
  document.removeEventListener("mousemove", dragWeight)
  document.removeEventListener("mouseup", stopDrag)
  document.removeEventListener("touchmove", dragWeight)
  document.removeEventListener("touchend", stopDrag)

  // Recalculate torque if simulation is running
  if (simulationRunning) {
    // Update the weight's dataset with its new position
    const rect = weight.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    const canvasX = rect.left - canvasRect.left + rect.width / 2

    // Check if the weight is on the scale
    if (
      canvasX >= scaleX &&
      canvasX <= scaleX + meterRodLength &&
      rect.top - canvasRect.top >= scaleY - rect.height &&
      rect.top - canvasRect.top <= scaleY + meterRodHeight
    ) {
      weight.dataset.onScale = "true"
      weight.dataset.scalePosition = canvasX
    } else {
      weight.dataset.onScale = "false"
      weight.dataset.scalePosition = "0"
    }

    calculateTorque()
  }
}

// Calculate torque function
// Modify the calculateTorque function to include the base weight of the scale
calculateTorque = () => {
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

    // Log for debugging
    console.log(`Left weight: ${weight.mass}kg at ${distanceInMeters.toFixed(2)}m, torque: ${torque.toFixed(2)}`)
  })

  // Calculate right side torque from added weights
  rightWeights.forEach((weight) => {
    // Calculate distance from center in meters
    const distanceInPixels = weight.scalePosition - centerX
    const distanceInMeters = distanceInPixels / (meterRodLength / 4)

    // Calculate torque: mass * g * distance
    const torque = weight.mass * g * distanceInMeters
    rightTorque += torque

    // Log for debugging
    console.log(`Right weight: ${weight.mass}kg at ${distanceInMeters.toFixed(2)}m, torque: ${torque.toFixed(2)}`)
  })

  // Log base weight torques
  console.log(
    `Base weight torques - Left: ${(baseWeightKg * g * leftBaseDistance).toFixed(2)}, Right: ${(baseWeightKg * g * rightBaseDistance).toFixed(2)}`,
  )

  // Total torque (positive = clockwise, negative = counterclockwise)
  totalTorque = rightTorque - leftTorque
  console.log(`Total torque: ${totalTorque.toFixed(2)}`)

  // Check if the torques are balanced within a small threshold
  const torqueDifference = Math.abs(rightTorque - leftTorque)
  const balanceThreshold = 0.5 // Small threshold to account for pixel precision

  if (torqueDifference < balanceThreshold) {
    console.log("Scale is balanced - torques are equal")
    scaleRotation = 0
    updateWeightsPositions()
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

  // Update positions of weights on the scale
  updateWeightsPositions()
}

// Improved function to update weights positions
const updateWeightsPositions = () => {
  const canvasRect = canvas.getBoundingClientRect()
  const centerX = fixedGPoint.x
  const centerY = fixedGPoint.y

  // Update draggable weights
  draggableWeights.forEach((weight) => {
    if (weight.onScale && weight.element && !weight.isDragging) {
      const rect = weight.element.getBoundingClientRect()

      // Calculate distance from center
      const distanceFromCenter = weight.scalePosition - centerX

      // Apply rotation to get new position
      const rotatedX = centerX + distanceFromCenter * Math.cos(scaleRotation)
      const rotatedY = centerY + distanceFromCenter * Math.sin(scaleRotation)

      // Update position with proper offset calculation
      weight.element.style.position = "absolute"
      weight.element.style.left = `${rotatedX - rect.width / 2 + canvasRect.left}px`
      weight.element.style.top = `${rotatedY - rect.height + canvasRect.top}px`
      weight.element.style.display = "block" // Ensure visibility
    }
  })
}

// Handle weight click function
handleWeightClick = (event) => {
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

  drawSetupFn()
}
