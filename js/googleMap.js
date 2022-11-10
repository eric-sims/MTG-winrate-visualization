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

    let data = this.globalApplicationState.data.slice(0, 100);
    overlay.onAdd = function () {
      let layer = d3
        .select(this.getPanes().overlayMouseTarget)
        .append("div")
        .attr("class", "crashPoints");

      overlay.onRemove = function () {
        d3.select(".crashPoints").remove();
      };

      overlay.draw = function () {
        let projection = this.getProjection(),
          padding = 10;

        let marker = layer.selectAll("svg").data(data);
        let markerEnter = marker.enter().append("svg");

        // add a circle
        markerEnter.append("circle");

        marker.exit().remove();

        marker = marker.merge(markerEnter);

        marker
          .each(transform)
          .each((d) => console.log("here", d))
          .attr("class", "marker");

        marker
          .select("circle")
          .attr("r", 5)
          .attr("cx", padding)
          .attr("cy", padding)
          .attr("fill", "red")
          .on("click", function (d) {
            console.log(d);
          });

        function transform(d) {
          d = new google.maps.LatLng(+d.lat, +d.lon);
          d = projection.fromLatLngToDivPixel(d);
          return d3
            .select(this)
            .style("left", d.x - padding + "px")
            .style("top", d.y - padding + "px");
        }
      };
    };
    overlay.setMap(map);
  }
}
