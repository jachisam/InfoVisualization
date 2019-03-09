// Scatter Plot of Sentiment Scale for all stories
d3.json("/data/englishfairytales_sentiment_analysis.json", function(data) {
    console.log(data);



    //Filter Random
    appendStories(data);
    scatterplot(data);

});

function update(){
  var value = document.getElementById('filter').value;
  console.log(value);
  // var list = document.getElementById("theviz");   // Get the <ul> element with id="myList"
  // if (list.hasChildNodes()) {
  //   for (var i = 0; i < list.length; i++){
  //     list.removeChild(list.childNodes[i]);
  //   }
  // }
  removeContent()  // d3.selectAll("#theviz").children.remove();
  d3.json("/data/englishfairytales_sentiment_analysis.json", function(data) {
      if(value === "aoa"){
        console.log("hi")
        alphabetical_data_asc = filterByAlphabeticalOrder(data, "true");
        appendStories(alphabetical_data_asc);
      }else if(value === "aod"){
        alphabetical_data_dsc = filterByAlphabeticalOrder(data, "false");
        appendStories(alphabetical_data_dsc);
      }else if(value === "ssa"){
        sentiment_data_asc = filterBySentiment(data, "true");
        appendStories(sentiment_data_asc);
      }else if(value === "ssd"){
        sentiment_data_dsc = filterBySentiment(data, "false");
        appendStories(sentiment_data_dsc);
      }else if(value === "random"){
        appendStories(data);
      }
      console.log(data);
  });
}

function removeContent(){
    d3.selectAll("rect").remove();
    d3.selectAll("td").remove();
    d3.selectAll("#text_").remove();
  }

function transformData(data){
  tData = data.stories;
  scatterDict = {};
  tData.forEach(function (d) {
      scatterDict[d.firstName] = [d.ss, d.wc_total];
  });
  return scatterDict;
}

function filterBySentiment(data_, asc){
  if(asc === "true"){
    data_.sort(function(x, y){
     return d3.ascending(x.sentiment_score, y.sentiment_score);
    })
  }
  else{
    data_.sort(function(x, y){
     return d3.descending(x.sentiment_score, y.sentiment_score);
    })
  }
  return data_;
}

function filterByAlphabeticalOrder(data_, asc){
  if(asc === "true"){
    data_.sort(function(x, y){
     return d3.ascending(x.title, y.title);
    })
  }
  else{
    data_.sort(function(x, y){
     return d3.descending(x.title, y.title);
    })
  }
  return data_;
}


function appendStories(data){
  var p = d3.select("#text-area").selectAll("td")
    .data(data)
    .enter();
  var tr = p.append("tr");
  var sb;
  tr.append("td")
    .attr("class", "smaller")
    .attr("id", "text_")
    .text(function(d, index){
      sb = d.negative_score;
      return 1+ index;
    })
    .attr("style", "font-size: 20px;");
  // var sb = scatter_bool._groups[0][1].innerHTML;
  tr.append("td")
    .text(function(d){
      return d.title;
    })
    .attr("id", "text_")
    .attr("style", function(d){
      if(d.sentiment_score < 0){
        return "font-size: 18px; color:indianred;"
      }else if(d.sentiment_score === 0){
        return "font-size: 18px; color:gray;"
      }
      else{
        return "font-size: 18px; color:lightblue;"
      }
    });
  tr.append("td")
    .text(function(d){
      return d.sentiment_score+"%";
    })
    .attr("id", "text_")
    .attr("style", function(d){
      if(d.sentiment_score < 0){
        return "font-size: 20px; color:indianred;"
      }else if(d.sentiment_score === 0){
        return "font-size: 20px; color:gray;"
      }
      else{
        return "font-size: 20px; color:lightblue;"
      }
    });
  var svgWidth = 250;
  var bar_container = tr.append("td");
  var svgg = bar_container.append("svg")
    .attr("width", svgWidth)
    .attr("height", 35);

  var rect1Width = svgWidth * sb / 100;
  var rect = svgg.append("rect")
     .attr("width", function(d){
       return svgWidth * d.negative_score / 100;
     })
     .attr("height", 25)
     .style("fill", "indianred");

  var rect1 = svgg.append("rect")
     .attr("x", function(d){
       return svgWidth * d.negative_score / 100;
     })
     .attr("width", function(d){
       return svgWidth - (svgWidth * d.negative_score / 100);
     })
     .attr("height", 25)
     .style("fill", "lightblue");

  var vertRect = svgg.append("rect")
    .attr("x", "50%")
    .attr("y", "0")
    .attr("width", "2")
    .attr("height", "25")
    .attr("fill", "gray");

  var ntext = svgg.append("text")
    .attr("x", 0)
    .attr("y", 34)
    .attr("id", "text_")
    .attr("style", "font-size: 10px; fill:indianred;")
    .text(function(d){
      return d.negative_score+"%";
    });

  var ptext = svgg.append("text")
    .attr("x", 215)
    .attr("y", 34)
    .attr("id", "text_")
    .attr("style", "font-size: 10px; fill:lightblue;")
    .text(function(d){
      return d.positive_score+"%";
    });
}



function scatterplot(data){

  var aScale = d3.scaleLinear()
        .domain([-100, d3.max(data, function (d) {
            return d.sentiment_score;
        })])
        .range([0, 400]);
    var bScaleFlipped = d3.scaleLinear()
        .domain([d3.min(data, function (d) {return d.total_wc;}), d3.max(data, function (d) {return d.total_wc;})])
        .range([450, 0]);


  var xaxisScale = d3.scaleLinear()
    .domain([0,d3.max(data, function (d) {
        return d.sentiment_score;
    })])
    .range([-100,100]);


    var xAxis = d3.axisBottom()
      .scale(xaxisScale);



    // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  var svgWidth = 470;
  var p = d3.select("#scatter_th").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgWidth);

  p.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d){
      return aScale(d.sentiment_score + 10);
    })
    .attr("cy", function(d){
      var v = d.total_wc - 500
      if(v <= 0){
        v + 150;
      }
      else{
        v = v;
      }
      return bScaleFlipped(v+550);
    })
    .attr("r", 6)
    .attr("class", "circles")
    .on("mouseover", function(d){
      tooltip.transition() // http://bl.ocks.org/weiglemc/6185069
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.title + "<br> Number of Words = "+d.total_wc)
               .style("left", (d3.event.pageX + 4) + "px")
               .style("top", (d3.event.pageY - 24) + "px");
      console.log(d.title);
    })
    .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
    .attr("fill", function(d){
      if(d.sentiment_score < 0){
        return "indianred";
      }
      else{
        return "lightblue";
      }
    });

    var linex = p.append("line")
      .attr("x1", 1)
      .attr("y1", svgWidth-5)
      .attr("x2", svgWidth-5)
      .attr("y2", svgWidth-5)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("stroke-linecap", "round");
    var liney = p.append("line")
      .attr("x1", 1)
      .attr("y1", svgWidth-5)
      .attr("x2", 1)
      .attr("y2", 1)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("stroke-linecap", "round");
    var liney = p.append("line")
      .attr("x1", svgWidth-5)
      .attr("y1", svgWidth-5)
      .attr("x2", svgWidth-5)
      .attr("y2", 1)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("stroke-linecap", "round");
    var liney = p.append("line")
      .attr("x1", 1)
      .attr("y1", 1)
      .attr("x2", svgWidth-5)
      .attr("y2", 1)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .attr("stroke-linecap", "round");


    var liney = p.append("line")
        .attr("x1", 1)
        .attr("y1", 1)
        .attr("x2", svgWidth-5)
        .attr("y2", 1)
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-linecap", "round");

    var ytext = p.append("text")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", svgWidth-10)
      .attr("style", "font-size: 10px; fill:indianred;")
      .text("# of words");

    var svgWidth = 470;
    var pp = d3.select("#scatter_th").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgWidth);

    var x = d3.scaleLinear().range([-100, 100]);
    x.domain(d3.extent(data, function(d) { return d.sentiment_score; }));

    var nums = [-100, -50, 0, +50, +100];
    var ticks = pp.append("text")
      .attr("x", -1)
      .attr("y", 12)
      .text(-100);
    pp.append("text")
      .attr("x", 110)
      .attr("y", 12)
      .text(-50);
    pp.append("text")
      .attr("x", 220)
      .attr("y", 12)
      .text(0);
    pp.append("text")
      .attr("x", 320)
      .attr("y", 12)
      .text(+50);
    pp.append("text")
      .attr("x", 420)
      .attr("y", 12)
      .text(+100);
    pp.append("text")
      .attr("transform",
            "translate(" + (svgWidth/2) + " ," +
                           (40) + ")")
      .style("text-anchor", "middle")
      .text("Sentiment Score");
      pp.append("text")
        .attr("transform",
              "translate(" + (svgWidth/2) + " ," +
                             (40) + ")")
        .style("text-anchor", "middle")
        .text("Sentiment Score");

}
