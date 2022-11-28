class bubbleChart {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
    }

    async draw() {
        console.log("Drawing bubble chart");
        // get width and height of div
        let width = document.getElementById("bubbleChart").clientWidth;
        let height = document.getElementById("bubbleChart").clientHeight;

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
        
        let categories = this.globalApplicationState.booleanDataNames;

        


    }
}