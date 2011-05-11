var map;
var profileMarkers = [];
var markerCluster;
var markers = [];
var log;
                       

function init() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(37.796221,-122.357483),
    zoom: 10,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
   var jasMapType = new google.maps.StyledMapType(mapStyle, { name: "Jasper" });
   map.mapTypes.set('jasper', jasMapType);
   map.setMapTypeId('jasper');
   var kmlLayer = new google.maps.KmlLayer('http://maps.google.com/maps/ms?ie=UTF8&hl=en&t=p&msa=0&output=nl&msid=209747203846168327215.00049b469d015246d062d');
   kmlLayer.setMap(map); 
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
