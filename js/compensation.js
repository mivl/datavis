var distributionCompositeChart = dc.compositeChart("#distribution-composite-chart").ordinalColors(['#26a69a','#ff9800']);

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


            ///////////// SENIOR AND JUNIOR SALARIES DISTRIBUTIONS ////////////////////////////////////////////////

    var juniorCompensationDim2 = facts.dimension(function(d){
        return Math.floor(d.juniorCompensation / 10)*10;
    });

    var seniorCompensationDim2 = facts.dimension(function(d){
        return Math.floor(d.seniorCompensation / 10)*10;
    });

    var seniorGroup = seniorCompensationDim2.group();
    var juniorGroup = juniorCompensationDim2.group();

    distributionCompositeChart.width(700)
            .height(300)
            .margins({left: 40, top: 0, right: 20, bottom: 40})
            .x(d3.scale.linear().domain([0,260]))
            .renderHorizontalGridLines(true)
            .elasticY(true)
            .brushOn(false)
            .yAxisLabel('Number of jobs', 20)
            .xAxisLabel('Salary', 20)
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .compose([
                dc.lineChart(distributionCompositeChart)
                        .dimension(seniorCompensationDim2)
                        .group(seniorGroup, "Senior Salaries")
                        .colors("#26a69a")
                        .renderArea(true)
                        .xyTipsOn(true)
                        .renderDataPoints(true),
                dc.lineChart(distributionCompositeChart)
                        .dimension(juniorCompensationDim2)
                        .group(juniorGroup, "Junior Salaries")
                        .colors("#ff9800")
                        .renderArea(true)
                        .xyTipsOn(true)
                        .renderDataPoints(true)
            ])
            .xAxis().tickFormat(function(h){return "$" + h + "k";});
  
  // Render the Charts
    dc.renderAll();

});