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

// create getColor function
function getColor(depth) {
    return depth > 90 ? '#7a0177' :
    depth > 70 ? '#c51b8a' :
    depth > 50 ? '#f768a1' :
    depth > 30 ? '#fa9fb5' :
    depth > 10 ? '#fcc5c0' :
    '#feebe2';
}

// create layers function
function createMarkers(response) {

    // Pull the "features" property from response.data
    let earthquakes = response.features;
    console.log(response)

    // Initialize an array to hold earthquake markers
    let earthquakeMarkers = [];

    // Loop through the features array
    for (let i = 0; i < earthquakes.length; i++) {
        let earthquake = earthquakes[i];
    
    // For each earthquake, create a marker, and bind a popup with the earthquake's magnitude
        let earthquakeMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            fillColor: getColor(earthquake.geometry.coordinates[2]),
            color: 'white',
            fillOpacity: 0.75,
            weight: 1,
            radius: earthquake.properties.mag * 15000
        })
        .bindPopup("<h3>" + earthquake.properties.mag + "</h3>")

    // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(earthquakeMarker);
    }

    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
}
// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

// create legend 
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    // create new div to hold legend
    let div = L.DomUtil.create('div', 'info legend'),
        // create array of depth intervals
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// add legend to map
legend.addTo(map);