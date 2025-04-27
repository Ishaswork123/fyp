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
    // For elements with data-tooltip
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', (e) => {
    const rect = e.target.getBoundingClientRect();
    tooltip.textContent = e.target.dataset.tooltip;
    tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    tooltip.classList.add('active');
  });
  
  el.addEventListener('mouseleave', () => {
    tooltip.classList.remove('active');
  });
});


  
    showTourButton();  
  });
  