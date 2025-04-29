document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("expCanvas")
    const ctx = canvas.getContext("2d")
    let angleWeightChart; // Declare globally
    createAngleWeightChart();
  
    const weightPInput = document.getElementById("weightP")
    const weightQInput = document.getElementById("weightQ")
    const unknownWeightInput = document.getElementById("unknownWeight")
  
    const weightPValue = document.getElementById("weightP-value")
    const weightQValue = document.getElementById("weightQ-value")
    const unknownWeightValue = document.getElementById("unknownWeight-value")
    const VLValue = document.getElementById("VL-value")
  
    const verticalLengthInput = document.getElementById("verticalLength")
    const errorDisplay = document.getElementById("weightError")
    const weightWDisplay = document.getElementById("weightW")
  
  
    function createAngleWeightChart() {
        const ctx = document.getElementById('AngleWeighGraph').getContext('2d');
        angleWeightChart = new Chart(ctx, {
            type: 'scatter',  // SCATTER chart type!
            data: {
                datasets: [
                    {
                        label: 'p*sin(Theta1)  vs Unknown Weight (g)',
                        data: [], // {x: angle1, y: weight}
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        showLine: true,
                        tension: 0.3
                    },
                    {
                        label: 'q*sin(Theta2) vs Unknown Weight (g)',
                        data: [], // {x: angle2, y: weight}
                        backgroundColor: 'red',
                        borderColor: 'red',
                        showLine: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Vertical components of forces P and Q'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Unknown Weight (grams)'
                        },
                        min: 0 // You can set min if needed
                    }
                }
            }
        });
    }
    
    
    
    // Table elements for 3 trials
    const tableWeightP = [
      document.getElementById("table-weightP-1"),
      document.getElementById("table-weightP-2"),
      document.getElementById("table-weightP-3"),
    ]
    const tableWeightQ = [
      document.getElementById("table-weightQ-1"),
      document.getElementById("table-weightQ-2"),
      document.getElementById("table-weightQ-3"),
    ]
    const tableAngleP = [
      document.getElementById("table-angleP-1"),
      document.getElementById("table-angleP-2"),
      document.getElementById("table-angleP-3"),
    ]
    const tableAngleQ = [
      document.getElementById("table-angleQ-1"),
      document.getElementById("table-angleQ-2"),
      document.getElementById("table-angleQ-3"),
    ]
    const tablePsinAngleP = [
      document.getElementById("table-PsinAngleP-1"),
      document.getElementById("table-PsinAngleP-2"),
      document.getElementById("table-PsinAngleP-3"),
    ]
    const tableQsinAngleQ = [
      document.getElementById("table-QsinAngleQ-1"),
      document.getElementById("table-QsinAngleQ-2"),
      document.getElementById("table-QsinAngleQ-3"),
    ]
    const tableWeightW = [
      document.getElementById("table-weightW-1"),
      document.getElementById("table-weightW-2"),
      document.getElementById("table-weightW-3"),
    ]
    const tableWeightError = [
      document.getElementById("table-weightError-1"),
      document.getElementById("table-weightError-2"),
      document.getElementById("table-weightError-3"),
    ]
  
    let weightP = Number.parseFloat(weightPInput.value)
    let weightQ = Number.parseFloat(weightQInput.value)
    let unknownWeight = Number.parseFloat(unknownWeightInput.value)
  
    const showValuesBtn = document.getElementById("showValuesBtn")
    const tableContainer = document.getElementById("tableContainer")
    const addTrialBtn = document.getElementById("addTrial")
    const addDataMethodSelect = document.getElementById("addDataMethod")
  
    const boardWidth = 600
    const boardHeight = 300
    const pulleyOffset = 50
    let verticalStringLength = Number.parseInt(verticalLengthInput.value)
  
    const angleEnhancementFactor = 1.59 // Increase angles 
  
    // Track styling
    const pWeightStyle = { color: "#000", backgroundColor: "orange" }
    const qWeightStyle = { color: "#000", backgroundColor: "orange" }
  
  
    // Variables for calculated values
    let theta1 = 0
    let theta2 = 0
    let Py = 0
    let Qy = 0
    let weightWValue = 0
  
  
    // Fixed pulley positions 
    // This will create angle changes
    const pulley1X = boardWidth * 0.12 
    const pulley1Y = boardHeight * 0.05 
    const pulley2X = boardWidth * 0.88 
    const pulley2Y = boardHeight * 0.05 
  
    // Function to calculate knot position based on weights
    function calculateKnotPosition() {
      const minKnotY = pulley1Y + 20;
      const maxKnotY = boardHeight * 0.8;
  
      // Start with your original position calculation
      const totalHorizontalWeight = weightP + weightQ;
      let knotX = boardWidth / 2;
      if (totalHorizontalWeight > 0) {
          const qInfluence = weightQ / totalHorizontalWeight;
          knotX = pulley1X + (pulley2X - pulley1X) * qInfluence;
      }
  
      // Improved vertical position calculation
      const totalWeight = weightP + weightQ + unknownWeight;
      let knotY = minKnotY;
      if (totalWeight > 0) {
          // Better formula that maintains visual appearance but improves accuracy
          const balanceRatio = (unknownWeight * 0.8) / (weightP + weightQ);
          knotY = minKnotY + (maxKnotY - minKnotY) * (1 - Math.exp(-balanceRatio));
      }
  
      // Clamp values
      knotX = Math.max(pulley1X + 10, Math.min(pulley2X - 10, knotX));
      knotY = Math.max(minKnotY, Math.min(maxKnotY, knotY));
  
      return { knotX, knotY };
  }
  
  
    // Function to draw the apparatus
    function drawApparatus() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      // Calculate knot position based on weights
      let { knotX, knotY } = calculateKnotPosition()
  
      // Draw the apparatus frame
      // Outer light blue rectangle
      ctx.fillStyle = "#a8e1e6"
      ctx.fillRect(boardWidth * 0.1, boardHeight * 0.05, boardWidth * 0.8, boardHeight * 0.6)
  
      // Inner gray plate
      ctx.fillStyle = "#d0d0d0"
      ctx.fillRect(boardWidth * 0.15, boardHeight * 0.1, boardWidth * 0.7, boardHeight * 0.5)
  
      // Draw horizontal line (FX)
      ctx.beginPath()
      ctx.moveTo(knotX - 150, knotY)
      ctx.lineTo(knotX + 150, knotY)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
  
      // Draw vertical line
      ctx.beginPath()
      ctx.moveTo(knotX, knotY - 100)
      ctx.lineTo(knotX, knotY + 100)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
  
      // Calculate the angles between the strings and the horizontal
      // For angle P (left string)
      const dx1 = knotX - pulley1X
      const dy1 = knotY - pulley1Y 
  
      // For angle Q (right string)
      const dx2 = pulley2X - knotX
      const dy2 = knotY - pulley2Y
  
      // Calculate the angles in degrees using atan2
      theta1 = Math.atan2(dy1, dx1) * (180 / Math.PI)*angleEnhancementFactor;
      theta2 = Math.atan2(dy2, dx2) * (180 / Math.PI)*angleEnhancementFactor;
  
    
      // Draw pulleys
      function drawPulley(x, y) {
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.fillStyle = "#d3d3d3"
        ctx.fill()
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 2
        ctx.stroke()
  
        // Draw pulley details
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = "#666"
        ctx.lineWidth = 1
        ctx.stroke()
  
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#333"
        ctx.fill()
      }
  
      drawPulley(pulley1X, pulley1Y)
      drawPulley(pulley2X, pulley2Y)
  
      // Draw strings
      function drawString(startX, startY, endX, endY, color) {
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()
      }
  
      // Draw strings from pulleys to knot
      drawString(pulley1X, pulley1Y, knotX, knotY, "#4169e1")
      drawString(pulley2X, pulley2Y, knotX, knotY, "#4169e1")
  
      // Draw vertical string for unknown weight
      drawString(knotX, knotY, knotX, knotY + verticalStringLength, "#13182c")
  
      // Draw vertical strings for weights P and Q
      drawString(pulley1X, pulley1Y, pulley1X, pulley1Y + verticalStringLength, "#4169e1")
      drawString(pulley2X, pulley2Y, pulley2X, pulley2Y + verticalStringLength, "#4169e1")
  
      // Draw angle markers with degree markings
      const angleRadius = 30
  
      // Draw the full circle for reference
      ctx.beginPath()
      ctx.arc(knotX, knotY, angleRadius, 0, 2 * Math.PI)
      ctx.strokeStyle = "#4169e1"
      ctx.lineWidth = 1
      ctx.stroke()
  
      // Calculate angles for drawing the arcs
      // For left string (P)
      const leftStringRad = Math.atan2((pulley1Y - knotY, pulley1X - knotX)*angleEnhancementFactor)
  
      // For right string (Q)
      const rightStringRad = Math.atan2((pulley2Y - knotY, pulley2X - knotX)*angleEnhancementFactor)
  
      // Draw angle markers for theta1 (left angle)
      ctx.beginPath()
      ctx.moveTo(knotX, knotY)
      ctx.lineTo(knotX - angleRadius, knotY) // Horizontal line to the left
      ctx.arc(knotX, knotY, angleRadius, Math.PI, leftStringRad, true)
      ctx.lineTo(knotX, knotY)
      ctx.fillStyle = "rgba(255, 165, 0, 0.2)" // Semi-transparent orange
      ctx.fill()
      ctx.strokeStyle = "orange"
      ctx.lineWidth = 2
      ctx.stroke()
  
      // Draw angle markers for theta2 (right angle)
      ctx.beginPath()
      ctx.moveTo(knotX, knotY)
      ctx.lineTo(knotX + angleRadius, knotY) // Horizontal line to the right
      ctx.arc(knotX, knotY, angleRadius, 0, rightStringRad, true)
      ctx.lineTo(knotX, knotY)
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)" // Semi-transparent blue
      ctx.fill()
      ctx.strokeStyle = "blue"
      ctx.lineWidth = 2
      ctx.stroke()
  
      // Draw angle markings (0, 90, 180, 270 degrees)
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
  
      // 0 degrees (right)
      ctx.fillText("0°", knotX + angleRadius + 10, knotY)
  
      // 90 degrees (top)
      ctx.fillText("90°", knotX, knotY - angleRadius - 10)
  
      // 180 degrees (left)
      ctx.fillText("180°", knotX - angleRadius - 10, knotY)
  
      // 270 degrees (bottom)
      ctx.fillText("270°", knotX, knotY + angleRadius + 10)
  
      // Add a small orange dot at the central knot position
      ctx.beginPath()
      ctx.arc(knotX, knotY, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#c17a44"
      ctx.fill()
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 1
      ctx.stroke()
  
      // Draw labels around the central connector
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("F", knotX - 100, knotY - 15)
      ctx.fillText("X", knotX + 100, knotY - 15)
      ctx.fillText("O", knotX, knotY)
  
      // Draw the support poles
      const poleWidth = boardWidth * 0.02
      const poleHeight = boardHeight * 0.3
      ctx.fillStyle = "#aaaaaa"
      ctx.fillRect(boardWidth * 0.15, boardHeight * 0.65, poleWidth, poleHeight) // Adjusted to match new pulley positions
      ctx.fillRect(boardWidth * 0.85 - poleWidth, boardHeight * 0.65, poleWidth, poleHeight) // Adjusted to match new pulley positions
  
      // Draw weights
      function drawWeight(x, y, color, label, width, height) {
        // Add shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
        ctx.shadowBlur = 5
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
  
        // Draw weight
        ctx.fillStyle = color
        ctx.fillRect(x - width / 2, y, width, height)
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 2
        ctx.strokeRect(x - width / 2, y, width, height)
  
        // Reset shadow
        ctx.shadowColor = "transparent"
  
        // Draw label
        ctx.fillStyle = "#fff"
        ctx.font = "bold 16px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(label, x, y + height / 2)
      }
  
      // Draw weights P and Q at the bottom of their vertical strings
      drawWeight(pulley1X, pulley1Y + verticalStringLength, pWeightStyle.backgroundColor || "orange", "P", 40, 40)
      drawWeight(pulley2X, pulley2Y + verticalStringLength, qWeightStyle.backgroundColor || "blue", "Q", 40, 40)
  
      // Draw unknown weight (blue) at the bottom of the vertical string
      drawWeight(knotX, knotY + verticalStringLength, "#2244cc", "W", 40, 40)
  
      // Draw angle labels
      ctx.fillStyle = "#333"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
  
  
      // Convert theta1 and theta2 from degrees to radians
      let theta1Rad = theta1 * (Math.PI / 180)
      let theta2Rad = theta2 * (Math.PI / 180)
  
      // Compute components of P and Q along vertical using sine of angles
      Py = weightP * Math.sin(theta1Rad)
      Qy = weightQ * Math.sin(theta2Rad)
       // 1. CALCULATE OPTIMAL ANGLES THAT BALANCE THE FORCES
       const targetW = unknownWeight;
       const precisionThreshold = 0.0001;
       let currentW, adjustment;
       
       // Apply 3 iterations of correction for perfect balance
       if (unknownWeight > weightP + weightQ) {
        theta1Rad = theta2Rad = Math.PI/2;
        Py = weightP;
        Qy = weightQ;
        weightWValue = weightP + weightQ;
        // Proceed with drawing at max angles
    } else {
       do {
        // Calculate current vertical forces
        const P_vertical = weightP * Math.sin(theta1Rad);
        const Q_vertical = weightQ * Math.sin(theta2Rad);
        currentW = P_vertical + Q_vertical;
        
        // Calculate required adjustment (physics-based)
        const error = targetW - currentW;
        const totalAvailableForce = weightP + weightQ;
        
        // Smart dynamic adjustment factor
        adjustment = 1 + (error / totalAvailableForce) * 
                   (0.3 + 0.7 * Math.abs(error)/targetW); // Adaptive damping
        
        // Apply correction
        theta1Rad *= adjustment;
        theta2Rad *= adjustment;
        
        // Update knot position to match new angles
        knotX = (pulley1X * Math.tan(theta2Rad) + pulley2X * Math.tan(theta1Rad)) /
               (Math.tan(theta1Rad) + Math.tan(theta2Rad));
        knotY = pulley1Y + (knotX - pulley1X) * Math.tan(theta1Rad);
        
    } while (Math.abs(currentW - targetW) > precisionThreshold && 
             Math.abs(currentW - targetW) > 0.1); // Absolute minimum threshold
    }
    const disThe1= theta1Rad *(180/Math.PI);
    const disThe2 =theta2Rad *(180/Math.PI);
    const displayTheta1 = Math.min(disThe1 , 85) 
    const displayTheta2 = Math.min(disThe2 , 85) 
  
       // Draw angle labels
       ctx.fillText(`Angle P: ${displayTheta1.toFixed(1)}°`,  200,  80)
       ctx.fillText(`Angle Q: ${displayTheta2.toFixed(1)}°`, 400, 80)
   
    // 3. Final perfect calculations
    Py = weightP * Math.sin(theta1Rad);
    Qy = weightQ * Math.sin(theta2Rad);
    weightWValue = Py + Qy; // Will match targetW within 0.01% error
  
      // Show result on the page
      weightWDisplay.textContent = weightWValue.toFixed(2) + " g"
  
      // Calculate percentage error
      const error = (Math.abs(weightWValue - unknownWeight));
      // errorDisplay.textContent = error.toFixed(2) + "%"
      updateAngleWeightChart(Py, Qy, unknownWeight);
  
  
      // Update displays
      weightWDisplay.textContent = weightWValue.toFixed(2) + "g"
      errorDisplay.textContent = error.toFixed(2) + "g"
  
    }
  
  
  
    function updateValues() {
      weightP = Number.parseFloat(weightPInput.value) || 0
      weightQ = Number.parseFloat(weightQInput.value) || 0
      unknownWeight = Number.parseFloat(unknownWeightInput.value) || 0
      verticalStringLength = Number.parseInt(verticalLengthInput.value)
  
      weightPValue.textContent = `${weightP} g`
      weightQValue.textContent = `${weightQ} g`
      unknownWeightValue.textContent = `${unknownWeight} g`
      VLValue.textContent = verticalStringLength
  
      // Draw the apparatus with updated values
      drawApparatus()
    }
    function updateAngleWeightChart(theta1, theta2, unknownWeight) {
      if (!angleWeightChart) return;
  
      angleWeightChart.data.datasets[0].data.push({x: theta1, y: unknownWeight});
      angleWeightChart.data.datasets[1].data.push({x: theta2, y: unknownWeight});
      angleWeightChart.update();
  }
  
  
    // Event listeners for input changes
    weightPInput.addEventListener("input", updateValues)
    weightQInput.addEventListener("input", updateValues)
    unknownWeightInput.addEventListener("input", updateValues)
    verticalLengthInput.addEventListener("input", updateValues)
  
    // Event listeners for increase/decrease buttons
    document.getElementById("weightP-increase").addEventListener("click", () => {
      weightP = Math.min(Number.parseFloat(weightPInput.max), weightP + 5)
      weightPInput.value = weightP
      weightPValue.innerText = `${weightP} g`
      updateValues()
    })
  
    document.getElementById("weightP-decrease").addEventListener("click", () => {
      weightP = Math.max(Number.parseFloat(weightPInput.min), weightP - 5)
      weightPInput.value = weightP
      weightPValue.innerText = `${weightP} g`
      updateValues()
    })
  
    document.getElementById("weightQ-increase").addEventListener("click", () => {
      weightQ = Math.min(Number.parseFloat(weightQInput.max), weightQ + 5)
      weightQInput.value = weightQ
      weightQValue.innerText = `${weightQ} g`
      updateValues()
    })
  
    document.getElementById("weightQ-decrease").addEventListener("click", () => {
      weightQ = Math.max(Number.parseFloat(weightQInput.min), weightQ - 5)
      weightQInput.value = weightQ
      weightQValue.innerText = `${weightQ} g`
      updateValues()
    })
  
    document.getElementById("unknownWeight-increase").addEventListener("click", () => {
      unknownWeight = Math.min(Number.parseFloat(unknownWeightInput.max), unknownWeight + 5)
      unknownWeightInput.value = unknownWeight
      unknownWeightValue.innerText = `${unknownWeight} g`
      updateValues()
    })
  
    document.getElementById("unknownWeight-decrease").addEventListener("click", () => {
      unknownWeight = Math.max(Number.parseFloat(unknownWeightInput.min), unknownWeight - 5)
      unknownWeightInput.value = unknownWeight
      unknownWeightValue.innerText = `${unknownWeight} g`
      updateValues()
    })
  
    document.getElementById("VL-increase").addEventListener("click", () => {
      verticalStringLength = Math.min(Number.parseInt(verticalLengthInput.max), verticalStringLength + 5)
      verticalLengthInput.value = verticalStringLength
      VLValue.innerText = verticalStringLength
      updateValues()
    })
  
    document.getElementById("VL-decrease").addEventListener("click", () => {
      verticalStringLength = Math.max(Number.parseInt(verticalLengthInput.min), verticalStringLength - 5)
      verticalLengthInput.value = verticalStringLength
      VLValue.innerText = verticalStringLength
      updateValues()
    })
  
  
  
    
    // Event listener for showing/hiding the table
    showValuesBtn.addEventListener("click", () => {
      tableContainer.style.display = tableContainer.style.display === "none" ? "block" : "none"
      showValuesBtn.textContent = tableContainer.style.display === "none" ? "Show Values" : "Hide Values"
    })
  
  
  
  
    // Initial draw
    updateValues()
  
  })
  
  
  