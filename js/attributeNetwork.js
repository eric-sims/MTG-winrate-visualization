class attributeNetwork {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;
    this.links = this.globalApplicationState.links;
  }

  async draw() {
    this.simulation = d3.forceSimulation();

    this.categories = this.globalApplicationState.booleanDataNames;
    this.selectedAttribute = this.categories[0].type;

    this.mapCategoryToData();

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

    this.colors = d3
      .scaleLinear()
      .domain(d3.ticks(0, 50, 11))
      .range([
        "#5E4FA2",
        "#3288BD",
        "#66C2A5",
        "#ABDDA4",
        "#E6F598",
        "#FFFFBF",
        "#FEE08B",
        "#FDAE61",
        "#F46D43",
        "#D53E4F",
        "#9E0142",
      ]);

    const groups = svg.selectAll("g").data(this.categories).join("g");
    groups
      .append("circle")
      .attr("cx", (d) => d.value * 100)
      .attr("cy", 100)
      .attr("r", 20)
      .style("fill", (d, i) => this.colors(i));
    groups
      .append("image")
      .attr("xlink:href", "assets/CarSvg3.svg")
      .attr("x", (d) => d.value * 100)
      .attr("y", 100)
      .attr("height", 40)
      .attr("width", 40);

    this.arrangeCars();

    this.tooltip = d3
      .select("#attributeNetwork")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");
    const that = this;
    // Three function that change the tooltip when user hover / move / leave a cell
    this.mouseover = function (event, d) {
      that.tooltip.style("opacity", 1);
    };

    this.mousemove = function (event, d) {
      if (d.type === that.selectedAttribute) {
        that.tooltip
          .html(d.name + "<br>" + d.count + " total count.")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      } else {
        that.tooltip
          .html(
            d.name +
              "<br>" +
              +d.count +
              " count. <br>" +
              d.overlap.toFixed(3) +
              "% overlap."
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      }
    };

    this.mouseleave = function (d) {
      that.tooltip.style("opacity", 0);
    };

    d3.selectAll("image")
      .on("mouseover", this.mouseover)
      .on("mousemove", this.mousemove)
      .on("mouseleave", this.mouseleave);
  }

  mapCategoryToData() {
    let values = this.links.filter(
      (item) =>
        item.source === this.selectedAttribute ||
        item.target === this.selectedAttribute
    );
    const temp = this.globalApplicationState.data.filter((d) => d[this.selectedAttribute])
    this.valueMax = temp.length;
    this.localMax = d3.max(
      values
        .filter(
          (value) =>
            value.source === this.selectedAttribute ||
            value.target === this.selectedAttribute
        )
        .map((d) => d.value)
    );
    this.categories = this.categories.map((item) => {
      let count = values.filter(
        (value) => value.source === item.type || value.target === item.type
      )[0].value;
      if (item.type === this.selectedAttribute) {
        return {
          value: 1,
          name: item.name,
          type: item.type,
          count: this.valueMax,
        };
      }
      return {
        value: count / this.localMax,
        overlap: (count / this.valueMax) * 100,
        name: item.name,
        type: item.type,
        count,
      };
    });
  }

  arrangeCars() {
    const that = this;
    let values = this.links.filter(
      (item) =>
        item.source === this.selectedAttribute ||
        item.target === this.selectedAttribute
    );

    this.xScale = d3.scaleLinear().domain([this.localMax, 0]).range([20, 780]);

    this.simulation.stop();
    this.simulation = d3
      .forceSimulation()
      .nodes([...this.categories])
      .force("x", d3.forceX((d) => 20 + 755 * (1 - d.value)).strength(1.5))
      .force("y", d3.forceY(300 / 2).strength(0.1))
      .force("collision", d3.forceCollide().radius(20))
      .on("tick", ticked);

    function ticked() {
      that.circles
        .transition()
        .duration(45)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => {
          if (d.type === that.selectedAttribute) {
            return 25;
          } else {
            return d.y;
          }
        })
        .attr("stroke-width", 5)
        .attr("stroke", (d) => {
          if (d.type === that.selectedAttribute) {
            return "gold";
          } else {
            return "none";
          }
        });
      that.cars
        .transition()
        .duration(45)
        .attr("x", (d) => d.x - 19)
        .attr("y", (d) => {
          if (d.type === that.selectedAttribute) {
            return 10;
          } else {
            return d.y - 15;
          }
        });
    }

    d3.select("#attributeNetwork")
      .select("svg")
      .selectAll("g")
      .data(this.categories)
      .join(
        (join) => {
          join
            .select("circle")
            .attr("cx", (d) => 20 + 755 * (1 - d.value)) //value 795 width 20 padding 20+ 840*(1-value)
            .attr("r", 20)
            .style("fill", (d, i) => this.colors(i));
          join
            .select("image")
            .transition()
            .duration(1000)
            .attr("x", (d) => 20 + 755 * (1 - d.value) - 19);
        },
        (update) => {
          update
            .select("circle")
            .attr("r", 20)
            .transition()
            .duration(1000)
            .attr("cx", (d) => 20 + 755 * (1 - d.value));
          update
            .select("image")
            .transition()
            .duration(1000)
            .attr("x", (d) => 20 + 755 * (1 - d.value) - 19);
        },
        (exit) => exit.remove()
      );

    this.circles = d3
      .select("#attributeNetwork")
      .select("svg")
      .selectAll("circle");
    this.cars = d3.select("#attributeNetwork").select("svg").selectAll("image");

    // create an axis
    this.axis = d3.axisBottom(this.xScale);
    d3.select("#attribute-axis-label").remove();
    d3.select("#attribute-axis").remove();

    d3.select("#attributeNetwork")
      .select("svg")
      .append("g")
      .attr("id", "attribute-axis")
      .attr("transform", `translate(0, 300)`)
      .call(this.axis);

    // add axis label
    d3.select("#attributeNetwork")
      .select("svg")
      .append("text")
      .attr("id", "attribute-axis-label")
      .attr("x", 800 / 2)
      .attr("y", 350 - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Overlap Count with Selected Attribute");
  }
}
