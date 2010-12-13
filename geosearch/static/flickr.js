var map;
var profileMarkers = [];
var markerCluster;
var markers = [];

         
JW_BASE_URL = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' + 
              '&api_key=28dc29f7d5fcf4a473594f1595db8340' +
              '&user_id=31355801%40N05' + 
              '&extras=geo%2Curl_m%2Cdate_taken' +
              '&machine_tags=jw%3Astreetfair%3D' +
              '&has_geo=1&format=json&jsoncallback=?';                          

function init() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(37.776481,-122.437906),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });
  addActions();
  addMarkers();
  
}

function addMarkers(page) {
  if (!page) {page=0};
  var url = JW_BASE_URL + 
    '&per_page=50&page=' + page;
    console.log(url);
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
        marker.url_m = photo.url_m;   
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
                      thumbnailUrlResolver: function(marker) {return marker.url_m},
                      transitionCallback: function(marker) {
                        $('#title').html(marker.title);
                        $('#date').html(marker.datetaken);
                      },
                      pauseOnHover : false,
                      centerBias : { topBias : 0, leftBias : 0}
	                    };
	    
	      this.mediaViewer = new GFslideShow(cluster[0].markers_, "images", options);
	      
	      $('#results-wrapper').show();
        var cols = $('#cols');
        if (!cols.hasClass('has-cols')) {
           $('#cols').addClass('has-cols');
           var myCenter = map.center;
           google.maps.event.trigger(map, 'resize');
           map.panTo(myCenter);
        }
	 
}


onClusterClick_old = function(cluster) {
  var map = cluster[0].map_;
      $("#images").html('');
      for (var i = 0, marker; marker = cluster[0].markers_[i]; i++) {
          var image = $("<img/>").attr({src: marker.url_m, alt: 'b'});
          image.appendTo("#images");
          image.data('title', marker.title);
          image.data('date', new Date(marker.datetaken).getFullYear());
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
  $('#title').html($(nextSlideElement).data('title'));
  $('#date').html($(nextSlideElement).data('date'));
}

google.maps.event.addDomListener(window, 'load', init);
