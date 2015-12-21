// To Use : Create <div id="map"></div> where you want to create the div and be sure to have the div and its parent with the height you want.
// import :
/*
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCirxzx91LVmHxOjOBrcWtE20Ck3ArLynw&callback=initMap">
</script
>*/
// in a JS script launch function drawMap(latitudeDestination, longitudeDestination); and it will create a map from the user location to the destination.
var map;
var latitudeDestination = 43.570256;
var longitudeDestination = 1.467247;
function setLatitudeDest(latitude){
  latitudeDestination = latitude;
}
function setLongitudeDest(longitude){
  longitudeDestination = longitude;
}
function drawMap(latitudeDestination, longitudeDestination){
  setLongitudeDest(longitudeDestination);
  setLatitudeDest(latitudeDestination);
  initMap();
}
function initMap(){
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var maLongitude, maLatitude;
  if(navigator.geolocation) {
    function maPosition(position) {
      maLatitude = position.coords.latitude;
      maLongitude = position.coords.longitude;
      map = setMap(maLatitude, maLongitude);
      directionsDisplay = initDirectionDisplay(map);
      calcRoute(directionsDisplay, directionsService, maLatitude, maLongitude);
    }
    navigator.geolocation.getCurrentPosition(maPosition);
  } else {
    maLatitude = 43.570256;
    maLongitude =  1.467247;
    setMap(maLatitude, maLongitude);
  }
}

function pinpoint(latitude, longitude, title) {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
    scrollwheel: false,
    zoom: 17
  });
  var marker = new google.maps.Marker({
    position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
    map: map,
    title: title
  });
  marker.setMap(map);
  marker.addListener('click', toggleBounce);
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

function setMap(maLatitude, maLongitude) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: maLatitude, lng: maLongitude},
    zoom: 16
  });
  return map;
}

function initDirectionDisplay(map){
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  return directionsDisplay;
}

function calcRoute(directionsDisplay, directionsService, maLatitude, maLongitude) {
  var start = maLatitude + ',' + maLongitude;
  var end = latitudeDestination + ',' + longitudeDestination;
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}
