// Store our API endpoint as "queryUrl" and tectonic plate data as "tectonicplates".
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create function to determine marker size
function markerSize(magnitude) {
  // Increase the scale/size of the magnitude marker to make it more readable on a map when zoomed out
  return magnitude * 10000;
};

// Function to define marker color by depth
function markerColour(depth){
  if (depth < 10) return "#00FF00";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "#FF0000";
}

// Function to create earthquake map (the basis of our map)
function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the GEOJSON file.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer used to alter markers (https://leafletjs.com/examples/geojson/)
    pointToLayer: function(feature, latlng) {

      // Determine the style of markers based on earthquake magnitude ("mag")
      // https://leafletjs.com/reference.html#circlemarker
      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColour(feature.geometry.coordinates[2]),
        fillOpacity: 0.4,
        color: "black",
        stroke: true,
        weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Create the base map & overlay maps
function createMap(earthquakes) {

  // Create tile layer using MapBox and OpenStreet Map (as shown in the attribute of the sample image)
  // Grayscale base map
  var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style:'mapbox/light-v11',
    access_token: 'pk.eyJ1IjoibWljaGVsbGVjYXJ2YWxobyIsImEiOiJjbGUwbXBxYzMxY3RzM3ZueTN6ZnRicGJxIn0.rtETj8AmHXnbIsQ-RguXFA'
  });

  // Satellite base map
  var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style:'mapbox/satellite-streets-v12',
    access_token: 'pk.eyJ1IjoibWljaGVsbGVjYXJ2YWxobyIsImEiOiJjbGUwbXBxYzMxY3RzM3ZueTN6ZnRicGJxIn0.rtETj8AmHXnbIsQ-RguXFA'
  });

  // Outdoors base map
  var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    style:'mapbox/outdoors-v12',
    access_token: 'pk.eyJ1IjoibWljaGVsbGVjYXJ2YWxobyIsImEiOiJjbGUwbXBxYzMxY3RzM3ZueTN6ZnRicGJxIn0.rtETj8AmHXnbIsQ-RguXFA'
  });

  // Create a new layer on our map to show the earth's tectonic plates relative to earthquake activity
  faultlines = new L.layerGroup();

  // Perform a GET request to the tectonicplates JSON data set
  d3.json(tectonicplates).then(function (plates) {

      // Format and add the faultlines layer to our map 
      L.geoJSON(plates, {
          color: "red",
          weight: 2
      }).addTo(faultlines);
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Grayscale": grayscale,
    "Satellite": satellite,
    "Outdoors": outdoors
  };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": faultlines
    };  

  // Create our map, specifying the layers to display
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [earthquakes, grayscale, satellite, outdoors, faultlines]
  });

  // Add a legend to the bottom right corner of the map
  // THANK YOU: https://www.igismap.com/legend-in-leafletjs-map-with-topojson/ 
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(map) {
    // Dom Utility that puts legend into DIV & Info Legend
    var div = L.DomUtil.create("div", "info legend"),
    // Define depth steps
    depth = [-10, 10, 30, 50, 70, 90];

    // Legend Label "Depth"  
    div.innerHTML = 'Depth<br><hr>'

    // Loop through each depth step to create bins for the legend
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
      // HTML code with nbs(non-breaking space) and ndash
      '<i style="background:' + markerColour(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  
  // Adds Legend to myMap
  // Additional layout, including box and white background coded into CSS Style file (style.css)
  legend.addTo(myMap)

  // Create the layer toggle control
  // Pass in our baseMaps and overlayMaps
  // Add the layer toggle control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};