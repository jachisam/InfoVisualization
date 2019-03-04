// Scatter Plot of Sentiment Scale for all stories

d3.json("stories_dummy.json", function(data) {
    // console.log(data);
    scatterDict = transformData(data);
    appendStories(data.stories);
    // scatterplot(data.stories);
});

function transformData(data){
  tData = data.stories;
  scatterDict = {};
  tData.forEach(function (d) {
      scatterDict[d.firstName] = [d.ss, d.wc_total];
  });
  return scatterDict;
}

function appendStories(data){
  console.log(data);

  var p = d3.select("#text-area").selectAll("td")
    .data(data)
    .enter()
    .append("tr")
    .append("td")
    .text(function(d){
      return d.firstName;
    });
}

function scatterplot(data){
  console.log(data);

  var svgContainer = d3.select("body").append("svg")
    .attr("width", 700)
    .attr("height", 700);

  var circles = svgContainer.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d, index){
      console.log(d);
      sentiment_score = d.ss;
      return sentiment_score + (index*55);
    })
    .attr("cy", 25)
    .attr("r", 25).
    style("fill", "lightyellow");
}




function scatterplot(data){

}
