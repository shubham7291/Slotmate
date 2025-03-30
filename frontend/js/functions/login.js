document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-btn");
  const loadingAnimation = document.getElementById("loadingAnimation"); // Assuming there's a loading animation element

  // Function to show/hide loading animation
  function toggleLoading(show) {
      if (loadingAnimation) {
          loadingAnimation.style.display = show ? "block" : "none";
      }
  }

  // Form submission handler
  loginForm.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      toggleLoading(true); // Show loading animation

      try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
              console.log("Login successful! Token:", data.token);
              localStorage.setItem("token", data.token);
              localStorage.setItem("phoneNumber", data.phoneNumber);
              setTimeout(() => {
                  window.location.href = "dashboard.html";
              }, 2000);
          } else {
              console.error(data.message || "Login failed!");
          }
      } catch (error) {
          console.error("Error: Could not connect to server.", error);
      } finally {
          toggleLoading(false); // Hide loading animation
      }
  });
});
