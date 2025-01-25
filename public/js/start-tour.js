document.addEventListener("DOMContentLoaded", () => {
    const startTourBtn = document.getElementById("startTourBtn");
    const tourContainer = document.getElementById("tourContainer");
    const allContent = document.querySelectorAll("body > *:not(#tourContainer)");
  
    // Show the Start Tour button and blur other elements
    function showTourButton() {
      tourContainer.classList.add("active");
      allContent.forEach(element => element.classList.add("blur"));
    }
  
    // Hide the Start Tour button and remove blur effect
    function hideTourButton() {
      tourContainer.classList.remove("active");
      allContent.forEach(element => element.classList.remove("blur"));
    }
  
    // Trigger the tour
    startTourBtn.addEventListener("click", () => {
      hideTourButton();
      introJs().start();
    });
  
    showTourButton();  
  });
  