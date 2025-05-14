document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    // Get all form fields
    const fnameInput = document.getElementById('fname');
    const lnameInput = document.getElementById('lname');
    const emailInput = document.getElementById('email');
    const pwdInput = document.getElementById('pwd');
    const confirmPwdInput = document.getElementById('confirm_pwd');
    
    // Add validation functions
    function validateName(input, fieldName) {
      const value = input.value.trim();
      const nameRegex = /^[A-Za-z\s'-]+$/;
      const repeatedCharRegex = /^([a-zA-Z])\1+$/;
      
      // Remove any existing error
      removeError(input);
      
      // Check if empty
      if (!value) {
        showError(input, `${fieldName} is required`);
        return false;
      }
      
      // Check if valid characters
      if (!nameRegex.test(value)) {
        showError(input, `${fieldName} must contain only letters, spaces, hyphens or apostrophes`);
        return false;
      }
      
      // Check for repeated characters
      if (repeatedCharRegex.test(value)) {
        showError(input, `${fieldName} cannot be made of a single repeated letter`);
        return false;
      }
      
      return true;
    }
    
    function validateEmail(input) {
      const value = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      removeError(input);
      
      if (!value) {
        showError(input, 'Email is required');
        return false;
      }
      
      if (!emailRegex.test(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
      }
      
      return true;
    }
    
    function validatePassword(input) {
      const value = input.value;
      
      removeError(input);
      
      if (!value) {
        showError(input, 'Password is required');
        return false;
      }
      
      if (value.length < 6) {
        showError(input, 'Password must be at least 6 characters long');
        return false;
      }
      
      return true;
    }
    
    function validateConfirmPassword(input, passwordInput) {
      const confirmValue = input.value;
      const passwordValue = passwordInput.value;
      
      removeError(input);
      
      if (!confirmValue) {
        showError(input, 'Please confirm your password');
        return false;
      }
      
      if (confirmValue !== passwordValue) {
        showError(input, 'Passwords do not match');
        return false;
      }
      
      return true;
    }
    
    // Helper functions to show/remove errors
    function showError(input, message) {
      // Remove any existing error first
      removeError(input);
      
      // Add is-invalid class to the input
      input.classList.add('is-invalid');
      
      // Create error message element
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-text';
      errorDiv.textContent = message;
      
      // Insert error after the input container
      const parentGroup = input.closest('.group');
      
      // If input is inside an input-container (for password fields)
      const inputContainer = input.closest('.input-container');
      if (inputContainer) {
        inputContainer.insertAdjacentElement('afterend', errorDiv);
      } else {
        // Otherwise insert after the input itself
        input.insertAdjacentElement('afterend', errorDiv);
      }
    }
    
    function removeError(input) {
      // Remove is-invalid class
      input.classList.remove('is-invalid');
      
      // Find and remove any existing error message
      const parentGroup = input.closest('.group');
      const existingError = parentGroup.querySelector('.error-text');
      if (existingError) {
        existingError.remove();
      }
    }
    
    // Add event listeners for real-time validation
    fnameInput.addEventListener('blur', function() {
      validateName(fnameInput, 'First name');
    });
    
    lnameInput.addEventListener('blur', function() {
      validateName(lnameInput, 'Last name');
    });
    
    emailInput.addEventListener('blur', function() {
      validateEmail(emailInput);
    });
    
    pwdInput.addEventListener('blur', function() {
      validatePassword(pwdInput);
      // If confirm password is not empty, validate it again
      if (confirmPwdInput.value) {
        validateConfirmPassword(confirmPwdInput, pwdInput);
      }
    });
    
    confirmPwdInput.addEventListener('blur', function() {
      validateConfirmPassword(confirmPwdInput, pwdInput);
    });
    
    // Add form submit event listener
    signupForm.addEventListener('submit', function(event) {
      // Validate all fields
      const isFirstNameValid = validateName(fnameInput, 'First name');
      const isLastNameValid = validateName(lnameInput, 'Last name');
      const isEmailValid = validateEmail(emailInput);
      const isPasswordValid = validatePassword(pwdInput);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPwdInput, pwdInput);
      
      // If any validation fails, prevent form submission
      if (!isFirstNameValid || !isLastNameValid || !isEmailValid || 
          !isPasswordValid || !isConfirmPasswordValid) {
        event.preventDefault();
      }
    });
    
    // Toggle password visibility
    // const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    // togglePasswordButtons.forEach(button => {
    //   button.addEventListener('click', function() {
    //     const input = this.previousElementSibling;
    //     const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    //     input.setAttribute('type', type);
    //     this.classList.toggle('fa-eye');
    //     this.classList.toggle('fa-eye-slash');
    //   });
    // });
  });