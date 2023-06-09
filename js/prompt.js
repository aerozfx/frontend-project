let googleMapsAPIKEY = prompt("Introduce la API key");

const googleMapsScript = document.createElement("script");
googleMapsScript.setAttribute(
  "src",
  `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKEY}&callback=initMap&libraries=places&v=weekly`
);
googleMapsScript.setAttribute("id", "google-map");

const bodySelector = document.querySelector("body");

bodySelector.appendChild(googleMapsScript);
