class filter {
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;

    this.globalApplicationState.filteredData = this.globalApplicationState.data
      .filter((d) => d.CRASH_DATETIME.includes("2019"))
      .slice(0, 1000);

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
      .on("change", (d) => updateRadio(d))
      .filter((d, i) => +d === 2019)
      .attr("checked", "true");
    radioGroups.append("text").text((d) => d);

    const updateRadio = (radioEvent) => {
      console.log(radioEvent.srcElement.value);
      this.globalApplicationState.filteredData =
        this.globalApplicationState.data
          .filter((d) => d.CRASH_DATETIME.includes(radioEvent.srcElement.value))
          .slice(0, 1000);
      this.globalApplicationState.map.updateCircles();
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

    function updateCheck(d) {
      console.log("data", d.srcElement.value);
    }

    checkGroups.append("text").text((d) => d.name);
    checkGroups.filter((d, i) => i % 2).append("br");
  }
}
