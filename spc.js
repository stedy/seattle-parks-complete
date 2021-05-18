
var visitedCount = 0;
for(var i=0; i < geojson.features.length; i++){
    parkName = geojson.features[i]['properties']['name']
    if(parkName in localStorage){
      geojson.features[i]['properties']['visit'] = '#89959C'
      visitedCount++;
    }
  }

updateProgress();

var map = L.map('map').setView([47.6031447,-122.3285673], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

function getProgress(numOfParks, visited) {
  if (numOfParks === 0 || isNaN(numOfParks)) return 0;

  var result = parseInt(visited, 10) / parseInt(numOfParks, 10) * 100;
  console.log(result);
  return result.toFixed(2) + '%';
}

function updateProgress() {
  document.getElementById("myModalLabel").innerHTML = getProgress(geojson.features.length, visitedCount);
}

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.name, {
    closeButton: false,
    offset: L.point(0, -10)
  });
  layer.on('mouseover', function (e) {
            this.openPopup();
            });
  layer.on('mouseout', function (e) {
            this.closePopup();
            });
  layer.on('click', function (e) {
      placeName = feature.properties.name;
      if(placeName in localStorage){
        localStorage.removeItem(placeName);
        this.setStyle({fillColor: '#8EDD65', stroke: '#8EDD65'});
        visitedCount--;
      } else {
        localStorage.setItem(placeName, this.getLatLng().toString());
        this.setStyle({fillColor: '#89959C', stroke: '#000000'});
        visitedCount++;
      }
      updateProgress();
      });
    }

  geojsonLayer = L.geoJson(geojson, {
      style: function(feature) {
        return {color: feature.properties.visit};
      },
      pointToLayer: function(feature, latlng) {
        var currentZoom = map.getZoom();
        return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
      },
      onEachFeature: onEachFeature
  });
map.addLayer(geojsonLayer);
