var globalMap = L.map('map').setView([25, 10], 2);

//map.dragging.disable();
globalMap.scrollWheelZoom.disable();

/* L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
	maxZoom: 8,
	minZoom: 2,
	id: 'mapbox.light',
	noWrap: true
	continuousWorld: false,
}).addTo(map); */


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	if(activeBtn == 0)
		data = {};
	else if(activeBtn == 1)
		data = softwareEngineerData;
	else if(activeBtn == 2)
		data = webDeveloperData;
	else if(activeBtn == 3)
		data = dataAnalystData;
	else if(activeBtn == 4)
		data = networkEngineerData;

	var salary = props && data[props.name] ? "US$" + data[props.name] : "Data unavailable";

	this._div.innerHTML = '<h4>Average salary</h4>' +  (props ?
		'<b>' + props.name + '</b><br />' + salary
		: 'Hover over a country');
};

info.addTo(globalMap);

// get color depending on population density value
function getColor(d) {
	return d > 70   ? '#800026' :
	       d > 60   ? '#BD0026' :
	       d > 50   ? '#E31A1C' :
	       d > 40   ? '#FC4E2A' :
	       d > 30   ? '#FD8D3C' :
	       d > 20   ? '#FEB24C' :
	       d > 10   ? '#FED976' :
	       d > 0    ? '#FFEDA0' : 
       					'white';
}

function style(feature) {
	if(activeBtn == 0)
		return {
			fillColor: '#FFFFFF',
			weight: 2,
			opacity: 1,
			color: '#969E95',
			dashArray: '3',
			fillOpacity: 1.0
		};		
	else if(activeBtn == 1)
		data = softwareEngineerData;
	else if(activeBtn == 2)
		data = webDeveloperData;
	else if(activeBtn == 3)
		data = dataAnalystData;
	else if(activeBtn == 4)
		data = networkEngineerData;

	var salary = data[feature.properties.name] ? parseFloat(data[feature.properties.name]) : -1;

	return {
		fillColor: getColor(salary),
		weight: 2,
		opacity: 1,
		color: '#969E95',
		dashArray: '3',
		fillOpacity: 1.0
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#7A8079',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	globalMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});

	layer.on("click", function(e){
		console.log(feature.properties.name); // botao que tu quiser
		zoomToFeature(e);
	});
}

function loadMap() {
	geojson = L.geoJson(worldData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(globalMap);
}

loadMap();

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10, 20, 30, 40, 50, 60, 70],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? 'k&ndash;' + to + 'k' : 'k+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(globalMap);