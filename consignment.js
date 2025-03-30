const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Section 1: Handle 'Next' Button click to move to Section 2
function goToSection2() {
    // Validation for Section 1
    const senderName = document.getElementById('sender-name').value;
    const receiverName = document.getElementById('receiver-name').value;
  
    if (!senderName || !receiverName) {
      alert('Please fill in all fields for Sender and Receiver details.');
      return;
    }
  
    // Proceed to Section 2
    document.getElementById('section-1').style.display = 'none';
    document.getElementById('section-2').style.display = 'block';
    populatePickupTimes();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const pickupTime = document.getElementById("pickup-time");
    const pickupDate = document.getElementById("pickup-date");
  
    // Populate time slots dynamically (3-hour intervals)
    const timeSlots = [
      { start: 9, end: 12 },
      { start: 12, end: 15 },
      { start: 15, end: 18 },
      { start: 18, end: 21 },
    ];
  
    timeSlots.forEach((slot) => {
      const start = `${slot.start} ${slot.start < 12 ? "AM" : "PM"}`;
      const end = `${slot.end % 12 || 12} ${slot.end < 12 ? "AM" : "PM"}`;
      const option = document.createElement("option");
      option.value = `${slot.start}-${slot.end}`;
      option.textContent = `${start} - ${end}`;
      pickupTime.appendChild(option);
    });
  
    // Date picker logic based on the current time
    const today = new Date();
    const nowHour = today.getHours();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    // Allow same-day scheduling if booked before 3 PM
    if (nowHour < 15) {
      const formattedToday = today.toISOString().split("T")[0];
      pickupDate.min = formattedToday;
      pickupDate.value = formattedToday;
    } else {
      // Restrict to next day if booking after 3 PM
      const formattedTomorrow = tomorrow.toISOString().split("T")[0];
      pickupDate.min = formattedTomorrow;
      pickupDate.value = formattedTomorrow;
    }
  
    // Listen for time changes to ensure validation
    pickupDate.addEventListener("change", () => {
      const selectedDate = new Date(pickupDate.value);
      if (selectedDate < today && nowHour >= 15) {
        alert("Booking for today is only allowed before 3 PM. Please select a valid date.");
        pickupDate.value = tomorrow.toISOString().split("T")[0];
      }
    });
  });
  
  // Section 2: Handle 'Next' Button to move to Section 3
  function goToSection3() {
    const pickupTime = document.getElementById('pickup-time').value;
    if (!pickupTime) {
      alert('Please select a pickup time.');
      return;
    }
  
    // Estimate Delivery Day and Price
    const estimatedPrice = 100; // Dummy Price
    const estimatedDay = new Date();
    estimatedDay.setDate(estimatedDay.getDate() + 2); // Assuming 2 days for delivery
  
    document.getElementById('estimated-day').value = estimatedDay.toLocaleDateString();
    document.getElementById('estimated-price').value = `₹${estimatedPrice}`;
  
    // Proceed to Section 3
    document.getElementById('section-2').style.display = 'none';
    document.getElementById('section-3').style.display = 'block';
  }

  // Function to toggle between AI and Manual Time Slot
function toggleTimeSlotInput(isAI) {
    const aiTimeSlotDiv = document.getElementById('ai-time-slot');
    const manualTimeSlotDiv = document.getElementById('manual-time-slot');
  
    if (isAI) {
      aiTimeSlotDiv.style.display = 'block';  // Show AI time slot
      manualTimeSlotDiv.style.display = 'none';  // Hide manual time slot
    } else {
      aiTimeSlotDiv.style.display = 'none';  // Hide AI time slot
      manualTimeSlotDiv.style.display = 'block';  // Show manual time slot
    }
  }

  
  

  
  