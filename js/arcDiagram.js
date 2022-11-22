class arcDiagram {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.links = this.globalApplicationState.links;
  }

  draw() {
    // set margins and dimensions
    let margin = { top: 30, right: 30, bottom: 200, left: 200 };
    let width = 800 - margin.left - margin.right; //document.getElementById('arcDiagram').clientWidth;
    let height = 800 - margin.top - margin.bottom; //document.getElementById('arcDiagram').clientHeight;

    // create svg
    let svg = d3
      .select("#arcDiagram")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // add title to the chart
    // svg.append("text")
    //     .attr("x", (width / 2))
    //     .attr("y", 0 + (margin.top))
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "16px")
    //     .style("text-decoration", "underline")
    //     .text("Crash Type Comparisons");

    // list of categories
    // var categories = [
    //   "COMMERCIAL_MOTOR_VEH_INVOLVED",
    //   "DISTRACTED_DRIVING",
    //   "DOMESTIC_ANIMAL_RELATED",
    //   "DROWSY_DRIVING",
    //   "DUI",
    //   "IMPROPER_RESTRAINT",
    //   "INTERSECTION_RELATED",
    //   "MOTORCYCLE_INVOLVED",
    //   "NIGHT_DARK_CONDITION",
    //   "OLDER_DRIVER_INVOLVED",
    //   "OVERTURN_ROLLOVER",
    //   "PEDESTRIAN_INVOLVED",
    //   "ROADWAY_DEPARTURE",
    //   "SINGLE_VEHICLE",
    //   "TEENAGE_DRIVER_INVOLVED",
    //   "UNRESTRAINED",
    //   "WILD_ANIMAL_RELATED",
    //   "WORK_ZONE_RELATED",
    //   "BICYCLIST_INVOLVED",
    // ];

    var categories = this.globalApplicationState.booleanDataNames;

    // Build X scales and axis orient labels diagonally
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(categories.map((d) => d.type))
      .padding(0.01);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Build Y scales and axis
    const y = d3
      .scaleBand()
      .range([height, 0])
      .domain(categories.map((d) => d.type))
      .padding(0.01);
    svg.append("g").call(d3.axisLeft(y));

    // Build color scale
    const myColor = d3
      .scalePow()
      .exponent(0.5)
      //   .range(["#e7d87d", "#b01111"]) // "#b4451f", "#dd9f40",
      .range(["#f5eedb", "#fa4d1f"])
      .domain([0, d3.max(this.links, (d) => d.value)]);

    const tooltip = d3
      .select("#arcDiagram")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
      tooltip.style("opacity", 1);
    };
    const mousemove = function (event, d) {
      // draw the tooltip in the correct location
      tooltip
        .html(
          "Trait 1: " +
            d.source +
            "<br>Trait 2: " +
            d.target +
            "<br>Frequency: " +
            d.value
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    };
    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
    };

    // add rectangles
    svg
      .selectAll()
      .data(this.links, function (d) {
        return d.source + ":" + d.target;
      })
      .join("rect")
      .attr("x", function (d) {
        return x(d.source);
      })
      .attr("y", function (d) {
        return y(d.target);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {
        return myColor(d.value);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    svg
      .selectAll()
      .data(this.links, function (d) {
        return d.target + ":" + d.source;
      })
      .join("rect")
      .attr("x", function (d) {
        return x(d.target);
      })
      .attr("y", function (d) {
        return y(d.source);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {
        return myColor(d.value);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }
}
