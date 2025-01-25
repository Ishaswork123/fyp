document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("communityModal");
  const btn = document.getElementById("communityLink");
  const closeButtons = document.getElementsByClassName("close");
  const createNewCommunityCheckbox = document.getElementById('createNewCommunityCheckbox');
  const createCommunityFields = document.getElementById('createCommunityFields');

  // Open modal
  btn.onclick = function () {
      modal.style.display = "block";
  };

  // Close modal on click of any close button
  Array.from(closeButtons).forEach(button => {
      button.onclick = function () {
          modal.style.display = "none";
      };
  });

  // Close modal on clicking outside of it
  window.onclick = function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  };

  // Toggle Create Community Fields
  createNewCommunityCheckbox.addEventListener('change', (event) => {
      createCommunityFields.style.display = event.target.checked ? 'block' : 'none';
  });

  // Populate room dropdown
  fetch('/rooms')
      .then(response => response.json())
      .then(rooms => {
          const roomSelect = document.getElementById('room');
          rooms.forEach(room => {
              const option = document.createElement('option');
              option.value = room;
              option.innerText = room;
              roomSelect.appendChild(option);
          });
      })
      .catch(error => console.error("Error fetching rooms:", error));
      const experiment1Link = document.getElementById('openExperiment1');
  const experiment2Link = document.getElementById('openExperiment2');
  const expmodal = document.getElementById('modal');
  const closeButton = document.querySelector('.modal .close');

  // Open the modal when Experiment 1 or Experiment 2 is clicked
  experiment1Link.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    expmodal.style.display = 'block'; // Show modal
  });

  experiment2Link.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    expmodal.style.display = 'block'; // Show modal
  });

  // Close the modal when clicking on the close button
  closeButton.addEventListener('click', () => {
    expmodal.style.display = 'none'; // Hide modal
  });

  // Close the modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      expmodal.style.display = 'none'; // Hide modal if clicked outside content
    }
  });
});

// JavaScript to Handle Modal Display
document.getElementById('openModalButton').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('modal').style.display = 'block';
});

// Close Modal on Close Button Click
document.querySelector('.modal-content .close').addEventListener('click', function () {
  document.getElementById('modal').style.display = 'none';
});

// Close Modal When Clicking Outside Content
window.addEventListener('click', function (e) {
  if (e.target.id === 'modal') {
    document.getElementById('modal').style.display = 'none';
  }
});

