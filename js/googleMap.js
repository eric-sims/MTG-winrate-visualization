class googleMap {
  constructor(crashData) {
    this.crashData = crashData;
    this.initMap();
  }

  draw() {
    console.log(this.crashData);
  }

  initMap() {
    // The first parameter of this function is the element that you want to render the map to.
    // We here use the native DOM API.
    // if using d3 instead of the native DOM API, the call should be: d3.select("#map").node().
    // notice the use of node() to access the actual DOM node instead of the d3 selection.

    // let mapContainer = document.getElementById("map");
    //The second parameter we want to use is the zoom and center(lat and lng) options for the map
    let options = {
      zoom: 7,
      center: {
        lat: 39.321,
        lng: -111.0937,
      },
      mapTypeId: "roadmap",
      restriction: {
        latLngBounds: { north: 43, east: -108, south: 36, west: -114 },
        strictBounds: false,
      },
      //Style made in the google API style wizard to give the map a UFO feel
      //You can customize your map styles and and them into a styles array in the options opbject
      // styles: googleMapStyles.styles,
    }; //TODO show just utah??

    // Create the Google Map…
    let map = new google.maps.Map(d3.select("#map").node(), options);
  }
}
