// // create a map object
// let myMap = L.map("map", {
//     center: [15.5994, -28.6731],
//     zoom: 3
//   });
  
//   // Add a tile layer.
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   }).addTo(myMap);
  
// // Loop through earthquake array and make one marker per earthquake
// let earthquakes = response.data.features;

// for (let i = 0; i < earthquakes.length; i++) {
//     let earthquake = earthquakes[i]
//     L.circle([earthquake[i].coordinates[0], earthquake[i].coordinates[1]], {
//         fillOpacity: 0.75,
//         color: "white",
//         fillColor: "red"
//     }).addTo(myMap);
// }





// create map function
function createMap(earthquakeFeatures) {

    // Create the tile layer that will be the background of the map
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
    "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
    "Earthquakes": earthquakeFeatures
    };

    // Create the map object with options.
    let map = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [streetmap, earthquakeFeatures]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

}

// create layers function
function createMarkers(response) {

    // Pull the "features" property from response.data
    let earthquakes = response.data.features;

    // Initialize an array to hold earthquake markers
    let earthquakeMarkers = [];

    // Loop through the features array
    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
    
    // For each earthquake, create a marker, and bind a popup with the earthquake's magnitude
        let earthquakeMarker = L.marker([earthquake.coordinates[1], earthquake.coordinates[2]])
        .bindPopup("<h3>" + earthquake.mag + "</h3>")

    // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(earthquakeMarker);
    }

    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
}
// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);