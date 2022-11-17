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
      includeOr: [],
      includeNot: [],
      severityMin: 1,
      severityMax: 5,
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

    //Add Severity Sliders
    const severitSvg = d3.select("#advanced").append("g");
    severitSvg.append("text").text("Minimum Severity");
    severitSvg
      .append("input")
      .attr("type", "range")
      .attr("min", 1)
      .attr("max", 5)
      .attr("value", 0)
      .on("change", (d) => updateMinSlider(d));
    severitSvg.append("br");
    severitSvg.append("text").text("Maximum Severity");
    severitSvg
      .append("input")
      .attr("type", "range")
      .attr("min", 1)
      .attr("max", 5)
      .attr("value", 5)
      .on("change", (d) => updateMaxSlider(d));
    severitSvg.append("br");

    const updateMinSlider = (d) => {
      this.globalApplicationState.filterOptions.severityMin =
        d.srcElement.value;
      this.updateFilteredData();
    };
    const updateMaxSlider = (d) => {
      this.globalApplicationState.filterOptions.severityMax =
        d.srcElement.value;
      this.updateFilteredData();
    };

    const years = [2016, 2017, 2018, 2019];

    // Add radio buttons for years
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
      this.updateFilteredData();
    };

    //Add checkboxes to correct sections
    const checkGroups = d3
      .selectAll(".checkboxes")
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
      const parentId = d.srcElement.parentElement.parentElement.id;
      let filterOption;
      if (parentId == "checkboxes-and") {
        filterOption = "includeAnd";
      }
      if (parentId == "checkboxes-or") {
        filterOption = "includeOr";
      }
      if (parentId == "checkboxes-not") {
        filterOption = "includeNot";
      }

      let include = this.globalApplicationState.filterOptions[filterOption];
      if (include.includes(d.srcElement.value)) {
        include = include.filter((type) => type !== d.srcElement.value);
      } else {
        include.push(d.srcElement.value);
      }
      this.globalApplicationState.filterOptions[filterOption] = include;
      this.updateFilteredData();
    };

    checkGroups.append("text").text((d) => d.name);
    checkGroups.filter((d, i) => i % 2).append("br");
  }

  updateFilteredData() {
    //First filter by the year
    this.globalApplicationState.filteredData =
      this.globalApplicationState.data.filter((d) =>
        d.CRASH_DATETIME.includes(
          this.globalApplicationState.filterOptions.includeYear
        )
      );

    //Then filter by the severity
    this.globalApplicationState.filteredData =
      this.globalApplicationState.filteredData.filter((d) => {
        let toReturn = true;
        if (
          +d.CRASH_SEVERITY_ID <
            this.globalApplicationState.filterOptions.severityMin ||
          +d.CRASH_SEVERITY_ID >
            this.globalApplicationState.filterOptions.severityMax
        ) {
          toReturn = false;
        }
        return toReturn;
      });

    let includeAnd = this.globalApplicationState.filterOptions.includeAnd;
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

    let includeOr = this.globalApplicationState.filterOptions.includeOr;
    //Then we filter by required 'or' filters
    this.globalApplicationState.filteredData =
      this.globalApplicationState.filteredData.filter((d) => {
        let toReturn = true;
        if (includeOr[0]) {
          toReturn = false;
          includeOr.forEach((attribute) => {
            if (d[attribute]) {
              toReturn = true;
            }
          });
        }
        return toReturn;
      });

    let includeNot = this.globalApplicationState.filterOptions.includeNot;
    //Then we filter by required 'not' filters
    this.globalApplicationState.filteredData =
      this.globalApplicationState.filteredData.filter((d) => {
        let toReturn = true;
        if (includeNot[0]) {
          includeNot.forEach((attribute) => {
            if (d[attribute]) {
              toReturn = false;
            }
          });
        }
        return toReturn;
      });
    this.updatVisualizations();
  }

  updatVisualizations() {
    this.globalApplicationState.map.updateCircles();
    this.globalApplicationState.hourlyDistribution.draw();
    this.globalApplicationState.monthlyDistribution.draw();
  }
}
