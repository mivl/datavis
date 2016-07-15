var countriesWorthItChart = dc.rowChart("#countries-worth-it-chart");

d3.csv("countries-cost-living-rent.csv", function(data) {

    //parse data to float
    data.forEach(function(d){
       d.costPerMonth = +d.costPerMonth;
       d.rentPerMonth = +d.rentPerMonth;
    });

    var facts = crossfilter(data);

    var countryDim = facts.dimension(function(d){
       return d.country;
    });

    var countryWorthGroup = countryDim.group().reduceSum(function(d){
        if (softwareEngineerData[d.country]) {
            var salary = parseFloat(softwareEngineerData[d.country].replace(",",""));
            return salary - (12 * (d.costPerMonth + d.rentPerMonth));
        }
        return 0;
    });

    var filtered_group = remove_empty_bins(countryWorthGroup);

    console.log(filtered_group.all());

    countriesWorthItChart.width(868)
            .height(1000)
            .gap(2)
            .elasticX(true)
            .dimension(countryDim)
            .group(filtered_group)
            .title(function(d){return d.key + " US$" + (d.value / 1000).toFixed(2) + "k";})
            .ordering(function(d) { return -d.value; })
            .linearColors(["#fc8d59", "#ffffbf", "#91bfdb"])
            .colorDomain([-10000, 10000, 50000])
            .colorAccessor(function(d){return d.value;})
            .xAxis().ticks(8).tickFormat(function(h){return "US$" + h/1000 + "k";});

    countriesWorthItChart.filter = function() {};
    // Render the Charts
    dc.renderAll();
});

function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value != 0;
            });
        }
    };
}