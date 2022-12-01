class googleMap {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
  }

  async draw() {
    let options = {
      mapId: "roadMap",
      zoom: 7,
      center: {
        lat: 39.52,
        lng: -111.0937,
      },
    };

    this.map = new google.maps.Map(d3.select("#map").node(), options);

    // this.overlay = new google.maps.OverlayView();

    this.updateCircles();
  }

  async updateCircles() {
    let data = this.globalApplicationState.filteredData.slice(0, 1000);

    // add a google maps marker for every data point
    const markers = data.map((d) => {
      return new google.maps.Marker({
        position: {
          lat: +d.lat,
          lng: +d.lon,
        },
        label: {
          text: d.CRASH_ID,
        },
      });
    });

    // Add a marker clusterer to manage the markers.
    new markerClusterer.MarkerClusterer({ markers, map:this.map });

    // let dataCount = data.length; // We should display a string saying how many crashes we are showing
    // let overlay = this.overlay;

    // //Create the overlay that we will draw on

    // // Add the container when the overlay is added to the map.
    // overlay.onAdd = function () {
    //   let layer = d3
    //     .select(this.getPanes().overlayMouseTarget)
    //     .append("div")
    //     .attr("class", "accident");

    //   overlay.onRemove = function () {
    //     d3.select(".accident").remove();
    //   };

    //   overlay.draw = function () {
    //     let projection = this.getProjection(),
    //       padding = 10;

    //     let circleScale = d3
    //       .scaleLinear()
    //       .domain([
    //         d3.min(data, (d) => d.CRASH_SEVERITY_ID),
    //         d3.max(data, (d) => d.CRASH_SEVERITY_ID),
    //       ])
    //       .range([5, 10])
    //       .clamp(true);

    //     // Draw each marker as a separate SVG element.
    //     // We could use a single SVG, but what size would it have?
    //     let marker = layer.selectAll("svg").data(data);

    //     let markerEnter = marker.enter().append("svg");

    //     // add the circle
    //     markerEnter.append("circle");

    //     marker.exit().remove();

    //     marker = marker.merge(markerEnter);

    //     marker.each(transform).attr("class", "marker");

    //     // style the circle
    //     marker
    //       .select("circle")
    //       .attr("r", (d) => circleScale(d.CRASH_SEVERITY_ID))
    //       .attr("cx", padding)
    //       .attr("cy", padding)
    //       .style("opacity", 0.8)
    //       .attr("fill", "red")
    //       .attr("id", (d) => "CRASH" + d.CRASH_ID)
    //       .on("click", (event, data) => {
    //         // console.log("clicked", data);
    //         // console.log('clicledd', event);
    //         d3.select("#details").html(
    //           `<h3>Accident Details</h3>
    //           <p>Accident ID: ${data.CRASH_ID}</p>
    //           <p>Accident Date: ${data.CRASH_DATETIME}</p>
    //           <p>Accident Severity: ${data.CRASH_SEVERITY_ID}</p>
    //           <p>Road: ${data.MAIN_ROAD_NAME}</p>
    //           <p>City/County: ${data.CITY}/${data.COUNTY_NAME}</p>
    //           `
    //         );
    //       });

    //     //transforms the markers to the right
    //     // lat / lng using the projection from google maps
    //     function transform(d) {
    //       d = new google.maps.LatLng(+d.lat, +d.lon);
    //       d = projection.fromLatLngToDivPixel(d);
    //       return d3
    //         .select(this)
    //         .style("left", d.x - padding + "px")
    //         .style("top", d.y - padding + "px");
    //     }
    //   };
    // };
    // // Bind our overlay to the map…
    // overlay.setMap(this.map);
  }

  colorCircles(circles, clicked) {
    // for (let i = 0; i < circles.length; i++) {
    //   d3.select(`#CRASH${circles[i].CRASH_ID}`).classed("clicked", clicked);
    // }
  }
}
