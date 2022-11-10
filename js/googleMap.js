class googleMap {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
  }

  async draw() {
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
    };

    // Create the Google Map…
    let map = new google.maps.Map(d3.select("#map").node(), options);

    // we downloaded ufo data from here: https://www.kaggle.com/NUFORC/ufo-sightings 
    //Thanks Kaggle!
    this.globalApplicationState.filteredData = this.globalApplicationState.data.filter(d => d.CRASH_DATETIME.includes("2019")).slice(0, 1000);   // TODO: filtered data needs to be done in filter.js
    
    // Load the ufo sighting data. When the data comes back, create an overlay.
    let data = this.globalApplicationState.filteredData;

    //Filter the data to only see US sightings. Take a sample of 200.
    let usDataSample = data;
    
    //Create the overlay that we will draw on
    let overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function () {

        //to see all the available panes;
        // console.log(this.getPanes());

        let layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "ufo");

        overlay.onRemove = function () {
            d3.select('.ufo').remove();
        };

        overlay.draw = function () {
            // console.log('here')
            let projection = this.getProjection(),
                padding = 10;

            let circleScale = d3.scaleLinear()
                .domain([d3.min(usDataSample, d => d.CRASH_SEVERITY_ID),
                    d3.max(usDataSample, d => d.CRASH_SEVERITY_ID)])
                .range([2, 7]).clamp(true);

            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?
            let marker = layer.selectAll('svg')
                .data(usDataSample);

            let markerEnter = marker.enter().append("svg");

            // add the circle
            markerEnter.append("circle");

            marker.exit().remove();

            marker = marker.merge(markerEnter);

            marker
                .each(transform)
                .attr("class", "marker");

            // style the circle
            marker.select("circle")
                .attr("r", d => circleScale(d.CRASH_SEVERITY_ID))
                .attr("cx", padding)
                .attr("cy", padding)
                .style('opacity', .8)
                .attr('fill', 'red')
                .on('click', d => console.log(d));

            //transforms the markers to the right
            // lat / lng using the projection from google maps
            function transform(d) {
                d = new google.maps.LatLng(+d.lat, +d.lon);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
}
}
