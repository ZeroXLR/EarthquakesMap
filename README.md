# Description:

This is a project to accustom myself with external APIs. Namely, it uses

1. __Google__'s [Google Maps JavaScript API] (https://developers.google.com/maps/documentation/javascript/) to display a world map  with markers and
2. __USGS__'s [Real-Time Earthquake Feed] (http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) to get the earthquake data in __GeoJSON__ format

Its idea is inspired by the __Coursera__ MOOC [Object Oriented Programming in Java] (https://www.coursera.org/learn/object-oriented-java) (taught by __UCSD__).

# Installation:

To get a local copy of this game on your machine, run

* **git clone [https://github.com/ZeroXLR/EarthquakesMap.git](https://github.com/ZeroXLR/EarthquakesMap.git)**

Doing this will create a folder called **EarthquakesMap**. In there, open the file **earthquakesmap.html** on your preferred browser to view recent earthquakes around the world. Note that on your very first run, the app will ask you to input a browser key to access Google's Map services. To get a browser key, [**click here**](https://developers.google.com/maps/documentation/javascript/get-api-key) and choose the free standard plan.

# Notes:

1. __Google__ is slowly putting a clamp on their "free" Maps APIs. Nowadays, they recommend you [**to get a browser key**] (https://developers.google.com/maps/documentation/javascript/get-api-key) to monitor whether you go above their *25000-map-loads-per-day limit*.
2. No. The __USGS__ cannot predict earthquakes - no one can. So I am not handing you quake forecasts.
3. This is a work in progress. I will slowly continue adding features that I deem fit. I am open to suggestions.
