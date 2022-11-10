class googleMap {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
  }

  async draw() {
    console.log(this.globalApplicationState.data);
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

    let overlay = new google.maps.OverlayView();

    // console.log('overlay', overlay);

    let data = this.globalApplicationState.data.slice(0, 100);
    overlay.onAdd = function () {
          console.log(this.getPanes());

        let layer = d3
        .select(this.getPanes().overlayMouseTarget)
        .append("div")
        .attr("class", "crashPoints");

      console.log('layer', layer);

      overlay.onRemove = function () {
          d3.select('.crashPoints').remove();
        };
      
      console.log('eheheehehre')
      overlay.draw = function () {

        let projection = this.getProjection(), padding = 10;

        let marker = layer.selectAll("svg")
          .data(data)
          ;

        console.log('marker', marker);

        let markerEnter = marker.enter().append('svg');

        console.log('markerEnter', markerEnter);

        // add a circle
        markerEnter.append("circle");

        marker.exit().remove();
        
        marker = marker.merge(markerEnter);

        marker
          .each(transform)
          .attr("class", "marker")
          ;

        marker.select('circle')
          .attr("r", 5)
          .attr('cx', padding+5)
          .attr('cy', padding+5)
          .attr('fill', 'red')
          .on('click', function(d) {
            console.log(d);
          });

        function transform(d) {
          d = new google.maps.LatLng(+d.LAT_UTM_Y, +d.LONG_UTM_X);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }

      };
      
      console.log('after overlay.draw');
    };
    overlay.setMap(map);
  }

}