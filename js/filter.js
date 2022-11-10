class filter {
  constructor() {
    console.log("in constructor");
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

    const groups = d3
      .select("#checkboxes")
      .selectAll("g")
      .data(booleanData)
      .join("g")
      .classed("text-check-group", true)
      .classed("left", (d, i) => (i % 2) - 1)
      .classed("right", (d, i) => i % 2);

    groups
      .append("input")
      .attr("type", "checkbox")
      .on("change", (d) => update(d));

    function update(d) {
      console.log("data", d);
    }

    groups.append("text").text((d) => d.name);
    groups.filter((d, i) => i % 2).append("br");
  }
}
