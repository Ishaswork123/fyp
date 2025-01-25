document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const password = document.getElementById('pwd');
  const confirmPassword = document.getElementById('confirm_pwd');
  const passwordRegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
//   document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('signupForm');
//     form.reset(); // Clears all input fields
// });
  // Real-time validation for passwords
  form.addEventListener('input', () => {
      // Confirm Password Match
      if (password.value !== confirmPassword.value) {
          confirmPassword.style.borderColor = 'red';
      } else {
          confirmPassword.style.borderColor = 'green';
      }

      // Password Strength
      if (!passwordRegExp.test(password.value)) {
          password.style.borderColor = 'red';
      } else {
          password.style.borderColor = 'green';
      }
  });

  // Prevent form submission if validation fails
  form.addEventListener('submit', (event) => {
      if (password.value !== confirmPassword.value) {
          event.preventDefault();
          alert('Passwords do not match!');
      } else if (!passwordRegExp.test(password.value)) {
          event.preventDefault();
          alert('Password must include at least 8 characters, one uppercase letter, one number, and one special character.');
      }
  });
});
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("confirm_pwd");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");}
    else if(passwordInput.type === "confirm_pwd") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");}
   else {
    passwordInput.type = "password";
    passwordInput.type = "confirm_pwd";

    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}
