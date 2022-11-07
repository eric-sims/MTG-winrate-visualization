
Promise.all([d3.csv('../data/Utah_Crash_Data_2020.csv')]).then( data =>
    {
        let crashData = data[0];

        globalApplicationState.map = new googleMap(crashData);
        globalApplicationState.map.draw();
    });


const globalApplicationState = {
    map: null,
    data: null,
    lineChartSeasonal: null,
    lineChartHourly: null,
    filterSection: null,
};