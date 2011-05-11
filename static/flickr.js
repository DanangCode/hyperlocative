var map;
var profileMarkers = [];
var markerCluster;
var markers = [];
var myCenter;
        
var MY_MAPTYPE_ID = 'jasper';        
        
JW_BASE_URL = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' + 
              '&api_key=28dc29f7d5fcf4a473594f1595db8340' +
              '&user_id=31355801%40N05' + 
              '&extras=geo%2Curl_s%2Cdate_taken' +
              '&has_geo=1&format=json&jsoncallback=?';
              '&machine_tags=jw%3Astreetfair%3D';                          

var mapStyle = [
                {
                  featureType: "all",
                  elementType: "all",
                  stylers: [
                    { visibility: "simplified" },
                    { lightness: 58 },
                    { gamma: 2.45 },
                    { saturation: -51 }
                  ]
                },{
                  featureType: "water",
                  elementType: "all",
                  stylers: [
                    { hue: "#0022ff" },
                    { lightness: -41 },
                    { saturation: -2 }
                  ]
                },{
                  featureType: "landscape.natural",
                  elementType: "all",
                  stylers: [
                    { hue: "#2bff00" },
                    { saturation: 50 },
                    { lightness: -32 }
                  ]
                },{
                  featureType: "road.highway",
                  elementType: "all",
                  stylers: [
                    { lightness: -18 },
                    { hue: "#ff003b" }
                  ]
                },{
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [
                    { hue: "#ff0091" },
                    { visibility: "on" },
                    { lightness: -12 }
                  ]
                },{
                  featureType: "road.arterial",
                  elementType: "labels",
                  stylers: [
                    { visibility: "on" },
                    { saturation: 27 },
                    { lightness: 8 }
                  ]
                },{
                      featureType: "administrative.locality",
                      elementType: "all",
                      stylers: [
                        { visibility: "on" },
                        { lightness: 8 }
                      ]
                    }
              ]

function init() {
  var geoService = navigator.geolocation;
 	if (geoService) {
  		navigator.geolocation.getCurrentPosition(showCurrentLocation,errorHandler,{enableHighAccuracy: true});
  	} else {
  		alert("Your Browser does not support GeoLocation.");
  	}
  
}

function showCurrentLocation(position){
  var mapDiv = document.getElementById('map');
  myCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map = new google.maps.Map(mapDiv, {
    center: myCenter,
    zoom: 12,
    mapTypeControlOptions: {mapTypeIds: [MY_MAPTYPE_ID]},
    mapTypeId: MY_MAPTYPE_ID
  });
  
  var styledMapOptions = {name: "jasper"};
  var jasperMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, jasperMapType);
  createAvatar(map);
  layer = new google.maps.FusionTablesLayer(356215, {
    heatmap: false
  });
  layer.setMap(map);

  addActions();
  //addMarkers();
}

function createAvatar(map) {
  var jasperIcon = new google.maps.MarkerImage('/static/jasper_100.png',
      new google.maps.Size(42, 100),
      new google.maps.Point(0,0),
      new google.maps.Point(33, 98));

   avatar = new google.maps.Marker({position: myCenter, title:'Jasper', icon:jasperIcon, zIndex: 1});
   avatar.setMap(map);
   //This tells the avatar postion to Observe the GeoBrower Position (google KVO)
   avatar.bindTo('position', map, 'center');
   return avatar;    
}

function errorHandler(error){
 	  alert("Error while retrieving current position. Error code: " + error.code + ",Message: " + error.message);
}

function addMarkers(page) {
  if (!page) {page=0};
  var url = JW_BASE_URL + 
    '&per_page=50&page=' + page +
    '&lat=' + myCenter.wa + 
    '&lon=' + myCenter.xa + '&radius=3&radius_units=mi';
    //console.log(url);
  $.getJSON(url, addResults);
}


function addActions() {
  var s = $('#s').submit(search);

  $('#close').click(function() {
    $('#cols').removeClass('has-cols');
    $('#results-wrapper').hide();
    $('#map-wrapper').show();
    var myCenter = map.center;
    google.maps.event.trigger(map, 'resize');
    map.panTo(myCenter);
    
    return false;
  });
}

function search(e) {} //error if you remove this function}


addResults = function(json) {
  var results = $('#results');
  html = [];
  if (json.photos && json.photos.photo && json.photos.photo.length) {
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
        google.maps.event.addListener(marker, 'click',function() {
             alert("hi");
         });
        markers.push(marker);
    }
  } 
 // var mcOptions = {gridSize: 20, zoomOnClick: false};
//  markerCluster = new MarkerClusterer(map, markers, mcOptions);
//  google.maps.event.addListener(markerCluster, 'clusterclick', onClusterClick);
//  if (json.photos.page < json.photos.pages) {addMarkers(json.photos.page+1)};
}

onClusterClick = function(cluster) {

        $("#images").html('');
	      var options = {displayTime:4000, transitionTime:600, scaleImages:true, random:false, 
	                    fullControlPanel : true, fullControlPanelSmallIcons : false,
                 //     imageClickCallback : this.bind(this.onImageClick), 
                      thumbnailUrlResolver: function(marker) {return marker.url},
                      transitionCallback: function(marker) {
                        $('#title').html(marker.title);
                        $('#date').html(marker.datetaken);
                      },
                      pauseOnHover : false,
                      centerBias : { topBias : 0, leftBias : 0}
	                    };
	    
	      this.mediaViewer = new GFslideShow(cluster[0].markers_, "images", options);
	      
	      
	      $('#map-wrapper').hide();
	      $('#results-wrapper').show();
        var cols = $('#cols');
        if (!cols.hasClass('has-cols')) {
           $('#cols').addClass('has-cols');
           var myCenter = map.center;
           google.maps.event.trigger(map, 'resize');
           map.panTo(myCenter);
        }
	 
}



var onTransition = function(currSlideElement, nextSlideElement, options, forwardFlag){
  $('#title').html($(nextSlideElement).data('title'));
  $('#date').html($(nextSlideElement).data('date'));
}

google.maps.event.addDomListener(window, 'load', init);
