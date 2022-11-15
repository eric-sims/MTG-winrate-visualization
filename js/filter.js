class filter {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;

    this.globalApplicationState.filteredData =
      this.globalApplicationState.data.filter((d) =>
        d.CRASH_DATETIME.includes("2019")
      );

    this.globalApplicationState.filterOptions = {
      includeYear: "2019",
      includeAnd: [],
    };

    const booleanData = [
      { type: "BICYCLIST_INVOLVED", name: "Bicyclist Involved" },
      {
        type: "COMMERCIAL_MOTOR_VEH_INVOLVED",
        name: "Comercial Vehicle Involved",
      },
      { type: "DISTRACTED_DRIVING", name: "Distracted Driving" },
      { type: "DOMESTIC_ANIMAL_RELATED", name: "Domestic Animal Related" },
      { type: "DROWSY_DRIVING", name: "Drowsy Driving" },
      { type: "DUI", name: "DUI" },
      { type: "IMPROPER_RESTRAINT", name: "Improper Restraint" },
      { type: "INTERSECTION_RELATED", name: "Intersection Related" },
      { type: "MOTORCYCLE_INVOLVED", name: "Motorcycle Involved" },
      { type: "NIGHT_DARK_CONDITION", name: "Night/Dark Condition" },
      { type: "OLDER_DRIVER_INVOLVED", name: "Older Driver Involved" },
      { type: "OVERTURN_ROLLOVER", name: "Overturn Rollover" },
      { type: "PEDESTRIAN_INVOLVED", name: "Pedestrian Involved" },
      { type: "ROADWAY_DEPARTURE", name: "Roadway Departure" },
      { type: "SINGLE_VEHICLE", name: "Single Vehicle" },
      { type: "TEENAGE_DRIVER_INVOLVED", name: "Teenage Driver Involved" },
      { type: "UNRESTRAINED", name: "Unrestrained" },
      { type: "WILD_ANIMAL_RELATED", name: "Wild Animal Related" },
      { type: "WORK_ZONE_RELATED", name: "Work Zone Related" },
    ];

    const years = [2016, 2017, 2018, 2019];

    const radioGroups = d3
      .select("#year-radio")
      .selectAll("g")
      .data(years)
      .join("g");
    radioGroups
      .append("input")
      .attr("type", "radio")
      .attr("value", (d) => d)
      .attr("name", "year")
      .on("change", (d) => updateYear(d))
      .filter((d, i) => +d === 2019)
      .attr("checked", "true");
    radioGroups.append("text").text((d) => d);

    const updateYear = (radioEvent) => {
      this.globalApplicationState.filterOptions.includeYear =
        radioEvent.srcElement.value;
      updateFilteredData();
    };

    const updateFilteredData = () => {
      let includeAnd = this.globalApplicationState.filterOptions.includeAnd;
      //First filter by the year
      this.globalApplicationState.filteredData =
        this.globalApplicationState.data.filter((d) =>
          d.CRASH_DATETIME.includes(
            this.globalApplicationState.filterOptions.includeYear
          )
        );

      //Then we filter by required 'and' filters
      this.globalApplicationState.filteredData =
        this.globalApplicationState.filteredData.filter((d) => {
          let toReturn = true;
          if (includeAnd[0]) {
            includeAnd.forEach((attribute) => {
              if (!d[attribute]) {
                toReturn = false;
              }
            });
          }
          return toReturn;
        });
      updatVisualizations();
    };

    const updatVisualizations = () => {
      this.globalApplicationState.map.updateCircles();
      this.globalApplicationState.hourlyDistribution.draw();
      this.globalApplicationState.monthlyDistribution.draw();
    };

    const checkGroups = d3
      .select("#checkboxes")
      .selectAll("g")
      .data(booleanData)
      .join("g")
      .classed("text-check-group", true)
      .classed("left", (d, i) => (i % 2) - 1)
      .classed("right", (d, i) => i % 2);

    checkGroups
      .append("input")
      .attr("type", "checkbox")
      .attr("value", (d) => d.type)
      .on("change", (d) => updateCheck(d));

    const updateCheck = (d) => {
      let includeAnd = this.globalApplicationState.filterOptions.includeAnd;
      if (includeAnd.includes(d.srcElement.value)) {
        includeAnd = includeAnd.filter((type) => type !== d.srcElement.value);
      } else {
        includeAnd.push(d.srcElement.value);
      }
      this.globalApplicationState.filterOptions.includeAnd = includeAnd;
      updateFilteredData();
    };

    checkGroups.append("text").text((d) => d.name);
    checkGroups.filter((d, i) => i % 2).append("br");
  }
}
