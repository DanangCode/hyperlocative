var map;
var profileMarkers = [];
var markerCluster;
var markers = [];
var log;
     
JW_BASE_URL = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' + 
              '&api_key=28dc29f7d5fcf4a473594f1595db8340' +
              '&user_id=31355801%40N05' + 
              '&extras=geo%2Curl_s%2Cdate_taken' +
              '&has_geo=1&format=json&jsoncallback=?';                          

function init() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(37.796221,-122.357483),
    zoom: 10,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  var styledMapOptions = {
       name: "Hip-Hop"
   }

   var jayzMapType = new google.maps.StyledMapType(
       mapStyle, styledMapOptions);

   map.mapTypes.set('hiphop', jayzMapType);
   map.setMapTypeId('hiphop');
  addActions();
  addMarkers();
  
}

function addMarkers(page) {
  if (!page) {page=0};
  var url = JW_BASE_URL + 
    '&per_page=500&page=' + page;
  $.getJSON(url, addResults);
}


function addActions() {
  var s = $('#s').submit(search);

}

function search(e) {} //error if you remove this function}


addResults = function(json) {
  var results = $('#results');
  html = [];

  if (json.photos.photo && json.photos.photo.length) {
    for (var i = 0, photo; photo = json.photos.photo[i]; i++) {
        var pos = new google.maps.LatLng(photo.latitude, photo.longitude);
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
        //  icon: image,
          zIndex: 10
        });
        marker.url = photo.url_s;   
        marker.title = photo.title;
        marker.datetaken = photo.datetaken;
        markers.push(marker);
      }
  } 

  var mcOptions = {gridSize: 20, zoomOnClick: true};
  markerCluster = new MarkerClusterer(map, markers, mcOptions);
  //google.maps.event.addListener(markerCluster, 'clusterclick', onClusterClick);
  if (json.photos.page < json.photos.pages) {addMarkers(json.photos.page+1)}
  else {  console.log(log) };
}

onClusterClick = function(cluster) {   
	 
}




google.maps.event.addDomListener(window, 'load', init);

var mapStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      { lightness: 40 }
    ]
  },{
    featureType: "road.highway",
    elementType: "all",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "road.local",
    elementType: "all",
    stylers: [
      { visibility: "off" }
    ]
  },{
    featureType: "road.arterial",
    elementType: "all",
    stylers: [
      { lightness: 50 },
      { hue: "#ff2200" }
    ]
  },{
    featureType: "administrative",
    elementType: "all",
    stylers: [
      { visibility: "simplified" }
    ]
  },{
    featureType: "poi.park",
    elementType: "all",
    stylers: [
      { visibility: "on" },
      { lightness: 27 },
      { hue: "#2bff00" }
    ]
  },{
    featureType: "water",
    elementType: "all",
    stylers: [
      { hue: "#0800ff" }
    ]
  },{
    featureType: "landscape.man_made",
    elementType: "all",
    stylers: [
      { lightness: 6 },
      { hue: "#ff4d00" }
    ]
  },{
    featureType: "all",
    elementType: "all",
    stylers: [

    ]
  }
]
