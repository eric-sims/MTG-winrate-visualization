class attributeNetwork {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.links = this.globalApplicationState.links;
  }

  async draw() {
    console.log(this.links);

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
    this.categories = this.categories.map((item) => {
      return {
        value: values.filter(
          (value) => value.source === item.type || value.target === item.type
        )[0].value,
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
            .attr("cx", (d) => 100 - d.value / 372.11 + "%")
            .attr("cy", 100)
            .attr("r", 20)
            .style("fill", "green");
        },
        (update) => {
          console.log("here", update);
          update
            .attr("cy", 100)
            .attr("r", 20)
            .style("fill", "green")
            .transition()
            .duration(1000)
            .attr("cx", (d) => 100 - d.value / 372.11 + "%");
        },
        (exit) => exit.remove()
      );
  }
}
