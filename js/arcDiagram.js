class arcDiagram {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
        this.links = this.globalApplicationState.links;

    }

    draw() {
        // set margins and dimensions
        let margin = { top: 30, right: 30, bottom: 200, left: 200 };
        let width = 800 - margin.left - margin.right //document.getElementById('arcDiagram').clientWidth;
        let height = 800 - margin.top - margin.bottom  //document.getElementById('arcDiagram').clientHeight;

        // create svg
        let svg = d3.select("#arcDiagram")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // // add title to the chart
        // svg.append("text")
        //     .attr("x", (width / 2))
        //     .attr("y", 0 + (margin.top))
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "16px")
        //     .style("text-decoration", "underline")
        //     .text("Crash Type Comparisons");

        // list of categories
        var categories = ["COMMERCIAL_MOTOR_VEH_INVOLVED", "DISTRACTED_DRIVING", "DOMESTIC_ANIMAL_RELATED", "DROWSY_DRIVING", "DUI", "IMPROPER_RESTRAINT",
                    "INTERSECTION_RELATED", "MOTORCYCLE_INVOLVED", "NIGHT_DARK_CONDITION", "OLDER_DRIVER_INVOLVED", "OVERTURN_ROLLOVER", "PEDESTRIAN_INVOLVED",
                    "ROADWAY_DEPARTURE", "SINGLE_VEHICLE", "TEENAGE_DRIVER_INVOLVED", "UNRESTRAINED", "WILD_ANIMAL_RELATED", "WORK_ZONE_RELATED", "BICYCLIST_INVOLVED"]

        // Build X scales and axis orient labels diagonally
        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(categories)
            .padding(0.01);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");


        // Build Y scales and axis
        const y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(categories)
            .padding(0.01);
        svg.append("g")
            .call(d3.axisLeft(y))
        

        // Build color scale
        const myColor = d3.scalePow()
            .exponent(0.5)
            .range(["yellow", "red"])
            .domain([0, d3.max(this.links, d => d.value)]);

        const tooltip = d3.select("#arcDiagram")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {
            tooltip.style("opacity", 1)
        }
        const mousemove = function(event,d) {
            // draw the tooltip in the correct location
            tooltip
                .html("Trait 1: " + d.source + "<br>Trait 2: " + d.target + "<br>Frequency: " + d.value)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")


        }
        const mouseleave = function(d) {
            tooltip.style("opacity", 0)
        }
            

        // add rectangles
        svg.selectAll()
            .data(this.links, function(d) {return d.source+':'+d.target;})
            .join("rect")
            .attr("x", function(d) { return x(d.source) })
            .attr("y", function(d) { return y(d.target) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        svg.selectAll()
            .data(this.links, function(d) {return d.target+':'+d.source;})
            .join("rect")
            .attr("x", function(d) { return x(d.target) })
            .attr("y", function(d) { return y(d.source) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.value)} )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

    }

    undraw() {
        // set margins and dimensions
        let margin = { top: 20, right: 20, bottom: 200, left: 50 };
        let width = document.getElementById('arcDiagram').clientWidth;
        let height = document.getElementById('arcDiagram').clientHeight;
        console.log('width', width);
        console.log('height', height);

        // create svg
        let svg = d3.select("#arcDiagram")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // add title to the chart
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 + (margin.top))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Arc Diagram");

        // list of categories
        var categories = ["COMMERCIAL_MOTOR_VEH_INVOLVED", "DISTRACTED_DRIVING", "DOMESTIC_ANIMAL_RELATED", "DROWSY_DRIVING", "DUI", "IMPROPER_RESTRAINT",
                    "INTERSECTION_RELATED", "MOTORCYCLE_INVOLVED", "NIGHT_DARK_CONDITION", "OLDER_DRIVER_INVOLVED", "OVERTURN_ROLLOVER", "PEDESTRIAN_INVOLVED",
                    "ROADWAY_DEPARTURE", "SINGLE_VEHICLE", "TEENAGE_DRIVER_INVOLVED", "UNRESTRAINED", "WILD_ANIMAL_RELATED", "WORK_ZONE_RELATED"]

        // A color scale for groups:
        var color = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeSet3);

        console.log('links', this.links);

        // A linear scale for node size
        var size = d3.scaleLinear()
            .domain([
                d3.min(this.links, function (d) { return d.value; }),
                d3.max(this.links, function (d) { return d.value; })
            ])
            .range([2,10]);

        // A linear scale to position the nodes on the X axis
        var x = d3.scalePoint()
            .range([margin.left, width - margin.right])
            .domain(categories);

        
        // Add the links
        const links = svg
        .selectAll('mylinks')
        .data(this.links)
        .join('path')
        .attr('d', d => {
            var start = x(d.source)    // X position of start node on the X axis
            var end = x(d.target)      // X position of end node
            return ['M', start, height-(margin.bottom + 30),    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', height-(margin.bottom + 30)] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "grey")
        .style("stroke-width", 1);

        // Add the circle for the nodes
        const nodes = svg
        .selectAll("mynodes")
        .data(categories)
        .join("circle")
            .attr("cx", d=>x(d))
            .attr("cy", height-( margin.bottom + 30))
            .attr("r", d=>20)
            .style("fill", d=> color(d))
            .attr("stroke", "white");

        // And give them a label
        const labels = svg
        .selectAll("mylabels")
        .data(categories)
        .join("text")
            .attr("x", 0)
            .attr("y", 0)
            .text(d=>d)
            .style("text-anchor", "end")
            .attr("transform",d=>`translate(${x(d)},${height-(margin.bottom + 5)}) rotate(-45)`)
            .style("font-size", 6)

        // Add the highlighting functionality
        nodes.on('mouseover', function(event,d) {

        // Highlight the nodes: every node is green except of him
        nodes.style('opacity', .2)
        d3.select(this).style('opacity', 1)

        // Highlight the connections
        links
            .style('stroke', a => a.source === d || a.target === d.id ? color(d) : '#b8b8b8')
            .style('stroke-opacity', a => a.source === d || a.target === d ? 1 : .2)
            .style('stroke-width', a => a.source === d || a.target === d ? 4 : 1)
        labels
            .style("font-size", b => b === d ? 18.9 : 2)
            .attr("y", b => b === d ? 10 : 0)})
            .on('mouseout', d => {
            nodes.style('opacity', 1)
            links
                .style('stroke', 'grey')
                .style('stroke-opacity', .8)
                .style('stroke-width', '1')
            labels
                .style("font-size", 6 )
        })
    }
}