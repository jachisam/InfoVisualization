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
    .enter();
  var tr = p.append("tr");
  var sb;
  tr.append("td")
    .text(function(d, index){
      sb = d.neg;
      return 1+ index;
    });
  // var sb = scatter_bool._groups[0][1].innerHTML;
  tr.append("td")
    .text(function(d){
      return d.firstName;
    });
  tr.append("td")
    .text(function(d){
      return d.ss;
    });
  var svgWidth = 250;
  var bar_container = tr.append("td")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", 25);

  console.log(sb);
  var rect1Width = svgWidth * sb / 100;
  var rect = bar_container.append("rect")
     .attr("width", function(d){
       return svgWidth * d.neg / 100;
     })
     .attr("height", 100)
     .style("fill", "blueviolet");

  var rect1 = bar_container.append("rect")
     .attr("x", function(d){
       return svgWidth * d.neg / 100;
     })
     .attr("width", function(d){
       return svgWidth - (svgWidth * d.neg / 100);
     })
     .attr("height", 100)
     .style("fill", "yellow");

}

function scatterplot(data){
  console.log(data);

  // var svgContainer = d3.select("body").append("svg")
  //   .attr("width", 700)
  //   .attr("height", 700);
  //
  // var circles = svgContainer.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", function(d, index){
  //     console.log(d);
  //     sentiment_score = d.ss;
  //     return sentiment_score + (index*55);
  //   })
  //   .attr("cy", 25)
  //   .attr("r", 25).
  //   style("fill", "lightyellow");
}




function scatterplot(data){

}
