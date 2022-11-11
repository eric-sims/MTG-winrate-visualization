class hourlyDistribution {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
    }

    async draw() {
        // generate the height and width of the div
        let width = document.getElementById('hourlyDistribution').clientWidth;
        let height = document.getElementById('hourlyDistribution').clientHeight;
        let margin = { top: 20, right: 20, bottom: 20, left: 50 };

        // generate an x axis for the chart (hours)
        let x = d3.scaleBand()
            .domain(["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"])
            .range([0, width - margin.left - margin.right]);
        
        // generate a y axis for the chart (number of crashes)
        let y = d3.scaleLinear()
            .domain([0, 10000])
            .range([height - margin.top - margin.bottom, 0]);

        // create the svg element
        let svg = d3.select("#hourlyDistribution")
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

        // group the data by hour - including separating am/pm (d3 v7)
        let groupedData = d3.group(this.globalApplicationState.data.filter(d => d.CRASH_DATETIME.split("/")[2].includes('2019')), d => d.CRASH_DATETIME.split(" ")[1].split(":")[0] + d.CRASH_DATETIME.split(" ")[2]);

        console.log('groupedData - hour', groupedData);

        const barGap = 10;
        // create bars for how often each hour occurs
        const rects = svg.selectAll("rect")
            .data(groupedData)
            .enter()
            .append("rect")
            .attr("x", d => x(d[0][0] === "0" ? d[0].slice(1) : d[0]) + barGap/2)
            .attr("y", d => y(d[1].length))
            .attr("width", x.bandwidth() - barGap)
            .attr("height", d => height - margin.top - margin.bottom - y(d[1].length))
            .attr("fill", "red")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // if a mouse is hovering over a bar, highlight it as well as the data points on the map, and display the number of crashes, while hovering over the bar
        rects.on("mouseover", (event, d) => {
            d3.select(event.target).attr("fill", "blue");
            d3.select("#hourlyDistribution").append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("top", event.pageY + 10 + "px")
                .style("left", event.pageX + 10 + "px")
                .style("background-color", "white")
                .style("border", "1px solid black")
                .style("padding", "5px")
                .text(d[1].length + " crashes");
            
            // this.globalApplicationState.filteredData = d[1];
            // this.globalApplicationState.map.draw();
        });

        // if the mouse is no longer hovering over a bar, remove the highlight and the tooltip
        rects.on("mouseout", (event, d) => {
            d3.select(event.target).attr("fill", "red");
            d3.select("#tooltip").remove();
        });

    }
}