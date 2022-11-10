Promise.all([d3.csv("../data/Utah_Crash_Data_2020_cleaned.csv")]).then(
  (data) => {
    globalApplicationState.data = data[0];
    globalApplicationState.map = new googleMap(globalApplicationState);
    globalApplicationState.map.drawGoogleMap();

    this.filter = new filter(globalApplicationState);
  }
);

const globalApplicationState = {
  map: null,
  data: null,
  lineChartSeasonal: null,
  lineChartHourly: null,
  filterSection: null,
};
