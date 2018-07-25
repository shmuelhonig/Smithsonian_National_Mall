var locations = [
  {
    title: "Arthur M. Sackler Gallery",
    coord: {
      lat: 38.887941,
      lng: -77.026354
    }
  },
  {
    title: "Arts and Industries Building",
    coord: {
      lat: 38.88818,
      lng: -77.0246
    }
  },
  {
    title: "Freer Gallery of Art",
    coord: {
      lat: 38.888075,
      lng: -77.0274
    }
  },
  {
    title: "Hirshhorn Museum and Sculpture Garden",
    coord: {
      lat: 38.888161,
      lng: -77.022968
    }
  },
  {
    title: "National Air and Space Museum",
    coord: {
      lat: 38.88816,
      lng: -77.019868
    }
  },
  {
    title: "National Museum of African American History and Culture",
    coord: {
      lat: 38.891064,
      lng: -77.032614
    }
  },
  {
    title: "National Museum of African Art",
    coord: {
      lat: 38.887933,
      lng: -77.025507
    }
  },
  {
    title: "National Museum of American History",
    coord: {
      lat: 38.891279,
      lng: -77.030051
    }
  },
  {
    title: "National Museum of the American Indian",
    coord: {
      lat: 38.888348,
      lng: -77.016503
    }
  },
  {
    title: "National Museum of Natural History",
    coord: {
      lat: 38.891266,
      lng: -77.026065
    }
  },
  {
    title: "Smithsonian Institution Building (The Castle)",
    coord: {
      lat: 38.888786,
      lng: -77.026023
    }
  }
]

var map;
var markers = [];

function initMap() {
  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.88962, lng: -77.022977},
    zoom: 16
  });

  for (var i = 0; i < locations.length; i++) {
    // Get current title and position
    var title = locations[i].title;
    var position = locations[i].coord;

    // Create markers
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: null
    });
    // Add marker to array
    markers.push(marker);

    // Add infowindow
    var infowindow = new google.maps.InfoWindow();

    // Open infowindow upon click on marker
    marker.addListener('click', (function(newMarker) {
      return function() {

        toggleBounce(newMarker);

        // Get info from FourSquare API
        var fourSquare = $.getJSON(
          "https://api.foursquare.com/v2/venues/search?ll=" + position.lat + "," + position.lng + "&name=" + title + "&intent=match&client_id=U1FZTHJMKUL4MR4D2SB00ODHKY2TTH35C4TW5UVMNRAL3RYB&client_secret=H0VSQRKNPIPVOJFJPVJPWBJ2TJ1PRAD5MKA4TGAR2M4KAEZR&v=20180724"
        ).done(function(data) {
          infowindow.setContent(
            '<div>' + newMarker.title + '</div>' + '<div>' + data.response.venues[0].location.formattedAddress[0] + '<div>'
          );
          infowindow.open(map, newMarker);
        }).fail(function(error) {return "FourSquare could not be reached"});


      }
    }(marker)));

  }
}

// Animate marker with a bounce; taken from Google sample
var toggleBounce = function(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

var ViewModel = function() {
  var self = this;


}
