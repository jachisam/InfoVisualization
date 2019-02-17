/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth - 300 ;
    var legendHeight = 100;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;
    var yrData;
    removeLegendAndTileChart();
    drawLegend();

    d3.csv("data/"+electionResult, function(data){
    	// Analyze the dataset in the web console
      yrData = data;
      numeric(data);
      drawTileChart(data);
      genTip(data);
      console.log(data);
    });
    // var THEDATA;
    // setTimeout(function(){
    //   console.log(yrData);
    //   THEDATA = yrData;
    // },200);

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart

    tipp = d3.tip().attr('class', 'd3-tip')
    function genTip(data){
        tipp.direction('se')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            // /* populate data in the following format
             if (anIndependantRan(d, data)){
               tooltip_data = {
                  "state": fullStateName(d, data), //State,
                  "winner": winner(d, data), //d.State_Winner
                  "electoralVotes" : collectStateEV(d, data),
                  "result":[
                    {"nominee": data[20].D_Nominee,"votecount": driVotes(d, data, "D"),"percentage": driPercentage(d, data, "D"),"party":"D"} ,
                    {"nominee": data[20].R_Nominee,"votecount": driVotes(d, data, "R"),"percentage": driPercentage(d, data, "R"),"party":"R"} ,
                    {"nominee": data[20].I_Nominee,"votecount": driVotes(d, data, "I"),"percentage": driPercentage(d, data, "I"),"party":"I"}
                  ]
                }
              }else{
                tooltip_data = {
                   "state": fullStateName(d, data), //State,
                   "winner": winner(d, data), //d.State_Winner
                   "electoralVotes" : collectStateEV(d, data),
                   "result":[
                     {"nominee": data[20].D_Nominee,"votecount": driVotes(d, data, "D"),"percentage": driPercentage(d, data, "D"),"party":"D"} ,
                     {"nominee": data[20].R_Nominee,"votecount": driVotes(d, data, "R"),"percentage": driPercentage(d, data, "R"),"party":"R"}
                   ]
                 }
              }
            return TileChart.prototype.tooltip_render(tooltip_data); ;
        });
      }

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display.
    function drawLegend(){
      //Creates a legend element and assigns a scale that needs to be visualized
      self.legendSvg.append("g")
          .attr("class", "legendQuantile");

      var legendQuantile = d3.legendColor()
          .shapeWidth(72)
          .cells(10)
          .orient('horizontal')
          .scale(colorScale);

      self.legendSvg.selectAll("g")
        .call(legendQuantile);
    }

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
    var xScale = d3.scaleLinear()
    .domain([0, 11])
    .range([0, 825]);
    var yScale = d3.scaleLinear()
    .domain([0, 8])
    .range([0, 560]);
    //generate an 8x12 matrix of rectangles of equal size
    var states = [
      ["AK", [0, 0]],
      ["ME", [0, 11]],
      ["VT", [1, 10]],
      ["NH", [1, 11]],
      ["WA", [2, 1]],
      ["ID", [2, 2]],
      ["MT", [2, 3]],
      ["ND", [2, 4]],
      ["MN", [2, 5]],
      ["IL", [2, 6]],
      ["WI", [2, 7]],
      ["MI", [2, 8]],
      ["NY", [2, 9]],
      ["RI", [2, 10]],
      ["MA", [2, 11]],
      ["OR", [3, 1]],
      ["NV", [3, 2]],
      ["WY", [3, 3]],
      ["SD", [3, 4]],
      ["IA", [3, 5]],
      ["IN", [3, 6]],
      ["OH", [3, 7]],
      ["PA", [3, 8]],
      ["NJ", [3, 9]],
      ["CT", [3, 10]],
      ["CA", [4, 1]],
      ["UT", [4, 2]],
      ["CO", [4, 3]],
      ["NE", [4, 4]],
      ["MO", [4, 5]],
      ["KY", [4, 6]],
      ["WV", [4, 7]],
      ["VA", [4, 8]],
      ["MD", [4, 9]],
      ["DC", [4, 10]],
      ["AZ", [5, 2]],
      ["NM", [5, 3]],
      ["KS", [5, 4]],
      ["AR", [5, 5]],
      ["TN", [5, 6]],
      ["NC", [5, 7]],
      ["SC", [5, 8]],
      ["DE", [5, 9]],
      ["OK", [6, 4]],
      ["LA", [6, 5]],
      ["MS", [6, 6]],
      ["AL", [6, 7]],
      ["GA", [6, 8]],
      ["HI", [7, 1]],
      ["TX", [7, 4]],
      ["FL", [7, 9]]
    ]
    console.log(states);
    function drawTileChart(data){
      var maxtrix = self.svg.selectAll("rect")
        .data(states)
        .enter()
        .append("rect")
        .attr("width", 75)
        .attr("height", 70)
        .attr("fill", function(d){
          console.log(d[0])
          if(anIndependantWon(d, data)){
            return "#45AD6A";
          }else if(data[0].Year < 1960 && (d[0] === "AK" || d[0] === "HI")){
            return "#e2e2e2";
          }
          else if(data[0].Year < 1964 && (d[0] === "DC")){
            return "#e2e2e2";
          }
          else{
            var color = collectStateColor(d, data);
            return colorScale(color);
          }
        })
        .attr("stroke","white")
        .attr("stroke-width", "3")
        .attr("x", function(d, index){
          var row = d[1][1];
          return xScale(row);
        })
        .attr("y", function(d, index){
          var column = d[1][0];
          if(column != 0){
            return yScale(column);
          }else{
            return 0;
          }
        })
        .on('mouseover', tipp.show)
        .on('mouseout', tipp.hide);
        self.svg.call(tipp);


        var maxtrixText = self.svg.selectAll("text")
          .data(states)
          .enter();

          maxtrixText.append("text")
            .text(function(d){
              return d[0];
            })
            .attr("class", "tilestext")
            .attr("x", function(d, index){
              var row = d[1][1];
              return xScale(row)+ 37;
            })
            .attr("y", function(d, index){
              var column = d[1][0];
              if(column != 0){
                return yScale(column) + 30;
              }else{
                return 30;
              }
            });

        maxtrixText.append("text")
            .text(function (d){
              return collectStateEV(d, data);
            })
            .attr("class", "tilestext")
            .attr("x", function(d, index){
              var row = d[1][1];
              return xScale(row)+ 37;
            })
            .attr("y", function(d, index){
              var column = d[1][0];
              if(column != 0){
                return yScale(column) + 50;
              }else{
                return 50;
              }
            });
    }


    //Display the state abbreviation and number of electoral votes on each of these rectangles


    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.

    function numeric(data){
      data.forEach(function(d){
        d.D_Percentage = parseFloat(d.D_Percentage);
        d.D_Votes = parseFloat(d.D_Votes);
        d.R_Percentage = parseFloat(d.R_Percentage);
        d.R_Votes = parseFloat(d.R_Votes);
        d.I_Percentage = parseFloat(d.I_Percentage) || 0;
        d.I_Votes = parseFloat(d.I_Votes) || 0;
        d.Total_EV = parseFloat(d.Total_EV);
        d.Year = parseFloat(d.Year);
      });
    }
    function removeLegendAndTileChart(){
      d3.select("#legend").select("svg").select(".legendQuantile").remove();
      d3.select("#tiles").select("svg").selectAll("rect").remove();
      d3.select("#tiles").select("svg").selectAll("text").remove();

      // self.svg.selectAll("rect").remove();
      // self.svg.selectAll("text").remove();
      // self.legendSvg.selectAll("rect").remove();
      // self.legendSvg.selectAll("text").remove();
    }

    //Data Processing
    function collectStateColor(state, data){
      var state_name = state[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            return (data[i].R_Percentage - data[i].D_Percentage);
          }
      }
    }
    function collectStateEV(state, data){
      var state_name = state[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            // console.log(data[i].Total_EV);
            return (data[i].Total_EV);
          }
      }
    }

    function fullStateName(d, data){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            // console.log(data[i].Total_EV);
            return (data[i].State);
          }
      }
    }
    function winner(d, data){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            if(data[i].R_Votes > data[i].D_Votes && data[i].R_Votes > data[i].I_Votes ){
              // return data[i].R_Nominee;
              return "R";
            }else if(data[i].D_Votes > data[i].R_Votes && data[i].D_Votes > data[i].I_Votes ){
              // return data[i].D_Nominee;
              return "D";
            }else{
              // return data[i].I_Nominee
              return "I";
            }
          }
      }
    }
    function driVotes(d, data, party){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            if(party === "D"){
              return data[i].D_Votes;
            }else if(party === "R"){
              return data[i].R_Votes;
            }else{
              return data[i].I_Votes;
            }
          }
      }
    }
    function driPercentage(d, data, party){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            if(party === "D"){
              return data[i].D_Percentage;
            }else if(party === "R"){
              return data[i].R_Percentage;
            }else{
              return data[i].I_Percentage;
            }
          }
      }
    }
    function anIndependantRan(d, data){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            if(data[i].I_Votes > 0){
              return true;
            }else{
              return false;
            }
          }
      }
    }
    function anIndependantWon(d, data){
      var state_name = d[0];
      for(var i = 0; i < data.length; i++) {
          var obj = data[i].Abbreviation;
          if(state_name === obj){
            if(data[i].I_Votes > data[i].D_Votes && data[i].I_Votes > data[i].R_Votes){
              return true;
            }else{
              return false;
            }
          }
      }
    }
};
