// Selecting Elements
const profileBtn = document.getElementById('profile-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle Dropdown Menu on Click
profileBtn.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
});

// Close Dropdown Menu on Outside Click
document.addEventListener('click', (e) => {
  if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('active');
  }
});

// Select elements
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

// Add click event listener to the hamburger
hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});
  