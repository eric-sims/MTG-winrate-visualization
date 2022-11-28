class monthlyDistribution {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
  }

  async draw() {
    // remove previous svg
    d3.select("#monthlyDistribution").selectAll("svg").remove();

    // group the data by month (d3 v7)
    let groupedData = d3.group(
      this.globalApplicationState.filteredData,
      (d) => d.CRASH_DATETIME.split("/")[0]
    );
    // console.log(this.globalApplicationState.filteredData[102]);
    // console.log(this.globalApplicationState.filteredData[102].CRASH_DATETIME.split("/")[0]);
    // console.log('groupedData', groupedData);

    // get the height and width of the div
    let width = document.getElementById("monthlyDistribution").clientWidth;
    let height = document.getElementById("monthlyDistribution").clientHeight;
    let margin = { top: 20, right: 20, bottom: 20, left: 50 };

    // generate an x axis for the chart (months)
    let x = d3
      .scaleBand()
      .domain([
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ])
      .range([0, width - margin.left - margin.right]);

    // function that transforms month number to month name
    let monthName = d3
      .scaleOrdinal()
      .domain([
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ])
      .range([
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]);

    // generate a y axis for the chart (number of crashes)
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(groupedData, (d) => d[1].length)])
      .range([height - margin.top - margin.bottom, 0]);

    // create the svg element
    let svg = d3
      .select("#monthlyDistribution")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // add title to the chart
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 + margin.top)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Crashes per Month");

    // create the x axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // create the y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y));

    const barGap = 10;

    const rects = svg
      .selectAll("rect")
      .data(groupedData)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => x(monthName(d[0])) + barGap / 2)
            .attr("y", (d) => y(0))
            .attr("width", x.bandwidth() - barGap)
            .attr("height", (d) => height - margin.top - margin.bottom - y(0))
            .attr("fill", "#fa4d1f")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .transition()
            .duration(1000)
            .attr("y", (d) => y(d[1].length))
            .attr(
              "height",
              (d) => height - margin.top - margin.bottom - y(d[1].length)
            ),
        (update) =>
          update
            .transition()
            .duration(1000)
            .attr("y", (d) => y(d[1].length))
            .attr(
              "height",
              (d) => height - margin.top - margin.bottom - y(d[1].length)
            ),
        (exit) => exit.remove()
      );

    // if a mouse is hovering over a bar, highlight it as well as the data points on the map, and display the number of crashes, while hovering over the bar
    rects.on("mouseover", (event, d) => {
      d3.select(event.target).classed("hovered", true);
      d3.select("#monthlyDistribution")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("top", event.pageY + 10 + "px")
        .style("left", event.pageX + 10 + "px")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .text(d[1].length + " crashes");

      // this.globalApplicationState.filteredData = d[1];
      // this.globalApplicationState.map.updateCircles();
    });

    // if the mouse is no longer hovering over a bar, remove the highlight and the tooltip
    rects.on("mouseout", (event, d) => {
      d3.select(event.target).classed("hovered", false);
      d3.select("#tooltip").remove();
    });

    // if a bar is clicked, filter the data to only include the data points that occurred in that month
    rects.on("click", (event, d) => {
      // console.log(d[1]);
      // console.log(event);
      // console.log(d);

      d3.select(event.target).classed(
        "clicked",
        !d3.select(event.target).classed("clicked")
      );

      this.globalApplicationState.map.colorCircles(
        d[1],
        d3.select(event.target).classed("clicked")
      );
    });
  }
}
