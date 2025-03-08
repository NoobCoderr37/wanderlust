// var map = L.map("map").setView([18.5204, 73.8567], 13); // Default location

// // Add OpenStreetMap tiles
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);

// // Add a marker
// var marker = L.marker([latitude, longitude])
//   .addTo(map)
//   .bindPopup("Your Location")
//   .openPopup();

// Initializing the map with Leaflet.js
var map = L.map("map").setView([latitude, longitude], 13); // Default location set to coordinates of the listing

// Adding OpenStreetMap tiles to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Creating a custom Font Awesome icon for the marker
// Create a custom icon using an SVG file

// Create a marker with the custom SVG icon
var marker = L.marker([latitude, longitude])
  .addTo(map)
  .bindPopup("Listing Location")
  .openPopup();

// Adding a red-colored circle with a bigger radius near the destination
var circle = L.circle([latitude, longitude], {
  color: "red", // Change color to red
  fillColor: "#ff0000", // Red fill color
  fillOpacity: 0.5, // Semi-transparent fill
  radius: 1000, // Increase the radius size
}).addTo(map);

// Functionality to zoom in on the marker when clicked
marker.on("click", function () {
  map.setView([latitude, longitude], 16); // Zoom in to level 16 on click
});
