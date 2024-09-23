// alert('g')

console.log(window.calculateBestCarpoolRoute);

let placeSelected = false;
let selectedPlace = null;
let map; // Variable to hold the map instance

// JavaScript to handle showing and hiding sections
function showSection(sectionId) {
    // Get all sections
    var sections = document.querySelectorAll('.section');

    // Loop through all sections and hide them
    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}

// Initialize Google Places Autocomplete
function initAutocomplete() {
    var input = document.getElementById('autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Restrict the autocomplete to addresses
    autocomplete.setTypes(['address']);

    // Add listener to handle place selection
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and pressed the Enter key
            window.alert("No details available for input: '" + place.name + "'");
            placeSelected = false;
            document.getElementById('place_id').value = '';
            document.getElementById('map').style.display = 'none';
            return;
        }

        // Valid place selected
        placeSelected = true;
        selectedPlace = place; // Store the selected place
        document.getElementById('place_id').value = place.place_id;
        console.log('Selected place:', place);
        document.getElementById('error-message').style.display = 'none';
    });
}

// Form submission handler
function handleFormSubmission(event) {
    if (!placeSelected) {
        event.preventDefault(); // Prevent form submission
        document.getElementById('error-message').style.display = 'block';
        alert("Please select a valid address from the suggestions.");
        return;
    }

    // Prevent default form submission
    event.preventDefault();

    // Display the map with the selected address
    displayMap(selectedPlace);

    // Create a new button element
    if (!document.getElementById('confirm-address-btn')) {
        const button = document.createElement("button");
        button.id = "confirm-address-btn";
        button.innerText = "Confirm my Address";
        button.addEventListener("click", function() {
            // sessionStorage.setItem("address", document.getElementById("autocomplete").value);
            // window.location.href = "carpool.html";
            calculateBestCarpoolRoute(document.getElementById("autocomplete").value, "School");
        });
        document.getElementById("continue-container").appendChild(button);
    }
}

// Function to display the map
function displayMap(place) {
    if (!place || !place.geometry) {
        alert("Invalid place details.");
        return;
    }

    // Get the map container
    var mapDiv = document.getElementById('map');

    // Show the map container
    mapDiv.style.display = 'block';

    // If the map is already initialized, just set the new center
    if (map) {
        map.setCenter(place.geometry.location);
        // If you want to add a marker, you can do so here
        new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
        return;
    }

    // Initialize the map
    map = new google.maps.Map(mapDiv, {
        center: place.geometry.location,
        zoom: 15
    });

    // Add a marker at the selected location
    new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}

// Initialize autocomplete and form handler when the page loads
window.onload = function() {
    initAutocomplete();
    document.getElementById('routesForm').addEventListener('submit', handleFormSubmission);
};