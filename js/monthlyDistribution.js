class monthlyDistribution {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
    }

    async draw() {

        // get the height and width of the div
        let width = document.getElementById('monthlyDistribution').clientWidth;
        let height = document.getElementById('monthlyDistribution').clientHeight;
        let margin = { top: 20, right: 20, bottom: 20, left: 50 };

        // generate an x axis for the chart (months)
        let x = d3.scaleBand()
            .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
            .range([0, width - margin.left - margin.right]);

        // function that transforms month number to month name
        let monthName = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
            .range(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);


        // generate a y axis for the chart (number of crashes)
        let y = d3.scaleLinear()
            .domain([0, 10000])
            .range([height - margin.top - margin.bottom, 0]);

        // create the svg element
        let svg = d3.select("#monthlyDistribution")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // create the x axis
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));


        // create the y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(y));

        // group the data by month (d3 v7)
        let groupedData = d3.group(this.globalApplicationState.data.filter(d => d.CRASH_DATETIME.split("/")[2].includes('2019')), d => d.CRASH_DATETIME.split("/")[0]);
        
        console.log('groupedData', groupedData);
        
        const barGap = 10;
        // create bars for how often each month occurs
        svg.selectAll("rect")
            .data(groupedData)
            .enter()
            .append("rect")
            .attr("x", d => x(monthName(d[0])) + barGap/2)
            .attr("y", d => y(d[1].length))
            .attr("width", x.bandwidth() - barGap)
            .attr("height", d => height - margin.top - margin.bottom - y(d[1].length))
            .attr("fill", "red")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    }
}