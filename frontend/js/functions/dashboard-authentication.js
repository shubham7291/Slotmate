// Function to check if the user is authenticated by verifying JWT token

function isAuthenticated() {
  const token = localStorage.getItem('token');
  console.log(token);
  return token && token !== 'null' && token !== '';
}

// Function to decode and get user information from the token (using jwt-decode)
function getUserFromToken() {
  const token = localStorage.getItem('token');
  
  if (!token) return null;
  try {
      const decoded = jwt_decode(token); // Decode JWT token
      
      return decoded;
  } catch (error) {
      console.error('Invalid token', error);
      return null;
  }
}

// Function to display user info on the dashboard
function displayUserInfo() {
  const user = getUserFromToken();
  if (!user) {
    console.log("redirecting to login")
      window.location.href = 'login.html';
      // If user is authenticated, display the username
      // document.getElementById('welcomeMessage').textContent = `Welcome, User`;
  } 
}
// Check if the user is authenticated when the page loads
displayUserInfo();