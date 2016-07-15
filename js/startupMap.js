var seniorCompensationChart = dc.barChart("#senior-compensation-chart").ordinalColors(['#26a69a','#ff9800']);
var juniorCompensationChart = dc.barChart("#junior-compensation-chart").ordinalColors(['#26a69a','#ff9800']);

var markers = d3.map();
var clusterGroup = L.markerClusterGroup({
    singleMarkerMode: true
});
var idDimension, idGroup;

// Leaflet map
var map = L.map('mapid').setView([25, 10], 2);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 14
}).addTo(map);

map.scrollWheelZoom.disable();

// load data from a json file
d3.json("angel-processed-data.json", function (data) {

    //fix the data
    data.forEach(function(d,idx) {
        //add id field
        d.id = idx;

        //cheating coordinates
        d.lat = d.lat + 0.05*Math.random();
        d.lng = d.lng + 0.05*Math.random();

        //fix China salaries
        if(d.country == "China") {
            d.juniorCompensation = (d.juniorCompensation / 1.37) * 0.15;
            d.seniorCompensation = (d.seniorCompensation / 1.37) * 0.15;
        }

    });

    // Run the data through crossfilter and load our 'facts'
    var facts = crossfilter(data);

    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }

    /////////////// SENIOR COMPENSATION ////////////////////////////////////////////

    //Create a dimension for Senior Compensation (ranges 10k - 20k - 30k - ...)
    var seniorCompensationDim = facts.dimension(function(d){
        return Math.floor(d.seniorCompensation / 10)*10;
    });

    var internSeniorGroup = seniorCompensationDim.group().reduceSum(function(d){return d.jobType.indexOf("Internship") == -1?0:1;});
    var fulltimeSeniorGroup = seniorCompensationDim.group().reduceSum(function(d){return d.jobType.indexOf("Full Time") == -1?0:1;});

    seniorCompensationChart.width(600)
            .height(300)
            .margins({left: 50, top: 10, right: 10, bottom: 40})
            .dimension(seniorCompensationDim)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .yAxisLabel('Number of jobs', 20)
            .xAxisLabel('Salary', 20)
            .renderLabel(true)
            .group(fulltimeSeniorGroup, 'Full Time')
            .stack(internSeniorGroup, 'Internship')
            .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
            .on("filtered", function(chart, filter) {
                updateMarkers();
            });

    ///////////// JUNIOR COMPENSATION ////////////////////////////////////////////////

    //Create a dimension for Senior Compensation (ranges 10k - 20k - 30k - ...)
    var juniorCompensationDim = facts.dimension(function(d){
        return Math.floor(d.juniorCompensation / 10)*10;
    });

    var internJuniorGroup = juniorCompensationDim.group().reduceSum(function(d){return d.jobType.indexOf("Internship") == -1?0:1;});
    var fulltimeJuniorGroup = juniorCompensationDim.group().reduceSum(function(d){return d.jobType.indexOf("Full Time") == -1?0:1;})

    juniorCompensationChart.width(600)
            .height(300)
            .margins({left: 50, top: 10, right: 10, bottom: 40})
            .dimension(juniorCompensationDim)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .yAxisLabel('Number of jobs', 20)
            .xAxisLabel('Salary', 20)
            .renderLabel(true)
            .group(fulltimeJuniorGroup, 'Full Time')
            .stack(internJuniorGroup, 'Internship')
            .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
            .on("filtered", function(chart, filter) {
                updateMarkers();
            });


    ///////////// JOBS MAP ////////////////////////////////////////////////

    //IdDimension and IdGroup
    idDimension = facts.dimension(function(d) { return d.id; });
    idGroup = idDimension.group(function(id) { return id; });

    data.forEach(function(d){
        var circle = L.marker([d.lat, d.lng], 300000, {
            color: '#fd8d3c',
            weight: 2,
            fillColor: '#fecc5c',
            fillOpacity: 0.5,
        });

        var popupText = "<b>" + d.name + "</b>"
                + "<br>US$" + d.juniorCompensation.toFixed(2)
                + "k - US$" + d.seniorCompensation.toFixed(2)
                + "k<br>" + d.jobType.toString().replace(",",", ")
                + "<br>" + d.city
                + "<br>Tags: " + d.tags.toString().replace(/,/g,", ");

        circle.bindPopup(popupText);

        circle.publicid = d.id;

        markers.set(d.id, circle);

//            var tooltip = L.tooltip({
//                target: circle,
//                map: map,
//                html: d.name
//                + "<br>Junior Comp.: US$" + d.juniorCompensation.toFixed(2)
//                + "k<br>Senior Comp.: US$" + d.seniorCompensation.toFixed(2)
//                + "k<br>Job Type: " + d.jobType
//                + "<br>" + d.city,
//                padding: '4px 8px'
//            });
    });

    ///////////// RENDER ALL ////////////////////////////////////////////////

    // Render the Charts
    dc.renderAll();

    updateMarkers();

});

function updateMarkers() {
    var ids = idGroup.all();
    clusterGroup.clearLayers();
    for (var i = 0; i < ids.length; i++) {
        var tId = ids[i];
        if(tId.value > 0){ //when an element is filtered, it has value > 0
            clusterGroup.addLayer(markers.get(tId.key));
        }
    }
    clusterGroup.addTo(map); //add it again passing the array of markers
}

clusterGroup.on('clustermouseover', function (a) {
    // a.layer is actually a cluster
    a.layer.title("fdfdsfsdfd");
    console.log('cluster ' + a.layer.getAllChildMarkers().length);
});