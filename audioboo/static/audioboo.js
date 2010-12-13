var map;
var profileMarkers = [];
var markerCluster;
var markers = [];

JW_BASE_URL = 'http://api.audioboo.fm/users/45731/audio_clips.jsonp?callback=?'; 
              
              

function init() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(37.769697,-122.427521),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  addActions();
  addMarkers();
  
}

function addMarkers(page) {
  if (!page) {page=0};
  var url = JW_BASE_URL;
  $.getJSON(url, addResults);
}


function addActions() {
  var s = $('#s').submit(search);

  $('#close').click(function() {
    $('#cols').removeClass('has-cols');
    var myCenter = map.center;
    google.maps.event.trigger(map, 'resize');
    map.panTo(myCenter);
    $('#results-wrapper').hide();
    return false;
  });
}

function search(e) {} //error if you remove this function}


addResults = function(json) {
  var results = $('#results');
 // results.innerHTML = '';
  html = [];
  if (json.body.audio_clips && json.body.audio_clips.length) {
    for (var i = 0, boo; boo = json.body.audio_clips[i]; i++) {
        var pos = new google.maps.LatLng(boo.location.latitude, boo.location.longitude);
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
//          icon: image,
          zIndex: 10
        });
       // google.maps.event.addListener(marker, 'click', function() {onClusterClick(marker)});
        marker.audio = boo.urls.high_mp3;
        marker.url_m = boo.urls.image; 
        marker.title = boo.title;
        marker.datetaken = boo.uploaded_at;
        markers.push(marker);
    }
  } 
  var mcOptions = {gridSize: 1, zoomOnClick: false};
  markerCluster = new MarkerClusterer(map, markers, mcOptions);
  google.maps.event.addListener(markerCluster, 'clusterclick', onClusterClick);
//  if (json.photos.page < json.photos.pages) {addMarkers(json.photos.page+1)};
}

onClusterClick = function(cluster) {
      
    //console.log(cluster);
    $("#images").html('');
    for (var i = 0, marker; marker = cluster[0].markers_[i]; i++) {
        var image = $("<img/>").attr({src: marker.url_m, alt: marker.title});
        image.appendTo("#images");
        var player = $("<audio src='" + marker.audio + "' controls autobuffer><audio>");
        $("#audio").html(player);
        $('#title').html(marker.title);
        $('#date').html(marker.datetaken);
    }
      
      $('#results-wrapper').show();
       var cols = $('#cols');
       if (!cols.hasClass('has-cols')) {
         $('#cols').addClass('has-cols');
         var myCenter = map.center;
         google.maps.event.trigger(map, 'resize');
         map.panTo(myCenter);
       }
       
       $('#images').cycle({
          fx:     'fade',
          speed:    'fast',
          //timeout:  0,
          next:   '#next',
          prev:   '#prev',
          before: onTransition
        });
        
 
      
}

var onTransition = function(currSlideElement, nextSlideElement, options, forwardFlag){
  $('#title').html($(nextSlideElement.firstChild).data('title'));
  $('#date').html($(nextSlideElement.firstChild).data('date'));
}

google.maps.event.addDomListener(window, 'load', init);
