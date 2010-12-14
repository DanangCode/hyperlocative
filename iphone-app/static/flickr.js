var map;
var profileMarkers = [];
var markerCluster;
var markers = [];
var myCenter;
         
JW_BASE_URL = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' + 
              '&api_key=28dc29f7d5fcf4a473594f1595db8340' +
              '&user_id=31355801%40N05' + 
              '&extras=geo%2Curl_s%2Cdate_taken' +
              '&has_geo=1&format=json&jsoncallback=?';
              '&machine_tags=jw%3Astreetfair%3D';                          

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
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  
  addActions();
  addMarkers();
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
        markers.push(marker);
    }
  } 
  var mcOptions = {gridSize: 20, zoomOnClick: false};
  markerCluster = new MarkerClusterer(map, markers, mcOptions);
  google.maps.event.addListener(markerCluster, 'clusterclick', onClusterClick);
  if (json.photos.page < json.photos.pages) {addMarkers(json.photos.page+1)};
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