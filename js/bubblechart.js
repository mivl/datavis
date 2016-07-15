var costBubbleChart = dc.bubbleChart("#cost-life-bubble-chart");

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


	/////////////// COST OF LIFE BUBBLE CHART //////////////////////////////////////

    var cityDim = facts.dimension(function(d){
       return d.city;
    });

    var cityGroup = cityDim.group();

    var cityCounts = cityGroup.reduceCount().all();
    var countByCity = {};

    Array.prototype.slice.call(cityCounts).forEach(function(d) { countByCity[d.key] = d.value; });
    var cityAvgSalaryGroup = cityGroup.reduceSum(function(d, i) {
        return d.seniorCompensation / countByCity[d.city];
    });

    var cityCostGroup = cityDim.group().reduceSum(function(d){
        return d.costPerYear + d.rentPerYear;
    });

    var cityCostMap = d3.map();

    cityCostGroup.all().forEach(function(d){
        cityCostMap.set(d.key,d.value/countByCity[d.key]);
    });

    function computeSalaryCostDifference(source_group, groupMap) {
        return {
            all:function () {
                return source_group.all().map(function(d) {
                    return {key: d.key,
                        value: {
                            dif: (d.value - groupMap.get(d.key)/1000),
                            cost: (groupMap.get(d.key)/1000),
                            count: countByCity[d.key],
                            avgSal: countByCity[d.key]>4&&d.value>0?d.value:-50
                        }
                    };
                });
            }
        };
    }

    var citySalaryCostDifGroup = computeSalaryCostDifference(cityAvgSalaryGroup, cityCostMap);

    var seniorCompensationDim = facts.dimension(function(d){
        return Math.floor(d.seniorCompensation / 10)*10;
    });

    costBubbleChart.width(1200)
            .height(600)
            .margins({top: 10, right: 50, bottom: 40, left: 50})
            .dimension(seniorCompensationDim)
            .group(citySalaryCostDifGroup)
            .linearColors(["#d7191c", "#ffffbf", "#2c7bb6"])
            .colorDomain([-20, 20, 130])
            .colorAccessor(function(d){return d.value.dif;})
            .keyAccessor(function (p) {
                return p.value.avgSal;
            })
            .valueAccessor(function (p) {
                return p.value.cost;
            })
            .radiusValueAccessor(function (p) {
                return p.value.count;
            })
            .x(d3.scale.linear().domain([0, 160]))
            .r(d3.scale.linear().domain([0, 400]))
            .yAxisLabel('Cost of living', 20)
            .xAxisLabel('Average salary', 10)
            .maxBubbleRelativeSize(0.09)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .renderLabel(true)
            .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
            .renderTitle(true)
            .title(function (p) {
                        return p.key
                                + "\n"
                                + "Average salary: $" + p.value.avgSal.toFixed(2) + "k\n"
                                + "Cost of living: $" + p.value.cost.toFixed(2) + "k\n"
                                + "Remaining salary: $" + p.value.dif.toFixed(2) + "k\n"
                                + "Number of jobs: " + p.value.count;
                    });

    costBubbleChart.filter = function() {};

    costBubbleChart.yAxis().tickFormat(function (s) {
        return "$" + s + "k";
    });
    costBubbleChart.xAxis().tickFormat(function (s) {
        return "$" + s + "k";
    });
  
    // Render the Charts
    dc.renderAll();

});