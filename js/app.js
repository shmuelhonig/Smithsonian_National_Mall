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
var infowindow;

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
    infowindow = new google.maps.InfoWindow();

    // Open infowindow upon click on marker
    marker.addListener('click', (clickToShow(marker, title, position)));

  }
}

// Function to show animation and infowindow upon click
var clickToShow = function(newMarker, newTitle, newPosition) {
  return function() {

    toggleBounce(newMarker);

    // Get info from FourSquare API
    var fourSquare = $.getJSON(
      "https://api.foursquare.com/v2/venues/search?ll=" + newPosition.lat + "," + newPosition.lng + "&name=" + newTitle + "&intent=match&client_id=U1FZTHJMKUL4MR4D2SB00ODHKY2TTH35C4TW5UVMNRAL3RYB&client_secret=H0VSQRKNPIPVOJFJPVJPWBJ2TJ1PRAD5MKA4TGAR2M4KAEZR&v=20180724"
    ).done(function(data) {
      infowindow.setContent(
        '<div>' + newTitle + '</div>' + '<div>From FourSquare: ' + data.response.venues[0].location.formattedAddress[0] + '<div>'
      );
      if (infowindow.getMap() == null) {
        infowindow.open(map, newMarker);
      } else {
        infowindow.close();
      }
    }).fail(function(error) {return "FourSquare could not be reached"});
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

// Create items to populate observable array for tracking
var Museum = function(data) {
  this.title = ko.observable(data.title);
  this.coord = ko.observable(data.coord);
}

var ViewModel = function() {
  var self = this;

  // Populate observable array of locations for tracking
  this.observableLocations = ko.observableArray([]);
  locations.forEach(function(location) {
    self.observableLocations.push(new Museum(location));
  });

  this.formInput = ko.observable("");


  // Implement filter for list items (based on http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
  this.filteredItems = ko.computed(function() {
    var formInput = this.formInput().toLowerCase();
    if (!formInput) {
        return this.observableLocations();
    } else {
        return ko.utils.arrayFilter(this.observableLocations(), function(location) {
            return ko.utils.stringStartsWith(location.title().toLowerCase(), formInput);
        });
    }
  }, this);

  // Subscribe to form input so that whenever its value changes it associates the list items with a marker and hides markers that have been filtered out
  this.formInput.subscribe(function() {
    for (var i = 0; i < self.observableLocations().length; i++) {
      self.observableLocations()[i].pointer = ko.observable(markers[i]);
      if (self.filteredItems().indexOf(self.observableLocations()[i]) >= 0) {
        self.observableLocations()[i].pointer().setVisible(true);
      } else {
        self.observableLocations()[i].pointer().setVisible(false);
      }
    }
  })


  // Event Listener for clicking list item
  this.clickList = function(data) {
    for (var i = 0; i < self.filteredItems().length; i++) {
      // this next line is necessary to associate markers in case the user has not actually used the filter
      self.filteredItems()[i].pointer = ko.observable(markers[i]);
    }
    clickToShow(data.pointer(), data.title(), data.coord())(data.pointer(), data.title(), data.coord());
  }
}

// Toggle show/hide the list view, and adjust map width accordingly
$('#collapseButton').click(function() {
  $('#sidebarCollapse').toggle();
  if ($('.map-container').attr('class').includes("col-8")) {
    $('.map-container').attr("class", "map-container col-11");
  } else {
    $('.map-container').attr("class", "map-container col-8");
  }
})
