'use strict';
var GLOBALFUNCTIONS = (function MapEngine(global) {
	var document = global.document;
	var console = global.console;
	var controllers = document.getElementById('controllers');

	function setUpButton(button, clickCallBack) {
		button.style.display = 'initial';
		button.addEventListener('click', clickCallBack);
	}

	var gm_authFailure = (function KeyManager() {
		var storage = global.localStorage;
		var clearButton = controllers.querySelector('#clearkey');
		var mapsURLWithKey = storage.getItem('MapsURLWithGoogleMapsBrowserKey');

		// call this block of code asynchronously to make sure that it executes AFTER MapEngine() function returns the initializeMap() function (which will be called by the script created in this block)
		global.setTimeout(function() {
			var key;
			if (mapsURLWithKey) {
				makeScript();
				setUpButton(clearButton, removeStoredBrowserKey);
			} else if ((key = global.prompt("Type in your Google Maps API key please!"))) {
				mapsURLWithKey = "https://maps.googleapis.com/maps/api/js?key=" + key + "&callback=initializeMap";
				makeScript();
				setUpButton(clearButton, removeStoredBrowserKey);
				storage.setItem('MapsURLWithGoogleMapsBrowserKey', mapsURLWithKey);
			} else {
				alert("No browser key provided. DIE.");
				throw new Error("Use of Google Maps API without key is deprecated");
			}
		}, 0);

		function makeScript() {
			var script = document.createElement("script");
			script.type = 'text/javascript';
			script.src = mapsURLWithKey;
			document.body.appendChild(script);
		}

		function removeStoredBrowserKey() {
			storage.removeItem('MapsURLWithGoogleMapsBrowserKey');
			clearButton.style.display = 'none';
		}

		function gm_authFailure() {
			removeStoredBrowserKey();
			// storage.removeItem('MainPreferredLocation');
			global.alert('DEATH BY AUTHENTICATION FAILURE\n\nLook at the browser console for details\n\nTRY REFRESHING AND ENTER A VALID KEY');
		};

		return gm_authFailure;
	})();

	var initializeMap = (function MapManager() {
		var selfLocatorButton = controllers.querySelector('#getownlocation');
		var quakesRefresherButton = controllers.querySelector('#refreshquakes');
		var storage = global.sessionStorage;
		var maps; // won't be defined until initializeMap() is called
		var location = JSON.parse(storage.getItem('MainPreferredLocation')) || {
			lat: 51.4778,
			lng: -0.0014
		};
		var map;
		var mainMarker;

		function initializeMap() {
			maps = google.maps; // google.maps is now defined
			// we unfortunately need a new map everytime; you cannot rebind an existing map to the new div element that would be created upon reload
			createNewMap();
			setUpButton(selfLocatorButton, setOwnLocation);
			fetchQuakesData();
			setUpButton(quakesRefresherButton, fetchQuakesData);
		}

		// map initialization factory
		function createNewMap() {
			map = new maps.Map(document.getElementById("map"), {
				zoom: 3,
				center: location
			});
			mainMarker = new maps.Marker({
				position: location,
				map: map,
				icon: 'images/catcon.ico',
				title: 'Royal Observatory at Greenwich',
				animation: maps.Animation.DROP
			});
		}

		var geolocation = global.navigator.geolocation;
		function setOwnLocation() {
			if (geolocation) {
				geolocation.getCurrentPosition(
					function(position) {
						var coords = position.coords;
						location.lat = coords.latitude;
						location.lng = coords.longitude;
						map.setCenter(location);
						mainMarker.setPosition(location);
						mainMarker.setAnimation(maps.Animation.DROP);
						mainMarker.setTitle('You!');
						storage.setItem('MainPreferredLocation', JSON.stringify(location));
					},
					function(error) {
						console.error('ERROR(' + error.code + '): ' + error.message);
						alert(error.message + '\n\nDEFAULTING TO THE ROYAL OBSERVATORY AT GREENWICH');
					},
					{
						enableHighAccuracy: true,
						timeout: 120000,
						maximumAge: 0
					}
				);
			} else {
				console.warn("Your browser doesn't support geolocation. No worries; defaulting to the Royal Observatory at Greenwich.");
			}
		}

		var quakesURL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
		var quakesMarkers = [];

		function deleteQuakesMarkers() {
			var i, numberOfMarkers = quakesMarkers.length;
			for (i = 0; i < numberOfMarkers; ++i) {
				quakesMarkers[i].setMap(null);
			}
			quakesMarkers = [];
		}

		function fetchQuakesData() {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4 && xhr.status === 200) {
					if (quakesMarkers.length) {
						deleteQuakesMarkers();
					}
					var recentQuakes = JSON.parse(xhr.responseText).features;
					var quake, marker, numberOfQuakes = recentQuakes.length;
					for (var i = 0; i < numberOfQuakes; ++i) {
						quake = recentQuakes[i];
						marker = new maps.Marker({
							position: {
								lat: quake.geometry.coordinates[1],
								lng: quake.geometry.coordinates[0]
							},
							map: map,
							icon: 'images/quakecon.ico',
							title: quake.properties.title
						});
						quakesMarkers.push(marker);
					}
				}
				console.log('Earthquake Data Request is at state ' + xhr.readyState + ' and the current HTTP status is ' + xhr.status);
			};
			xhr.open('GET', quakesURL, true);
			xhr.send();
		}

		return initializeMap;
	})();

	return {
		initializeMap: initializeMap,
		gm_authFailure: gm_authFailure
	};
})(this);

var initializeMap = GLOBALFUNCTIONS.initializeMap;
var gm_authFailure = GLOBALFUNCTIONS.gm_authFailure;
