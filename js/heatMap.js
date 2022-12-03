class heatMap {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.links = this.globalApplicationState.links;
  }

  async draw() {
    // set margins and dimensions
    let margin = { top: 30, right: 30, bottom: 200, left: 200 };
    let width = 800 - margin.left - margin.right; //document.getElementById('arcDiagram').clientWidth;
    let height = 800 - margin.top - margin.bottom; //document.getElementById('arcDiagram').clientHeight;

    // create svg
    let svg = d3
      .select("#heatMap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var categories = this.globalApplicationState.booleanDataNames;

    // Build X scales and axis orient labels diagonally
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(categories.map((d) => d.name))
      .padding(0.01);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .attr("font-size", "13px")
      .style("text-anchor", "end");

    // Build Y scales and axis
    const y = d3
      .scaleBand()
      .range([height, 0])
      .domain(categories.map((d) => d.name))
      .padding(0.01);
    svg.append("g").call(d3.axisLeft(y)).attr('font-size', '13px');

    // Build color scale
    const myColor = d3
      .scalePow()
      .exponent(0.5)
      //   .range(["#e7d87d", "#b01111"]) // "#b4451f", "#dd9f40",
      .range(["#f5eedb", "#fa4d1f"])
      .domain([0, d3.max(this.links, (d) => d.value)]);

    const tooltip = d3
      .select("#heatMap")
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
            d.sourceName +
            "<br>Trait 2: " +
            d.targetName +
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
        return d.sourceName + ":" + d.targetName;
      })
      .join("rect")
      .attr("x", function (d) {
        return x(d.sourceName);
      })
      .attr("y", function (d) {
        return y(d.targetName);
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
        return d.targetName + ":" + d.sourceName;
      })
      .join("rect")
      .attr("x", function (d) {
        return x(d.targetName);
      })
      .attr("y", function (d) {
        return y(d.sourceName);
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
