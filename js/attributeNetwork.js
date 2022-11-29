class attributeNetwork {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.links = this.globalApplicationState.links;
  }

  async draw() {
    this.categories = this.globalApplicationState.booleanDataNames;
    this.selectedAttribute = this.categories[0].type;

    this.mapCategoryToData();
    console.log(this.categories);

    const selectorGroup = d3.select("#attributeNetwork").append("g");
    selectorGroup.append("text").text("Attribute:");
    let attributeSelect = selectorGroup
      .append("select")
      .attr("id", "accident-attribute")
      .on("change", (event) => onAttributeChange(event));
    attributeSelect
      .selectAll("option")
      .data(this.categories)
      .join("option")
      .text((d) => d.name)
      .attr("value", (d) => d.type);
    selectorGroup.append("br");

    let onAttributeChange = (event) => {
      this.selectedAttribute = event.srcElement.value;
      this.mapCategoryToData();
      this.arrangeCars();
    };

    let svg = d3
      .select("#attributeNetwork")
      .append("svg")
      .classed("attribute-network-svg", true);

    svg
      .selectAll("circle")
      .data(this.categories)
      .join("circle")
      .attr("cx", (d) => d.value * 100)
      .attr("cy", 100)
      .attr("r", 20)
      .style("fill", "green");
    this.arrangeCars();
  }

  mapCategoryToData() {
    let values = this.links.filter(
      (item) =>
        item.source === this.selectedAttribute ||
        item.target === this.selectedAttribute
    );
    this.valueMax = d3.count(
      this.globalApplicationState.data,
      (d) => d[this.selectedAttribute]
    );

    this.localMax = d3.max(
      values
        .filter(
          (value) =>
            value.source === this.selectedAttribute ||
            value.target === this.selectedAttribute
        )
        .map((d) => d.value)
    );
    console.log((this.localMax / this.valueMax) * 100);
    this.categories = this.categories.map((item) => {
      if (item.type === this.selectedAttribute) {
        return { value: 1, name: item.name, type: item.type };
      }
      return {
        value:
          values.filter(
            (value) => value.source === item.type || value.target === item.type
          )[0].value / this.localMax,
        name: item.name,
        type: item.type,
      };
    });
  }

  arrangeCars() {
    let values = this.links.filter(
      (item) =>
        item.source === this.selectedAttribute ||
        item.target === this.selectedAttribute
    );
    console.log(this.categories);

    d3.select("#attributeNetwork")
      .select("svg")
      .selectAll("circle")
      .data(this.categories)
      .join(
        (join) => {
          join
            .attr("cx", (d) => 100 - d.value * 100 + "%")
            .attr("cy", 100)
            .attr("r", 20)
            .style("fill", "green");
        },
        (update) => {
          update
            .attr("cy", 100)
            .attr("r", 20)
            .style("fill", "green")
            .transition()
            .duration(1000)
            .attr("cx", (d) => 100 - d.value * 100 + "%");
        },
        (exit) => exit.remove()
      );

    this.xScale = d3
      .scaleLinear()
      .domain([(this.localMax / this.valueMax) * 100, 0])
      .range([10, 800]);

    // create an axis
    this.axis = d3.axisBottom(this.xScale).ticks(5);
    d3.select("#attribute-axis-label").remove();
    d3.select("#attribute-axis").remove();

    d3.select("#attributeNetwork")
      .select("svg")
      .append("g")
      .attr("id", "attribute-axis")
      .attr("transform", `translate(0, 200)`)
      .call(this.axis);

    // add axis label
    d3.select("#attributeNetwork")
      .select("svg")
      .append("text")
      .attr("id", "attribute-axis-label")
      .attr("x", 800 / 2)
      .attr("y", 250 - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Percentage Correlation to Selected Attribute");
  }
}
