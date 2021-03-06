// Create a map object
var myMap = L.map("map", {
    center: [40.760833, -111.891111],
    zoom: 5
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
    return mag*10000;
} 

function getColor(d) {
  return d > 5 ? '#DF3F00' :
         d > 4 ? '#FF9700' :
         d > 3 ? '#FF9222' :
         d > 2 ? '#F0DB00' :
         d > 1 ? '#BBD600' :
                 '#79BA00' ;
}

var queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
  console.log(data.features[1].properties.mag);

  for (var i = 0; i < data.features.length; i++) {
    L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "none",
      fillColor: getColor(data.features[i].properties.mag),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: markerSize(data.features[i].properties.mag)
    }).bindPopup("<h3>" + data.features[i].properties.place + "</h3> <hr> <h4>Magnitude: " + data.features[i].properties.mag + "</h4>").addTo(myMap);
  };
});


var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: #79BA00"></i><span>0-1</span><br>';
  div.innerHTML += '<i style="background: #BBD600"></i><span>1-2</span><br>';
  div.innerHTML += '<i style="background: #F0DB00"></i><span>2-3</span><br>';
  div.innerHTML += '<i style="background: #FF9222"></i><span>3-4</span><br>';
  div.innerHTML += '<i style="background: #FF9700"></i><span>4-5</span><br>';
  div.innerHTML += '<i style="background: #DF3F00"></i><span>5+</span><br>';

  return div;
};

legend.addTo(myMap);

