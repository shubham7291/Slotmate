function confirmLogout() {
    const isConfirmed = confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      // Redirect to the login page
      window.location.href = "postoffice-Login.html";
    }
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
  
  