document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById('register-btn');
  const signupMessage = document.getElementById("signupMessage");
  const container = document.getElementById('container');
  const redirect = document.getElementById('redirectlogin');
  const close = document.getElementById('closepopup');

  // Function to show the popup
  function showPopup() {
      const popup = document.getElementById("popup");
      popup.style.display = "flex"; // Show popup
  }

  

  signupForm.addEventListener("click", async (e) => {
      e.preventDefault();

      const phoneNumber = document.getElementById("new-username").value;
      const email = document.getElementById("new-email").value;
      const password = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      // Clear any previous messages
      signupMessage.textContent = '';

      if (password !== confirmPassword) {
          signupMessage.textContent = "Passwords do not match!";
          signupMessage.style.color = "red";
          return;
      }

      try {
          const response = await fetch("http://localhost:5000/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phoneNumber, email, password }),
          });

          const data = await response.json();

          if (response.ok) {
              signupMessage.textContent = "Registration successful!";
              signupMessage.style.color = "green";
              showPopup();  // Show success popup on success
          } else {
              signupMessage.textContent = data.message || "Registration failed!";
              signupMessage.style.color = "red";
          }
      } catch (error) {
          signupMessage.textContent = "Error: Could not connect to server.";
          signupMessage.style.color = "red";
          console.error("Error:", error);
      }
  });
});
