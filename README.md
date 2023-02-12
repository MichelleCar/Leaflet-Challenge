# Leaflet: An open-source JavaScript library for mobile-friendly interactive maps
## _Case Study: Earthquake Vizualization_

### Background
The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, you have been tasked with developing a way to visualize USGS data that will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.
##

### Why Leaflet JS is the best tool for the task?
Leaflet is one of the most popular open-source JavaScript libraries for interactive maps. For these reasons, Leaflet is probably the most popular open-source web-mapping library at the moment. As the Leaflet home page puts it, the guiding principle behind this library is simplicity:

“Leaflet doesn’t try to do everything for everyone. Instead it focuses on making the basic things work perfectly.”

Advanced functionality is still available through Leaflet plugins. 

It’s used by websites ranging from The New York Times and The Washington Post to GitHub and Flickr, as well as GIS specialists like OpenStreetMap, Mapbox, and CartoDB. The San Francisco Chronicle, for example, did a project called the [California Fire tracker](https://www.sfchronicle.com/projects/california-fire-map/) — an interactive map that provides information on wildfires burning across California, using Leaflet. Not only did they pinpoint the origin of the fire, but they also showed us the trajectory of it.

Some features include:
* Interactive panning/zooming
* Compose maps using arbitrary combinations of:
    * Map tiles
    * Markers
    * Polygons
    * Lines
    * Popups
    * GeoJSON
* Augment map features using chosen plugins from leaflet plugins repository

### Earthquake Vizualization - Case Study

#### Part 1: Create the Earthquake Visualization
* Using the USGS earthquake data, I chose the "All Earthquakes from the Past 7 Days" data set. 
* I used the URL of the JSON data to pull in the data for the visualization. 
* Using Leaflet, I created a map that plots all the earthquakes from the dataset based on their longitude and latitude.
* I created data markers that reflect the magnitude of the earthquake by their size and the depth of the earthquake by a defined colour scale. Earthquakes with higher magnitudes appear larger, and earthquakes with greater depth appear darker in colour.
* I included popups that provide additional information about the earthquake when its associated marker is clicked.
* Then I created a legend that will provide context for your map data.


#### Part 2: Add Tectonic Plate Data to the Map
* I plotted a second dataset on the map to illustrate the relationship between tectonic plates and seismic activity. I pulled in this dataset from https://github.com/fraxen/tectonicplatesand visualized it alongside the original data.
* I added additional base maps to choose from, including a satellite and outdoors views.
* I put each dataset into separate overlays that can be toggled on and off independently.
* Finally, I added layer/toggle controls to your map to allow the user to interact and customize the view options.


**Live project output**: https://michellecar.github.io/Leaflet-Challenge/

