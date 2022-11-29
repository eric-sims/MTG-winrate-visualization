class bubbleChart {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
    }

    async draw() {
        const that = this;
        // get width and height of div
        let width = 1000;
        let height = 500;
        let margin = { top: 10, right: 30, bottom: 60, left: 30 };
        this.simulation = d3.forceSimulation();

        // create svg
        let svg = d3
            .select("#bubbleChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(0,0)");

        // add title to the chart
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Crash Type Comparisons");
        
        let categories = this.globalApplicationState.booleanDataNames.map((d) => d.type);

        // build a map of category name to frequency, totalScore, and averageScore
        let categoryMap = new Map();
        for (let i = 0; i < categories.length; i++) {
            categoryMap.set(categories[i], {
                frequency: 0,
                totalScore: 0,
                averageScore: 0,
                category: categories[i],
                x: 110,
                y: 110,
            });
        }
        // console.log("BEFORE category map", categoryMap);

        // add data to each category
        let data = this.globalApplicationState.data
        data.forEach((row) => {
            categories.forEach((category) => {
                if (row[category] == true) {
                    let categoryData = categoryMap.get(category);
                    categoryData.frequency += 1;
                    categoryData.totalScore += +row["CRASH_SEVERITY_ID"];
                    categoryMap.set(category, categoryData);
                }
            });
        });

        // calculate average score for each category
        categoryMap.forEach((value, key) => {
            value.averageScore = value.totalScore / value.frequency;
        });

        // console.log("AFTER category map", categoryMap);

        // create an axis scale from 1 to 5
        this.xScale = d3
            .scaleLinear()
            .domain([1, 3])
            .range([margin.left, width - margin.right]);

        // create an axis
        this.axis = d3.axisBottom(this.xScale).ticks(5);
        
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(this.axis);

        // add axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Average Crash Severity");

        // create a scale for the radius of the circles
        this.radiusScale = d3
            .scaleLinear()
            .domain([0, d3.max(categoryMap.values(), (d) => d.frequency)])
            .range([10, 50]);

        // create a scale for the color of the circles
        let colorScale = d3
            .scaleSequential()
            .domain([0, d3.max(categoryMap.values(), (d) => d.averageScore)])
            .interpolator(d3.interpolateBlues);

        const tooltip = d3
            .select("#arcDiagram")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
      
          // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
            tooltip.style("opacity", 1);
        };
          
        const mousemove = function (event, d) {
            tooltip
                .html("Average Crash Severity: " + d.averageScore + "<br>" + "Frequency: " + d.frequency + "<br>" + "Category: " + d.category)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");
        };

        const mouseleave = function (d) {
            tooltip.style("opacity", 0);
        };
      
        // create a circle for each category
        const circles = svg
            .selectAll("circle")
            .data(categoryMap.values())
            .join("circle")
            .attr("r", (d) => this.radiusScale(d.frequency))
            .style("fill", (d) => colorScale(d.averageScore))
            .style("opacity", 0.75)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave);

        this.simulation.stop();
        console.log();
        this.simulation = d3.forceSimulation().nodes([...categoryMap.values()])
            .force("x", d3.forceX(d => that.xScale(d.averageScore)).strength(1))
            .force("y", d3.forceY(height / 2).strength(0.05))
            .force("collision", d3.forceCollide().radius(d => that.radiusScale(d.frequency)))
            .on('tick', ticked);

        function ticked () {
            circles
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }



    }
}