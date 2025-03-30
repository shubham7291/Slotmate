function openForm() {
    // Reset the form and hide success message if already shown
    resetForm();
    document.getElementById('consignmentForm').classList.remove('hidden');
}

function resetForm() {
    // Reset the form inputs and hide success message
    document.getElementById('consignmentForm').reset();
    document.getElementById('successMessage').classList.add('hidden');
}
function closeForm() {
    document.getElementById('consignmentForm').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
}

function reset(){
    const dropdown = document.getElementById('timeSlotDropdown');
    dropdown.disabled = false;
    const recommendedButton = document.getElementById('recommendedButton');
    recommendedButton.disabled = false;
}
function nextSection(current, next) {
    // Hide the current section and show the next section
    document.getElementById(current).classList.add('hidden');
    document.getElementById(next).classList.remove('hidden');

}

function previousSection(current, previous) {
    // Hide the current section and show the previous section
    document.getElementById(current).classList.add('hidden');
    document.getElementById(previous).classList.remove('hidden');
}

    function handleRecommendedSelection() {
      const dropdown = document.getElementById('timeSlotDropdown');
      dropdown.disabled = true;
      document.getElementById("selectedslot").innerText = document.getElementById('recommendedButton').textContent.trim();
    }

    function handleDropdownChange() {
      const recommendedButton = document.getElementById('recommendedButton');
      recommendedButton.disabled = true;
      const dropdown = document.getElementById('timeSlotDropdown');
      document.getElementById("selectedslot").innerText = dropdown.value;
    }


  function calculateDeliveryDays() {
    const distance = localStorage.getItem('distance');
    let days;

    if (distance) {
      const dist = parseFloat(distance);
        console.log(dist);  
      if (dist <= 25) {
        days = 1;
      } else if (dist > 25 && dist <= 150) {
        days = 2;
      } else if (dist > 150 && dist <= 300) {
        days = 3;
      } else {
        days = 5;
      }
      console.log(days);
      return days;
    } else {
      alert('Distance is not available in local storage.');
      return null;
    }
  }

  function populatePickupDates() {
    nextSection('receiverDetails', 'pickupDetails')
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const pickupDateSelect = document.getElementById('pickupDate');
    pickupDateSelect.innerHTML = `
      <option value="${tomorrow.toISOString().split('T')[0]}">Tomorrow (${tomorrow.toDateString()})</option>
      <option value="${dayAfterTomorrow.toISOString().split('T')[0]}">Day After Tomorrow (${dayAfterTomorrow.toDateString()})</option>
    `;
  }

  function showDeliveryDate() {
    calculateDistance(document.getElementById("senderPincode").value.trim(), document.getElementById("receiverPincode").value.trim());
    nextSection('pickupDetails', 'recommendedSlot')
    const daysToDeliver = calculateDeliveryDays();
    console.log(daysToDeliver);
    if (daysToDeliver !== null) {
      const pickupDateValue = document.getElementById('pickupDate').value;
      const pickupDate = new Date(pickupDateValue);
      console.log(pickupDate);
      const deliveryDate = new Date(pickupDate);
      console.log(deliveryDate);
      deliveryDate.setDate(pickupDate.getDate() + daysToDeliver);
      console.log(deliveryDate);
      document.getElementById('DeliveryDatet').value = deliveryDate.toDateString();
    }
  }


function resetForm() {
    // Reset all input fields and show the first section
    document.getElementById('senderDetails').classList.remove('hidden');
    document.getElementById('receiverDetails').classList.add('hidden');
    document.getElementById('pickupDetails').classList.add('hidden');

    const inputs = document.querySelectorAll('#consignmentForm input, #consignmentForm select');
    inputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            input.value = '';
        }
    });

    
}

// Function to validate the pincode (sender or receiver)
function validatePincode(type) {
    const pincodeInput = document.getElementById(`${type}Pincode`);
    const pincode = pincodeInput.value.trim();

    if (!pincode) {
        alert("Please enter a pincode.");
        return;
    }

    // Show loading overlay while fetching data
    document.getElementById("loadingOverlay").classList.remove("hidden");
    document.getElementById("loadingOverlayr").classList.remove("hidden");

    // Validate Pincode API call
    fetch("http://localhost:3000/validate_pincode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pincode })
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading overlay
        

        if (data.valid) {
            // Pincode is valid, now fetch pincode details
            fetchPincodeDetails(pincode, type);
        } else {
            // Pincode is invalid
            document.getElementById("loadingOverlay").classList.add("hidden");
            document.getElementById("loadingOverlayr").classList.add("hidden");
            alert("Invalid pincode entered. Please try again.");

        }
    })
    .catch(error => {
        // Hide loading overlay and show error message
        document.getElementById("loadingOverlay").classList.add("hidden");
        document.getElementById("loadingOverlayr").classList.add("hidden");
        alert("Error validating pincode. Please try again later.");
        console.error(error);
    });
}

// Function to fetch pincode details and populate PostOffice, State, and District
function fetchPincodeDetails(pincode, type) {
    fetch("http://localhost:3000/get_pincode_details", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pincode })
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0 && data[0].PostOffice) {
            const postOffices = data[0].PostOffice;
            const postOfficeSelect = document.getElementById(`${type}PostOffice`);
            const stateInput = document.getElementById(`${type}State`);
            const districtInput = document.getElementById(`${type}District`);

            // Clear previous options
            postOfficeSelect.innerHTML = "";

            // Populate the post office dropdown
            postOffices.forEach(postOffice => {
                const option = document.createElement("option");
                option.value = postOffice.Name;
                option.textContent = postOffice.Name;
                postOfficeSelect.appendChild(option);
            });

            // Disable the state and district fields initially
            stateInput.value = postOffices[0].State;
            districtInput.value = postOffices[0].District;

            // Make these fields uneditable
            stateInput.disabled = true;
            districtInput.disabled = true;

            // Optionally, you could listen for changes in the post office dropdown if you want to update state/district dynamically
            postOfficeSelect.addEventListener('change', function() {
                const selectedPostOffice = postOffices.find(post => post.Name === this.value);
                stateInput.value = selectedPostOffice.State;
                districtInput.value = selectedPostOffice.District;
            });
            document.getElementById("loadingOverlay").classList.add("hidden");
            document.getElementById("loadingOverlayr").classList.add("hidden");

        } else {
            alert("No post office details found for this pincode.");
        }
    })
    .catch(error => {
        alert("Error fetching pincode details. Please try again later.");
        console.error(error);
    });
}

function calculateDistance(pincode1, pincode2) {
    // Call the Flask backend
    fetch("http://localhost:3000/calculate_distance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pincode1, pincode2 })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to calculate distance. Please try again later.");
        }
    })
    .then(data => {
        try {
            console.log(data)
            localStorage.setItem("distance", data.distance);
        } 
        catch (err) {
           console.log(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

