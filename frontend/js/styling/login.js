const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});



// Toggle Password visibility for Login Form


function togglePassword() {
    var passwordField = document.getElementById('password');
    var toggleIcon = document.getElementById('toggle-password');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';  // Show password
      toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');  // Change to eye-slash icon
    } else {
      passwordField.type = 'password';  // Hide password
      toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');  // Change back to eye icon
    }
  }
  
  // Toggle Password visibility for Register Form
  function togglePasswordRegister() {
    var passwordField = document.getElementById('new-password');
    var toggleIcon = document.getElementById('toggle-register-password');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';  // Show password
      toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');  // Change to eye-slash icon
    } else {
      passwordField.type = 'password';  // Hide password
      toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');  // Change back to eye icon
    }
  }

  function toggleConfirmPassword() {
    var passwordField = document.getElementById('confirm-password');
    var toggleIcon = document.getElementById('toggle-confirm-password');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';  // Show password
      toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');  // Change to eye-slash icon
    } else {
      passwordField.type = 'password';  // Hide password
      toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');  // Change back to eye icon
    }
  }
  
  // Show Register Form and Hide Login Form
  // Function to show the Login form and its instructions
// Function to show the Login form and its instructions
// Function to show the Login form and its instructions
function showLogin() {
    // Hide Register Form and Instructions
    document.getElementById('register-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'block';

    // Update Left Section Title for Login
    document.getElementById('left-title').textContent = 'Welcome Back!';

    // Default Instructions for Login
    const loginInstructions = `
        <p>Please follow these steps to log in:</p>
        <ul>
            <li>Enter your <strong>username</strong> that you registered with.</li>
            <li>Enter your <strong>password</strong> to access your account.</li>
            <li>If you forgot your password, click the <strong>"Forgot Password?"</strong> link to reset it.</li>
            <li>If your credentials are correct, click <strong>"Login"</strong> to access your account.</li>
        </ul>
    `;
    document.getElementById('left-instructions').innerHTML = loginInstructions;

    // Update Register Link to go to Registration Form
    document.getElementById('register-link').innerHTML = `Don't have an account yet? <a href="#" onclick="showRegister()">Register here</a>`;
}

// Function to show the Register form and its instructions
function showRegister() {
    // Hide Login Form and Instructions
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';

    // Update Left Section Title for Register
    document.getElementById('left-title').textContent = 'Create Your Account';

    // Update Left Section Instructions for Register
    const registerInstructions = `
        <p>Please follow these steps to register for a new account:</p>
        <ul>
            <li>Choose a unique <strong>username</strong> that you will use to log in.</li>
            <li>Enter a valid <strong>email address</strong> for account verification and communication.</li>
            <li>Create a strong <strong>password</strong> (at least 8 characters, including letters, numbers, and special symbols).</li>
            <li>Confirm your password by re-entering it in the <strong>"Confirm Password"</strong> field to avoid typos.</li>
            <li>After filling in all details, press the <strong>"Register"</strong> button to create your account.</li>
        </ul>
    `;
    document.getElementById('left-instructions').innerHTML = registerInstructions;

    // Update Register Link to go back to Login
    document.getElementById('register-link').innerHTML = `Already have an account? <a href="#" onclick="showLogin()">Login here</a>`;
}

// Ensure that the login form is displayed by default when the page loads
window.onload = function() {
    showLogin(); // Automatically show the login instructions on page load
};
