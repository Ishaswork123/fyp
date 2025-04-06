let canvas, ctx;
let springTopX, springTopY = 50;
const naturalLength = 280;
const bobRadius = 20;
let springLength, mass = 500, springConstant = 0.5, gravity = 9.8;
let showWedge = true;
let currentWeight = 0;
let indicatorOffset = 0;
let springExtension = 0;
let animation;
let targetIndicatorOffset;
let showSpringBalances = false;
let springBalancesAttached = false;
let isDraggingScale = false;
let scaleOffsetX = 0;
let isScaleBalanced = true;
let scaleRotation = 0;
let showAllForces = false;
let showWeightForce = false;
let showGPoint = false;
const balanceThreshold = 5;

const showForces = document.getElementById("showAllForces");
const noDisplay = document.getElementById("NoDisplayScale");
const rulersDisplay = document.getElementById("Rulers");

let selectedWeightData = {
    weight: 0,
    width: 0,
    height: 0,
    color: "",
    isHanging: false,
};

canvas = document.getElementById("simulationCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Add this at the top of your script, outside of any function
let wedgeFixedX = 0;
let wedgeFixedY = 0;
const pointAX = canvas.width / 70;
const pointAY = canvas.height / 30;
const pointBX = canvas.width / 25;
const pointBY = canvas.height / 30;

const attachPointA = {
    x: 300,
    y: 70
};
const attachPointB = {
    x: 750,
    y: 70
};

const meterRodLength = 550;
const meterRodHeight = 20;
let meterRodX, meterRodY;
const wedgeBase = 50;
const wedgeHeight = 80;

// Hook properties
let hookX, hookY;
let fixedGPoint = {
    x: 0,
    y: 0
};

// Scale properties
let scaleX, scaleY;
const scaleGravityPoint = {
    x: 0,
    y: 0
};
let scaleIsOnWedge = true;

// Add new variables for draggable weights
const draggableWeights = [{
        id: "extinguisher1",
        type: "extinguisher",
        mass: 5,
        x: 0,
        y: 0,
        width: 30,
        height: 60,
        color: "red",
        onScale: false,
        scalePosition: 0,
    },
    {
        id: "extinguisher2",
        type: "extinguisher",
        mass: 5,
        x: 0,
        y: 0,
        width: 30,
        height: 60,
        color: "red",
        onScale: false,
        scalePosition: 0,
    },
    {
        id: "trashcan",
        type: "trashcan",
        mass: 10,
        x: 0,
        y: 0,
        width: 40,
        height: 70,
        color: "#888888",
        onScale: false,
        scalePosition: 0,
    },
];

let isDraggingWeight = false;
let draggedWeightIndex = -1;
let simulationRunning = false;
let showMassLabels = true;
let showLevel = false;
let positionMode = "none";

function initializeCanvas() {
    canvas = document.getElementById("simulationCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    springTopX = canvas.width / 2;
    springLength = springTopY + naturalLength;
    gravity = Number.parseFloat(document.getElementById("gravity").value);
    mass = Number.parseFloat(document.getElementById("massSlider").value);
    springConstant = Number.parseFloat(document.getElementById("springSlider").value);

    // Initialize force indicators
    showAllForces = document.getElementById("showAllForces").checked;
    showWeightForce = document.getElementById("showWeightForce").checked;

    // Set initial scale position
    scaleX = canvas.width / 2 - meterRodLength / 2;
    scaleY = canvas.height / 1.6; // Initial scaleY

    scaleGravityPoint.x = scaleX + meterRodLength / 2;
    scaleGravityPoint.y = scaleY + meterRodHeight / 2;

    // Initialize the fixed G point (center of the scale when balanced)
    fixedGPoint = {
        x: canvas.width / 2,
        y: scaleY + meterRodHeight / 2
    };

    // Initialize the wedge's fixed position
    wedgeFixedX = scaleX + meterRodLength / 2 - wedgeBase / 2;
    wedgeFixedY = scaleY + meterRodHeight;

    // Position the draggable weights on the right side of the screen
    const startX = canvas.width - 200;
    const startY = canvas.height - 150;

    draggableWeights[0].x = startX;
    draggableWeights[0].y = startY;

    draggableWeights[1].x = startX + 50;
    draggableWeights[1].y = startY;

    draggableWeights[2].x = startX + 110;
    draggableWeights[2].y = startY;

    drawSetup();

    // Add mouse event listeners for scale dragging and weight dragging
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Add event listener to toggle switch
    canvas.addEventListener("click", handleToggleClick);

    console.log("Canvas initialized. Event listeners attached.");
}

function updateCurrentWeight() {
    const scaleWeight = 110;
    currentWeight = scaleWeight + (selectedWeightData.isHanging ? selectedWeightData.weight : 0);
}

function handleWeightClick(event) {
    const selectedWeight = Number.parseInt(event.target.getAttribute("data-weight"));

    document.getElementById("massSlider").value = selectedWeight;
    document.getElementById("massValue").textContent = `${selectedWeight} g`;
    mass = selectedWeight;

    selectedWeightData = {
        weight: selectedWeight,
        width: event.target.offsetWidth,
        height: event.target.offsetHeight,
        color: getComputedStyle(event.target).backgroundColor,
        isHanging: true,
    };
    updateCurrentWeight();
    updateSpringExtension();
    updateIndicatorOffset();
    drawSetup();
}

function drawHook(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20);
    ctx.arc(x, y + 20, 5, 0, Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawWeight(x, y) {
    if (selectedWeightData.isHanging && selectedWeightData.weight > 0) {
        ctx.fillStyle = selectedWeightData.color;
        const weightWidth = 50;
        const weightHeight = 40;

        // Draw weight
        ctx.fillRect(x - weightWidth / 2, y + 25, weightWidth, weightHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x - weightWidth / 2, y + 25, weightWidth, weightHeight);

        // Draw weight value
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${selectedWeightData.weight}g`, x, y + 50);

        // Draw weight force if enabled
        if (showWeightForce) {
            drawForceArrow(x, y + 25 + weightHeight / 2, "down", "Weight");
        }
    }
}

function drawForceArrow(x, y, direction, label) {
    ctx.save();
    ctx.setLineDash([5, 3]); // Dotted line
    ctx.lineWidth = 2;
    ctx.strokeStyle = direction === "down" ? "red" : "blue";

    const arrowLength = 50;

    ctx.beginPath();
    if (direction === "down") {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + arrowLength);

        // Arrow head
        ctx.lineTo(x - 5, y + arrowLength - 10);
        ctx.moveTo(x, y + arrowLength);
        ctx.lineTo(x + 5, y + arrowLength - 10);
    } else if (direction === "up") {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - arrowLength);

        // Arrow head
        ctx.lineTo(x - 5, y - arrowLength + 10);
        ctx.moveTo(x, y - arrowLength);
        ctx.lineTo(x + 5, y - arrowLength + 10);
    }
    ctx.stroke();

    // Add label
    ctx.font = "12px Arial";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "center";

    if (direction === "down") {
        ctx.fillText(label, x, y + arrowLength + 15);
    } else if (direction === "up") {
        ctx.fillText(label, x, y - arrowLength - 5);
    }

    ctx.restore();
}

function drawScale(x, y, rotation = 0) {
    ctx.save(); // Save the current context state

    // Apply rotation around the fixed G point if the simulation is running
    if (simulationRunning) {
        ctx.translate(fixedGPoint.x, fixedGPoint.y);
        ctx.rotate(rotation);
        ctx.translate(-fixedGPoint.x, -fixedGPoint.y);
    }

    // Draw the scale at the updated position
    ctx.fillStyle = "#E8C48E"; // Light wood color
    ctx.fillRect(x, y, meterRodLength, meterRodHeight);
    ctx.strokeStyle = "#8B4513"; // Dark brown for border
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, meterRodLength, meterRodHeight);

    // Draw scale markings if rulers are enabled
    if (positionMode === "rulers") {
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        for (let i = 0; i <= 10; i++) {
            const markX = x + (i / 10) * meterRodLength;
            ctx.fillText(i * 10 + "cm", markX - 10, y + 15);
            ctx.beginPath();
            ctx.moveTo(markX, y);
            ctx.lineTo(markX, y + 5);
            ctx.stroke();
        }
    } else if (positionMode === "marks") {
        // Draw position marks
        for (let i = 0; i <= 10; i++) {
            const markX = x + (i / 10) * meterRodLength;
            ctx.beginPath();
            ctx.moveTo(markX, y);
            ctx.lineTo(markX, y + 5);
            ctx.stroke();
        }
    }

    // Draw the G point indicator only if showGPoint is true
    if (showGPoint) {
        ctx.fillStyle = "Green";
        ctx.font = "bold 16px Arial";
        const centerX = x + meterRodLength / 2;
        ctx.fillText("G", centerX - 5, y - 10);

        // Draw the gravity point indicator
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(fixedGPoint.x, fixedGPoint.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw level indicator if enabled
    if (showLevel && simulationRunning) {
        const centerX = x + meterRodLength / 2;
        const levelY = y - 20;

        ctx.beginPath();
        ctx.moveTo(centerX - 50, levelY);
        ctx.lineTo(centerX + 50, levelY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw bubble
        const bubbleOffset = rotation * 500; // Exaggerate for visibility
        const bubbleX = centerX + bubbleOffset;
        ctx.beginPath();
        ctx.arc(bubbleX, levelY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Draw forces if enabled
    if (showForces && simulationRunning) {
        // Draw normal force when on wedge
        const centerX = x + meterRodLength / 2;
        drawForceArrow(centerX, y, "up", "Normal");

        // Draw gravity force
        drawForceArrow(fixedGPoint.x, fixedGPoint.y, "down", "Gravity");
    }

    ctx.restore(); // Restore the original context state
}


function drawWithWedge() {
    scaleIsOnWedge = true;
    if (showWedge) {
        drawWedge();
    }

    if (!simulationRunning) {
        drawSupports();
    }
}

function drawWedge() {
    // Draw the wedge at its fixed position
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(wedgeFixedX, wedgeFixedY + wedgeHeight);
    ctx.lineTo(wedgeFixedX + wedgeBase, wedgeFixedY + wedgeHeight);
    ctx.lineTo(wedgeFixedX + wedgeBase / 2, wedgeFixedY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawSupports() {
    // Draw supports on both sides
    const supportWidth = 20;
    const supportHeight = 80;
    // Left support
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(scaleX - supportWidth, scaleY + meterRodHeight, supportWidth, supportHeight);
    ctx.strokeStyle = "#888888";
    ctx.strokeRect(scaleX - supportWidth, scaleY + meterRodHeight, supportWidth, supportHeight);

    // Base for left support
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(scaleX - supportWidth - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20);
    ctx.strokeStyle = "#888888";
    ctx.strokeRect(scaleX - supportWidth - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20);

    // Right support
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(scaleX + meterRodLength, scaleY + meterRodHeight, supportWidth, supportHeight);
    ctx.strokeStyle = "#888888";
    ctx.strokeRect(scaleX + meterRodLength, scaleY + meterRodHeight, supportWidth, supportHeight);

    // Base for right support
    ctx.fillStyle = "#AAAAAA";
    ctx.fillRect(scaleX + meterRodLength - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20);
    ctx.strokeStyle = "#888888";
    ctx.strokeRect(scaleX + meterRodLength - 10, scaleY + meterRodHeight + supportHeight, supportWidth + 20, 20);
}



function drawWithoutWedge() {
    scaleIsOnWedge = false;
    showWedge = false;
    if (showSpringBalances) {
        // Attach the scale to the bottom hooks of the spring balances
        scaleY = springTopY + 260;  // Set scaleY to the bottom of the spring balance
        drawSpringBalances(true, scaleY);
        drawScale(scaleX, scaleY, scaleRotation);  // Draw the scale at the new Y position with scaleRotation
    } else {
        // If spring balances are not shown, draw the hook at the usual position
        hookX = scaleX + meterRodLength / 2;
        hookY = scaleY + meterRodHeight;
        drawHook(hookX, hookY);
        // Draw weight if selected
        if (selectedWeightData.isHanging) {
            drawWeight(hookX, hookY);
        }
    }
    // Draw center hook on scale
    hookX = scaleX + meterRodLength / 2;
    hookY = scaleY + meterRodHeight;
    drawHook(hookX, hookY);
    // Draw weight if selected
    if (selectedWeightData.isHanging) {
        drawWeight(hookX, hookY);
    }
}


function drawSpringBalance(springTopX, springTopY, attachRod = false, rodY = 0) {
    const scaleWeight = 110;
    currentWeight = scaleWeight + (selectedWeightData.isHanging ? selectedWeightData.weight : 0);

    // Define colors and gradients for 3D effect
    const casingColor = "#c0c0c0"; // Light grey for casing
    const innerAreaColor = "#ffffff"; // White for measurement area

    // Create a gradient for the casing
    const casingGradient = ctx.createLinearGradient(springTopX - 45, springTopY, springTopX + 45, springTopY);
    casingGradient.addColorStop(0, "#808080"); // Darker grey
    casingGradient.addColorStop(0.5, casingColor);
    casingGradient.addColorStop(1, "#a9a9a9"); // Medium grey

    // Casing with a 3D effect using gradients
    ctx.fillStyle = casingGradient;
    ctx.fillRect(springTopX - 45, springTopY, 90, 280);

    // Inner measurement area (white)
    ctx.fillStyle = innerAreaColor;
    ctx.fillRect(springTopX - 40, springTopY + 25, 80, 240);

    // Draw scales
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";

    // Draw N and g labels
    ctx.fillText("N", springTopX - 25, springTopY + 45);
    ctx.fillText("g", springTopX + 15, springTopY + 45);

    // Left scale (Newtons) with small divisions
    for (let i = 0; i <= 10; i++) {
        const y = springTopY + 60 + i * 20;
        ctx.fillText(i, springTopX - 25, y);
        // Draw main division line
        ctx.beginPath();
        ctx.moveTo(springTopX - 10, y - 4);
        ctx.lineTo(springTopX, y - 4);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw small divisions between main points
        if (i < 10) {
            // Don't draw small lines after the last point
            for (let j = 1; j < 5; j++) {
                const smallY = y + (j * 20) / 5;
                ctx.beginPath();
                ctx.moveTo(springTopX - 5, smallY - 4);
                ctx.lineTo(springTopX, smallY - 4);
                ctx.stroke();
            }
        }
    }

    // Right scale (grams) with small divisions
    for (let i = 0; i <= 10; i++) {
        const y = springTopY + 60 + i * 20;

        // Draw main division label and line
        ctx.fillText(i * 100, springTopX + 15, y);
        ctx.beginPath();
        ctx.moveTo(springTopX, y - 4);
        ctx.lineTo(springTopX + 10, y - 4);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw small divisions (4 per section)
        if (i < 10) {
            for (let j = 1; j < 5; j++) { // 4 divisions
                const smallY = y + (j * 20) / 5; // Properly spaced small lines
                ctx.beginPath();
                ctx.moveTo(springTopX, smallY - 4);
                ctx.lineTo(springTopX + 5, smallY - 4);
                ctx.stroke();
            }
        }
    }

    // Draw vertical line between scales
    ctx.beginPath();
    ctx.moveTo(springTopX, springTopY + 60 - 4);
    ctx.lineTo(springTopX, springTopY + 260 - 4);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw the indicator with the animated position
    drawIndicator(springTopX, springTopY + 60 + springExtension + indicatorOffset);

    // Bottom Hook
    drawHook(springTopX, springTopY + 280);

     // **If attaching the rod, draw a line connecting the spring balance to the rod**
     if (attachRod) {
        ctx.beginPath();
        ctx.moveTo(springTopX, springTopY + 280); // From the bottom hook
        ctx.lineTo(springTopX, rodY);   // To the meter rod
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}



function drawIndicator(springTopX, indicatorPosition) {
    ctx.beginPath();
    ctx.moveTo(springTopX - 25, indicatorPosition);
    ctx.lineTo(springTopX + 25, indicatorPosition);

    ctx.strokeStyle = "red"; // Fixed color
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawSpringBalances(attachRod = false, rodY = 0) {
    const springTopY = canvas.width / 50;
    const springLeftX = attachPointA.x + 100;
    const springRightX = attachPointB.x + 100;

    drawSpringBalance(springLeftX, springTopY, attachRod, rodY);
    drawSpringBalance(springRightX, springTopY, attachRod, rodY);
}

// Draw the draggable weights
function drawDraggableWeights() {
    for (let i = 0; i < draggableWeights.length; i++) {
        const weight = draggableWeights[i];

        // Skip drawing if the weight is on the scale and simulation is running
        if (weight.onScale && simulationRunning) {
            continue;
        }

        // Draw the weight based on its type
        if (weight.type === "extinguisher") {
            drawExtinguisher(weight.x, weight.y, weight.width, weight.height, weight.mass);
        } else if (weight.type === "trashcan") {
            drawTrashCan(weight.x, weight.y, weight.width, weight.height, weight.mass);
        }
    }
}

// Draw fire extinguisher
function drawExtinguisher(x, y, width, height, mass) {
    // Draw the body
    ctx.fillStyle = "red"; // Red color
    ctx.fillRect(x - width / 2, y - height, width, height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y - height, width, height);

    // Draw nozzle
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x, y - height - 10);
    ctx.lineTo(x + 10, y - height - 15);
    ctx.stroke();

    // Draw fire symbol
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y - height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw flame symbol
    ctx.beginPath();
    ctx.moveTo(x, y - height / 2 - 5);
    ctx.lineTo(x - 3, y - height / 2);
    ctx.lineTo(x, y - height / 2 + 5);
    ctx.lineTo(x + 3, y - height / 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw mass label if enabled
    if (showMassLabels) {
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${mass} kg`, x, y + 15);
    }
}

// Draw trash can
function drawTrashCan(x, y, width, height, mass) {
    // Draw trash can body
    ctx.fillStyle = "#888888"; // Gray color
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y - height);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width / 2 + 5, y);
    ctx.lineTo(x - width / 2 - 5, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw trash can lid
    ctx.fillStyle = "#666666";
    ctx.beginPath();
    ctx.ellipse(x, y - height, width / 2 + 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw ridges on the trash can
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y - height + (i * height) / 4);
        ctx.lineTo(x + width / 2, y - height + (i * height) / 4);
        ctx.strokeStyle = "#666666";
        ctx.stroke();
    }

    // Draw mass label if enabled
    if (showMassLabels) {
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${mass} kg`, x, y + 15);
    }
}
function drawWeightsOnScale() {
    if (!simulationRunning) return;

    ctx.save();

    // Apply the same transformation as the scale
    ctx.translate(fixedGPoint.x, fixedGPoint.y);
    ctx.rotate(scaleRotation);
    ctx.translate(-fixedGPoint.x, -fixedGPoint.y);

    for (const weight of draggableWeights) {
        if (weight.onScale) {
            const x = weight.scalePosition - fixedGPoint.x;
            const y = scaleY - fixedGPoint.y - weight.height; // Correct origin relative to the center.

            // Apply the rotation to the weight's position
            const rotatedX = x * Math.cos(scaleRotation) - y * Math.sin(scaleRotation);
            const rotatedY = x * Math.sin(scaleRotation) + y * Math.cos(scaleRotation);

            if (weight.type === "extinguisher") {
                drawExtinguisher(rotatedX + fixedGPoint.x, rotatedY + fixedGPoint.y, weight.width, weight.height, weight.mass);
            } else if (weight.type === "trashcan") {
                drawTrashCan(rotatedX + fixedGPoint.x, rotatedY + fixedGPoint.y, weight.width, weight.height, weight.mass);
            }

            // Draw force arrow if forces are enabled
            if (showForces) {
                drawForceArrow(rotatedX + fixedGPoint.x, rotatedY + fixedGPoint.y + weight.height, "down", `${weight.mass * gravity}N`);
            }
        }
    }

    ctx.restore();
}

// Draw the toggle switch
function drawToggleSwitch() {
    const switchX = canvas.width / 2;
    const switchY = canvas.height - 80; // Adjusted switch position
    const switchWidth = 150;
    const switchHeight = 40;

    // Draw switch background
    ctx.fillStyle = "#EEEEEE";
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(switchX - switchWidth / 2, switchY - switchHeight / 2, switchWidth, switchHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Draw toggle position
    const togglePosition = simulationRunning ? switchX + 40 : switchX - 40;
    ctx.fillStyle = simulationRunning ? "#4CAF50" : "#F44336";
    ctx.beginPath();
    ctx.arc(togglePosition, switchY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#333333";
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "#333333";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    // Left image (setup mode)
    ctx.beginPath();
    ctx.moveTo(switchX - 60, switchY);
    ctx.lineTo(switchX - 30, switchY);
    ctx.strokeStyle = "#333333";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(switchX - 45, switchY);
    ctx.lineTo(switchX - 45, switchY + 10);
    ctx.lineTo(switchX - 40, switchY);
    ctx.lineTo(switchX - 50, switchY);
    ctx.closePath();
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.stroke();

    // Right image (simulation mode)
    ctx.beginPath();
    ctx.moveTo(switchX + 30, switchY - 5);
    ctx.lineTo(switchX + 60, switchY + 5);
    ctx.strokeStyle = "#333333";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(switchX + 45, switchY);
    ctx.lineTo(switchX + 45, switchY + 10);
    ctx.lineTo(switchX + 40, switchY);
    ctx.lineTo(switchX + 50, switchY);
    ctx.closePath();
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    ctx.stroke();
}

// Event listeners for checkboxes and radio buttons
document.getElementById("showAllForces").addEventListener("change", function() {
    showAllForces = this.checked;
    drawSetup();
});

document.getElementById("showWeightForce").addEventListener("change", function() {
    showWeightForce = this.checked;
    drawSetup();
});

document.getElementById("NoDisplayScale").addEventListener("change", function() {
    positionMode = "none";
    drawSetup();
});

document.getElementById("Rulers").addEventListener("change", function() {
    positionMode = "rulers";
    drawSetup();
});

function drawSetup() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87CEEB"); // Sky blue
    gradient.addColorStop(1, "#B0E0E6"); // Powder blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = "#8FBC8F"; // Dark sea green
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Calculate torque and rotation
    let totalTorque = 0;
    const centerX = scaleX + meterRodLength / 2;

    for (const weight of draggableWeights) {
        if (weight.onScale) {
            const distance = weight.scalePosition - centerX;
            totalTorque += weight.mass * gravity * distance * 0.01;
        }
    }

    console.log("total torque: ", totalTorque);

    // Apply rotation based on torque only if simulation is running
    if (simulationRunning) {
        // Scale the torque to a reasonable range for rotation
        const torqueScaleFactor = 0.001; // Adjust this factor to control sensitivity
        scaleRotation = totalTorque * torqueScaleFactor;
    }

    // Limit rotation to prevent excessive tilting
    const maxRotation = Math.PI / 12; // 15 degrees
    scaleRotation = Math.max(Math.min(scaleRotation, maxRotation), -maxRotation);

    console.log("max rotation:", maxRotation);
    console.log("scale Rotation: ", scaleRotation);

    if (!showWedge) {
        scaleY = springTopY + 260;
        drawScale(scaleX, scaleY, scaleRotation);
    } else {
        drawScale(scaleX, scaleY, scaleRotation);
    }
    // Draw the scale, applying the rotation

    // Draw wedge and weights ON TOP of the rotated scale.
    if (showWedge) {
        drawWithWedge();
    }

    drawWeightsOnScale(); // Draw weights on the scale during simulation

    // Always draw this whether wedge is shown or not.
    if (!showWedge) {
        drawWithoutWedge();
    }

    // Redraw spring balances if enabled
    if (showSpringBalances) {
        drawSpringBalances();
    }

    // Draw draggable weights (ones NOT on the scale)
    drawDraggableWeights();

    // Draw toggle switch
    drawToggleSwitch();

    console.log("Scale redrawn at:", scaleX, scaleY, "Rotation:", scaleRotation); // Debug log
}

function updateIndicatorOffset() {
    targetIndicatorOffset = springExtension; // Scale down for visualization

    if (animation) {
        animation.pause(); // Stop any current animation
    }

    animation = anime({
        targets: this,
        indicatorOffset: targetIndicatorOffset,
        duration: Infinity, // Animation duration
        easing: "easeInOutQuad", // Easing function for smooth animation
        update: () => {
            // Use arrow function to preserve 'this' context
            drawSetup(); // Redraw the canvas on each update
        },
    });
}

function updateSpringExtension() {
    springExtension = (mass * gravity) / springConstant / 100; // x = F/k = (mg/k

    if (animation) {
        animation.pause(); // Stop any current animation
    }

    animation = anime({
        targets: this,
        springExtension: springExtension,
        duration: 800, // Animation duration
        easing: "easeInOutQuad", // Easing function for smooth animation
        update: () => {
            drawSetup(); // Redraw the canvas on each update
        },
    });
}

function updateGravityValue(value) {
    gravity = Number.parseFloat(value); // Update the gravity variable
    document.getElementById("gravity-value").innerText = value + " m/s²";
    updateSpringExtension(); // Recalculate spring extension based on new gravity
    updateIndicatorOffset(); // and indicator offset too
    drawSetup(); // Redraw the scene
}

function updateWeight() {
    mass = Number.parseFloat(document.getElementById("massSlider").value);
    selectedWeightData.weight = mass; // Update weight value
    updateCurrentWeight();
    updateSpringExtension(); // Recalculate spring extension based on new mass
    updateIndicatorOffset();
    drawSetup();
}

function placeWeightOnScale(weightIndex, mouseX) {
    draggableWeights[weightIndex].onScale = true;
    draggableWeights[weightIndex].scalePosition = mouseX;
    console.log("Weight placed on scale at position:", mouseX);
    drawSetup(); // Redraw the canvas immediately after placing the weight
}

function handleMouseUp(e) {
    if (isDraggingWeight && draggedWeightIndex !== -1) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Check if the weight is dropped on the scale
        if (
            mouseX >= scaleX &&
            mouseX <= scaleX + meterRodLength &&
            mouseY >= scaleY - 20 &&
            mouseY <= scaleY + meterRodHeight
        ) {
            // Place the weight on the scale
            placeWeightOnScale(draggedWeightIndex, mouseX);
        } else {
            // Reset the weight's onScale status if it was previously on the scale
            draggableWeights[draggedWeightIndex].onScale = false;
            drawSetup(); //Redraw if weight taken off scale
        }

        // Reset dragging state
        isDraggingWeight = false;
        draggedWeightIndex = -1;
    }
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const switchX = canvas.width / 2;
    const switchY = canvas.height - 80; // Adjusted switch position
    const switchWidth = 150;
    const switchHeight = 40;
    const togglePosition = simulationRunning ? switchX + 40 : switchX - 40;

    // Check if clicking on the toggle switch
    const distance = Math.sqrt((mouseX - togglePosition) ** 2 + (mouseY - switchY) ** 2);
    if (distance <= 20) { // Radius of the toggle
        return; // Do nothing, handled by handleToggleClick
    }

    // Check if clicking on any draggable weight
    for (let i = 0; i < draggableWeights.length; i++) {
        const weight = draggableWeights[i];

        // Define the bounding box of the weight
        const weightLeft = weight.x - weight.width / 2;
        const weightRight = weight.x + weight.width / 2;
        const weightTop = weight.y - weight.height;
        const weightBottom = weight.y;

        // Check if the mouse is within the bounding box
        if (
            mouseX >= weightLeft &&
            mouseX <= weightRight &&
            mouseY >= weightTop &&
            mouseY <= weightBottom
        ) {
            console.log("Dragging weight started:", weight.id);
            isDraggingWeight = true;
            draggedWeightIndex = i;
            return; // Exit the function after finding the clicked weight
        }
    }
}

function handleMouseMove(e) {
    if (isDraggingWeight && draggedWeightIndex !== -1) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Update the position of the dragged weight
        draggableWeights[draggedWeightIndex].x = mouseX;
        draggableWeights[draggedWeightIndex].y = mouseY;

        // Redraw the canvas to reflect the new position
        drawSetup();
    }
}

// Toggle Switch event
function handleToggleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const switchX = canvas.width / 2;
    const switchY = canvas.height - 80; // Adjusted switch position
    const switchWidth = 150;
    const switchHeight = 40;

    // Calculate the distance between the click and the switch center
    const distance = Math.sqrt((mouseX - switchX) ** 2 + (mouseY - switchY) ** 2);

    // Check if the click is within the switch bounds
    if (mouseX >= switchX - switchWidth / 2 &&
        mouseX <= switchX + switchWidth / 2 &&
        mouseY >= switchY - switchHeight / 2 &&
        mouseY <= switchY + switchHeight / 2) {
        simulationRunning = !simulationRunning;
        drawSetup();
        console.log("Simulation running:", simulationRunning);
    }
}

// Reset function
function resetExperiment() {
    // Reset all variables to initial values
    mass = 500;
    springConstant = 0.5;
    gravity = 9.8;
    showWedge = true;
    currentWeight = 0;
    indicatorOffset = 0;
    springExtension = 0;
    showSpringBalances = false;
    springBalancesAttached = false;
    isDraggingScale = false;
    scaleOffsetX = 0;
    isScaleBalanced = true;
    scaleRotation = 0;
    simulationRunning = false;

    // Reset draggable weights
    const startX = canvas.width - 200;
    const startY = canvas.height - 150;

    draggableWeights[0].x = startX;
    draggableWeights[0].y = startY;
    draggableWeights[0].onScale = false;

    draggableWeights[1].x = startX + 50;
    draggableWeights[1].y = startY;
    draggableWeights[1].onScale = false;

    draggableWeights[2].x = startX + 110;
    draggableWeights[2].y = startY;
    draggableWeights[2].onScale = false;

    // Reset UI elements
    document.getElementById("massSlider").value = mass;
    document.getElementById("massValue").textContent = `${mass} g`;
    document.getElementById("springSlider").value = springConstant;
    document.getElementById("springValue").textContent = springConstant;
    document.getElementById("gravity").value = gravity;
    document.getElementById("gravity-value").innerText = gravity + " m/s²";
    document.getElementById("showAllForces").checked = false; // Reset to unchecked
    document.getElementById("showWeightForce").checked = false; // Reset to unchecked
    document.getElementById("NoDisplayScale").checked = true;
    document.getElementById("Rulers").checked = false;

    positionMode = "none";

    // Reset selected weight data
    selectedWeightData = {
        weight: 0,
        width: 0,
        height: 0,
        color: "",
        isHanging: false,
    };

    // Update everything
    updateCurrentWeight();
    updateSpringExtension();
    updateIndicatorOffset();
    drawSetup();
}

// Event Listeners
document.getElementById("weight1").addEventListener("click", handleWeightClick);
document.getElementById("weight2").addEventListener("click", handleWeightClick);
document.getElementById("weight3").addEventListener("click", handleWeightClick);
document.getElementById("weight4").addEventListener("click", handleWeightClick);

document.getElementById("massSlider").addEventListener("input", (event) => {
    const sliderWeight = Number.parseInt(event.target.value);
    document.getElementById("massValue").textContent = `${sliderWeight} g`;
    mass = sliderWeight; // Update mass variable
    selectedWeightData = {
        weight: sliderWeight,
        width: 50,
        height: 40,
        color: "gray",
        isHanging: true,
    };
    updateCurrentWeight();
    updateSpringExtension();
    updateIndicatorOffset(); // Update indicator position
    drawSetup();
});

// Mass slider arrow buttons
document.getElementById("mass-decrease").addEventListener("click", () => {
    const massSlider = document.getElementById("massSlider");
    if (Number.parseInt(massSlider.value) > Number.parseInt(massSlider.min)) {
        massSlider.value = Number.parseInt(massSlider.value) - Number.parseInt(massSlider.step);
        document.getElementById("massValue").textContent = `${massSlider.value} g`;
        mass = Number.parseInt(massSlider.value);
        updateWeight();
    }
});

document.getElementById("mass-increase").addEventListener("click", () => {
    const massSlider = document.getElementById("massSlider");
    if (Number.parseInt(massSlider.value) < Number.parseInt(massSlider.max)) {
        massSlider.value = Number.parseInt(massSlider.value) + Number.parseInt(massSlider.step);
        document.getElementById("massValue").textContent = `${massSlider.value} g`;
        mass = Number.parseInt(massSlider.value);
        updateWeight();
    }
});

// Spring slider arrow buttons
document.getElementById("spring-decrease").addEventListener("click", () => {
    const springSlider = document.getElementById("springSlider");
    if (Number.parseFloat(springSlider.value) > Number.parseFloat(springSlider.min)) {
        springSlider.value = (Number.parseFloat(springSlider.value) - Number.parseFloat(springSlider.step)).toFixed(1);
        document.getElementById("springValue").textContent = springSlider.value;
        springConstant = Number.parseFloat(springSlider.value);
        updateSpringExtension();
    }
});

document.getElementById("spring-increase").addEventListener("click", () => {
    const springSlider = document.getElementById("springSlider");
    if (Number.parseFloat(springSlider.value) < Number.parseFloat(springSlider.max)) {
        springSlider.value = (Number.parseFloat(springSlider.value) + Number.parseFloat(springSlider.step)).toFixed(1);
        document.getElementById("springValue").textContent = springSlider.value;
        springConstant = Number.parseFloat(springSlider.value);
        updateSpringExtension();
    }
});

// Force indicator checkboxes
document.getElementById("showAllForces").addEventListener("change", function() {
    showAllForces = this.checked;
    drawSetup();
});

document.getElementById("showWeightForce").addEventListener("change", function() {
    showWeightForce = this.checked;
    drawSetup();
});

//Position radio buttons
document.getElementById("NoDisplayScale").addEventListener("change", function() {
    if (this.checked) {
        positionMode = "none";
        drawSetup();
    }
});

document.getElementById("Rulers").addEventListener("change", function() {
    if (this.checked) {
        positionMode = "rulers";
        drawSetup();
    }
});

const wedgeIcon = document.getElementById("wedgeIcon");
wedgeIcon?.addEventListener("click", () => {
    showWedge = !showWedge;
    console.log("Wedge connected:", showWedge);
    drawSetup();
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", resetExperiment);

const meterRodIcon = document.getElementById("meterRodIcon");
const meterRodsContainer = document.getElementById("meterRodsContainer");

meterRodIcon?.addEventListener("click", () => {
    showSpringBalances = !showSpringBalances;
    meterRodsAttached = showSpringBalances;
    showWedge = !showWedge;

    // Toggle visibility of meter rods
    if (meterRodsAttached) {
        meterRodsContainer.style.display = "flex"; // Or "block" depending on your layout
    } else {
        meterRodsContainer.style.display = "none";
    }

    console.log("Meter rods attached:", meterRodsAttached);
    drawSetup();
});

const addValuesBtn = document.getElementById("addValuesBtn");
const tableContainer = document.getElementById("tableContainer");

addValuesBtn.addEventListener("click", () => {
    tableContainer.style.display = tableContainer.style.display === "none" ? "block" : "none";
});

document.getElementById("gravity").addEventListener("input", (event) => {
    const newGravity = Number.parseFloat(event.target.value);
    gravity = newGravity; // Update gravity variable
    document.getElementById("gravity-value").innerText = gravity + " m/s²";
    updateSpringExtension();
    updateIndicatorOffset();
    drawSetup();
});

//gravityyyy
document.getElementById("gravityBtn").addEventListener("click", function() {
    const gravityControl = document.getElementById("gravity-control");

    if (gravityControl.style.display === "none" || gravityControl.style.display === "") {
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

document.getElementById("gravity-increase").addEventListener("click", () => {
    if (Number.parseFloat(gravityInput.value) < 25) {
        gravityInput.value = (Number.parseFloat(gravityInput.value) + 0.1).toFixed(1);
        gravityValue.innerText = `${gravityInput.value} m/s²`;
        gravity = Number.parseFloat(gravityInput.value);
        updateSpringExtension();
        updateIndicatorOffset();
        drawSetup();
    }
});

document.getElementById("gravity-decrease").addEventListener("click", () => {
    if (Number.parseFloat(gravityInput.value) > 0) {
        gravityInput.value = (Number.parseFloat(gravityInput.value) - 0.1).toFixed(1);
        gravityValue.innerText = `${gravityInput.value} m/s²`;
        gravity = Number.parseFloat(gravityInput.value);
        updateSpringExtension();
        updateIndicatorOffset();
        drawSetup();
    }
});

gravityInput.addEventListener("input", () => {
    gravityValue.innerText = `${gravityInput.value} m/s²`;
    gravity = Number.parseFloat(gravityInput.value);
    updateSpringExtension();
    updateIndicatorOffset();
    drawSetup();
});

const gravitySelect = document.getElementById("gravitySelect");

gravitySelect.addEventListener("change", function() {
    gravityInput.value = this.value;
    gravity = Number.parseFloat(this.value);
    gravityValue.innerText = `${this.value} m/s²`;
    updateSpringExtension();
    updateIndicatorOffset();
    drawSetup();
});

// Function to check orientation and show a warning if in portrait mode
function checkOrientation() {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (isPortrait) {
        // Show a warning message
        const warning = document.createElement("div");
        warning.id = "orientation-warning";
        warning.innerHTML = `
            <p>Please rotate your device to landscape mode for the best experience.</p>
        `;
        document.body.appendChild(warning);
    } else {
        // Remove the warning if it exists
        const existingWarning = document.getElementById("orientation-warning");
        if (existingWarning) {
            existingWarning.remove();
        }
    }
}

// Call the function when the page loads
window.addEventListener("load", checkOrientation);

// Call the function whenever the orientation changes
window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation); // Handle resize events for desktop browsers
window.onload = initializeCanvas;
window.onresize = initializeCanvas;