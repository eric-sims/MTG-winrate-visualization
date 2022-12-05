# Utah Car Accident Visualization

This project is a visualization of car accidents in Utah. The data is from the Utah Department of Public Safety and is available [here](https://www.udot.utah.gov/main/freight-maps-data/traffic-data/traffic-data-archives).

# What we are handing in

The project has data and the javascript code in two separate folders. The data folder contains the data from the UDOT website. The data folder also contains the python scripts used for some data proccessing. The javascript folder contains the javascript code for the visualization. Refer to script.js for where the code begins.

# Non-obvious features

## Data on Google Map overlay

There are about 250,000 data points that are on this vizualizaiton. The map could only handle drawing about 8,000 of those points at a time. Our first suggestion is to filter the car accidents by data and attributes to get that number lower. We set a limiter in the filter section as well. You can move a slider to show the different data in total.

## Click on accident point for more info

You can click on a point on the map to get more information about the accident. This will show the date, time, and location of the accident. It will also show the severity of the accident.

## Click on a bar in the bar chart to highlight the data on the map

You can click on a bar in the bar chart to highlight the data on the map. This will show the data that is in that bar. You can also click on the bar again to unhighlight the data.

## Tooltip hover on all other visualizations

You can hover over any of the other visualizations to get more information about the data.

# Project Video

<!-- Embed this video https://www.youtube.com/watch?v=_IkwectHK40&ab_channel=AlanBird -->

[![Project Video](https://img.youtube.com/vi/_IkwectHK40/0.jpg)](https://www.youtube.com/watch?v=_IkwectHK40&ab_channel=AlanBird)

# Project Website

The project website is available [here](https://eric-sims.github.io/MTG-winrate-visualization/). (https://eric-sims.github.io/MTG-winrate-visualization/)

# Project Workbook

The project workbook is available [here](https://eric-sims.github.io/MTG-winrate-visualization/ProccessBook.pdf). (https://eric-sims.github.io/MTG-winrate-visualization/ProccessBook.pdf)

# Local Startup

python -m SimpleHTTPServer 8080 (Or html extention) Then navigate to localhost:8080 in your browser.
