Promise.all([d3.csv("../data/Utah_Crash_Data_2020_cleaned.csv")]).then(
  (data) => {
    globalApplicationState.data = data[0];
    this.filter = new filter(globalApplicationState);

    globalApplicationState.map = new googleMap(globalApplicationState);
    globalApplicationState.map.draw();

    globalApplicationState.monthlyDistribution = new monthlyDistribution(
      globalApplicationState
    );
    globalApplicationState.monthlyDistribution.draw();

    globalApplicationState.hourlyDistribution = new hourlyDistribution(
      globalApplicationState
    );
    globalApplicationState.hourlyDistribution.draw();
  }
);

const globalApplicationState = {
  map: null,
  data: null,
  filteredData: null,
  hourlyDistribution: null,
  monthlyDistribution: null,
  filterSection: null,
};
