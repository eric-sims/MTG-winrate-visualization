let counties = ["ANY"];
Promise.all([
  d3.csv("./data/Utah_Crash_Data_2020_cleaned.csv", function (d, i) {
    if (!counties.includes(d.COUNTY_NAME)) {
      counties.push(d.COUNTY_NAME);
    }
    return {
      BICYCLIST_INVOLVED: d.BICYCLIST_INVOLVED == "True",
      CITY: d.CITY,
      COMMERCIAL_MOTOR_VEH_INVOLVED: d.COMMERCIAL_MOTOR_VEH_INVOLVED == "True",
      COUNTY_NAME: d.COUNTY_NAME,
      CRASH_DATETIME: d.CRASH_DATETIME,
      CRASH_ID: d.CRASH_ID,
      CRASH_SEVERITY_ID: d.CRASH_SEVERITY_ID,
      DISTRACTED_DRIVING: d.DISTRACTED_DRIVING == "True",
      DOMESTIC_ANIMAL_RELATED: d.DOMESTIC_ANIMAL_RELATED == "True",
      DROWSY_DRIVING: d.DROWSY_DRIVING == "True",
      DUI: d.DUI == "True",
      IMPROPER_RESTRAINT: d.IMPROPER_RESTRAINT == "True",
      INTERSECTION_RELATED: d.INTERSECTION_RELATED == "True",
      LAT_UTM_Y: d.LAT_UTM_Y,
      LONG_UTM_X: d.LONG_UTM_X,
      MAIN_ROAD_NAME: d.MAIN_ROAD_NAME,
      MILEPOINT: d.MILEPOINT,
      MOTORCYCLE_INVOLVED: d.MOTORCYCLE_INVOLVED == "True",
      NIGHT_DARK_CONDITION: d.NIGHT_DARK_CONDITION == "True",
      OLDER_DRIVER_INVOLVED: d.OLDER_DRIVER_INVOLVED == "True",
      OVERTURN_ROLLOVER: d.OVERTURN_ROLLOVER == "True",
      PEDESTRIAN_INVOLVED: d.PEDESTRIAN_INVOLVED == "True",
      ROADWAY_DEPARTURE: d.ROADWAY_DEPARTURE == "True",
      ROUTE: d.ROUTE,
      SINGLE_VEHICLE: d.SINGLE_VEHICLE == "True",
      TEENAGE_DRIVER_INVOLVED: d.TEENAGE_DRIVER_INVOLVED == "True",
      UNRESTRAINED: d.UNRESTRAINED == "True",
      WILD_ANIMAL_RELATED: d.WILD_ANIMAL_RELATED == "True",
      WORK_ZONE_RELATED: d.WORK_ZONE_RELATED == "True",
      lat: d.lat,
      lon: d.lon,
    };
  }),
  d3.json("./data/links.json", function(data) {
    return data;
  })
]).then((data) => {
  globalApplicationState.data = data[0];
  globalApplicationState.counties = counties;
  globalApplicationState.links = data[1]["data"];
  this.filter = new filter(globalApplicationState);

  globalApplicationState.map = new googleMap(globalApplicationState);
  globalApplicationState.map.draw();

  globalApplicationState.monthlyDistribution = new monthlyDistribution(
    globalApplicationState
  );
  globalApplicationState.monthlyDistribution.draw();

    globalApplicationState.hourlyDistribution = new hourlyDistribution(globalApplicationState);
    globalApplicationState.hourlyDistribution.draw();

    globalApplicationState.arcDiagram = new arcDiagram(globalApplicationState);
    globalApplicationState.arcDiagram.draw();
  }
);



const globalApplicationState = {
  map: null,
  data: null,
  filteredData: null,
  hourlyDistribution: null,
  monthlyDistribution: null,
  filterSection: null,
  filterOptions: null,
  arcDiagram: null,
  links: null,
};

function openTab(event, tabName) {
  d3.selectAll(".tabcontent").classed("d-none", true);
  d3.select("#" + tabName).classed("d-none", false);
  d3.selectAll(".tablinks").classed("active", false);
  d3.select("#" + tabName + "-button").classed("active", true);
}
