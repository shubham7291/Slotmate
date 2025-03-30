// Function to handle logout
function logout() {
    localStorage.removeItem('token'); 
    localStorage.removeItem('phoneNumber');// Remove the JWT token from local storage
    setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
}

// Add logout functionality to the logout button
document.getElementById('logoutBtn').addEventListener('click', logout);
// document.getElementById('logoutBtn1').addEventListener('click', logout);
