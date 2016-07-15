//Load data from a csv file
d3.csv("tags-count.csv", function (data) {
  var frequency_list = [{"text":"test","size":1}];
  var width = 1000;
  var height = 500;


  data.forEach(function(d) { 
    frequency_list.push({"text":d.Word,"size":d.Time});

  });

//Set colors
var color = d3.scale.linear()
      .domain([0,1,2,3,4,5,6,10,15,20,100,1000])
      .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222","#222"]);

//Create the word cloud
d3.layout.cloud().size([width, height])
  .words(frequency_list)
  .rotate(0)
  .fontSize(function(d) {
      var f = d.size/3;
      if(f < 5){
        return 8;
      }
      if(f < 10){
        return 10;
      }
      else{
        return d.size/3; 
      }
  })
  .on("end", draw)
  .start();

//Draw the TagCloud
function draw(words) {
  d3.select("#tagcloud-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "wordcloud")
    .append("g")
    .attr("transform", "translate("+ width/2 +","+ height/2 +")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { 
          return d.size + "px"; 
      })
      .style("fill", function(d, i) { return color(i); })
      .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
  })
  .text(function(d) { return d.text; })
  .on("click", function(d) {
    var values = d.size*5;
      console.log(d.text);
    });
    }
});