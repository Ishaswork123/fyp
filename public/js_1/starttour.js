// Tour functionality
function startTour() {
  // Create overlay
  const overlay = document.createElement("div")
  overlay.className = "tour-overlay"
  document.body.appendChild(overlay)

  // Create navigation buttons
  const navigation = document.createElement("div")
  navigation.className = "tour-navigation"

  const prevBtn = document.createElement("button")
  prevBtn.textContent = "Previous"

  const nextBtn = document.createElement("button")
  nextBtn.textContent = "Next"

  const closeBtn = document.createElement("button")
  closeBtn.textContent = "Close Tour"

  navigation.appendChild(prevBtn)
  navigation.appendChild(nextBtn)
  navigation.appendChild(closeBtn)
  document.body.appendChild(navigation)

  // Get all tooltip elements
  const tooltipElements = document.querySelectorAll("[data-tooltip]")
  let currentStep = 0

  // Function to show a specific step
  function showStep(step) {
    // Remove active class and highlight from all elements
    tooltipElements.forEach((el) => {
      el.classList.remove("active")
      el.classList.remove("tooltip-highlight")
    })

    // If step is valid, show it
    if (step >= 0 && step < tooltipElements.length) {
      const element = tooltipElements[step]
      element.classList.add("active")
      element.classList.add("tooltip-highlight")

      // Scroll element into view
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })

      // If the element is the table and it's hidden, show it
      const toggleTableBtn = document.getElementById("toggleTableBtn")
      if (element.id === "experimentTable" && element.style.display === "none") {
        toggleTableBtn.click()
      }

      currentStep = step
    }

    // Update button states
    prevBtn.disabled = currentStep === 0
    nextBtn.disabled = currentStep === tooltipElements.length - 1
  }

  // Event listeners for navigation
  prevBtn.addEventListener("click", () => {
    showStep(currentStep - 1)
  })

  nextBtn.addEventListener("click", () => {
    showStep(currentStep + 1)
  })

  closeBtn.addEventListener("click", () => {
    // Clean up
    tooltipElements.forEach((el) => {
      el.classList.remove("active")
      el.classList.remove("tooltip-highlight")
    })

    document.body.removeChild(overlay)
    document.body.removeChild(navigation)
  })

  // Start with the first step
  showStep(0)
}
