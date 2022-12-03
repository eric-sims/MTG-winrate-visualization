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
      selectedCounty: "ANY",
      startRange: 0,
    };

    this.globalApplicationState.dataLimit = 5000;

    const booleanDataNames = [
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

    this.globalApplicationState.booleanDataNames = booleanDataNames;

    const selectorGroup = d3.select("#advanced").append("g");
    selectorGroup.append("text").text("County:");
    let citySelect = selectorGroup
      .append("select")
      .attr("id", "city-select")
      .on("change", (d) => onCityChange(d));
    citySelect
      .selectAll("option")
      .data(this.globalApplicationState.counties)
      .join("option")
      .text((d) => d)
      .attr("type", (d) => d);
    selectorGroup.append("br");

    const onCityChange = (d) => {
      this.globalApplicationState.filterOptions.selectedCounty =
        d.srcElement.value;
      this.updateFilteredData();
    };

    //Add Severity Sliders
    //TODO need to add scale for these
    const severitGroup = d3.select("#advanced").append("g");
    severitGroup.append("text").text("Minimum Severity ");

    const minSev = severitGroup
      .append("select")
      .attr("id", "min-sev")
      .on("change", (d) => updateMinSlider(d));
    minSev
      .selectAll("option")
      .data([1, 2, 3, 4, 5])
      .join("option")
      .text((d) => d)
      .attr("type", (d) => d);

    severitGroup.append("br");
    severitGroup.append("text").text("Maximum Severity ");

    const maxSev = severitGroup
      .append("select")
      .attr("id", "max-sev")
      .on("change", (d) => updateMaxSlider(d));
    maxSev
      .selectAll("option")
      .data([1, 2, 3, 4, 5])
      .join("option")
      .text((d) => d)
      .attr("type", (d) => d)
      // default to max
      .attr("selected", (d) => (d === 5 ? "selected" : null));

    severitGroup.append("br");

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

    const limitGroup = d3
      .select("#advanced")
      .append("g")
      .attr("id", "limitgroup");
    limitGroup.append("text").text("Map limit:");
    limitGroup
      .append("input")
      .attr("type", "number")
      .attr("value", this.globalApplicationState.dataLimit)
      .on("change", (d) => updateLimit(d));
    limitGroup.append("br");

    const updateLimit = (d) => {
      this.globalApplicationState.dataLimit = d.srcElement.value;
      this.updateDisclaimerText();
    };
    limitGroup.append("text").attr("id", "limitDisclaimer");
    limitGroup.append("br");
    limitGroup
      .append("text")
      .text(
        "WARNING: displaying this many results can cause serious lag when zooming or navigating the map," +
          " we reccomend filtering the data you are interested in or reducing the limit"
      )
      .attr("id", "limitWarning")
      .classed("d-none", true);
    this.updateDisclaimerText();

    // add a slider whose min is 0 and max is the number of data points

    const sliderGroup = d3.select("#advanced").append("g").attr("id", "sliderGroup");
    sliderGroup.append("text").text("Data Shown:");
    sliderGroup
      .append("input")
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", this.globalApplicationState.filteredData.length)
      .attr("value", 0)
      .attr("class", "slider")
      .attr("id", "myRange")
      .on("change", (d) => updateSlider(d));
    
    // add text under slider
    sliderGroup.append("text").attr("id", "sliderText").text(" (Showing data points 0 to 5000)");

    const updateSlider = (d) => {
      this.globalApplicationState.startRange = d.srcElement.value;
      const sliderText = " (Showing data points " + this.globalApplicationState.startRange + 
                        " to " + (+this.globalApplicationState.startRange + +this.globalApplicationState.dataLimit) + ")";
      console.log(sliderText);
      d3.select("#sliderText").text(sliderText);

      this.updateFilteredData();
    };

    //Add checkboxes to correct sections
    const checkGroups = d3
      .selectAll(".checkboxes")
      .selectAll("g")
      .data(booleanDataNames)
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





  updateDisclaimerText() {
    let limit = this.globalApplicationState.dataLimit;
    let results = this.globalApplicationState.filteredData.length;
    if (limit > results) {
      limit = results;
    }
    let text =
      "Currently showing " + limit + " of " + results + " results on the map.";
    d3.select("#limitDisclaimer").text(text);

    if (limit > 8000) {
      d3.select("#limitWarning").classed("d-none", false);
    } else {
      d3.select("#limitWarning").classed("d-none", true);
    }
    this.globalApplicationState.map?.updateCircles();
  }

  updateFilteredData() {
    //First filter by the year
    this.globalApplicationState.filteredData =
      this.globalApplicationState.data.filter((d) =>
        d.CRASH_DATETIME.includes(
          this.globalApplicationState.filterOptions.includeYear
        )
      );

    //Then filter by county
    if (this.globalApplicationState.filterOptions.selectedCounty !== "ANY") {
      this.globalApplicationState.filteredData =
        this.globalApplicationState.filteredData.filter(
          (d) =>
            d.COUNTY_NAME ===
            this.globalApplicationState.filterOptions.selectedCounty
        );
    }

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
    this.updateDisclaimerText();
    this.updateBarGraphs();
  }




  updateBarGraphs() {
    this.globalApplicationState.hourlyDistribution.draw();
    this.globalApplicationState.monthlyDistribution.draw();
  }
}
