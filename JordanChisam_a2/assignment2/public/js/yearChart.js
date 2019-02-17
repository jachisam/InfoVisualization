/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    var self = this;

    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;

    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);

    var yearSelectedData = "election-results-2016.csv";
    self.electoralVoteChart.update(yearSelectedData, self.colorScale);
    self.votePercentageChart.update(yearSelectedData);
    self.tileChart.update(yearSelectedData, self.colorScale);

    // ******* TODO: PART I *******

    // var svg = d3.select("#year-chart")
    // 	.append("svg")
    // 	.attr("height", 500)
    // 	.attr("width", 800);

    var yrData, xScale, yScale;
    var margin = {top: 10, right: 100, bottom: 25, left: 63};
    d3.csv("data/yearwise-winner.csv", function(data){

    	// Analyze the dataset in the web console
    	yrData = data;
      // console.log(data);
      numeric(data);
      drawYearChart(data);
    });

    function numeric(data){
      data.forEach(function(d){
        d.YEAR = parseInt(d.YEAR);
      });
    }

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
    function drawYearChart(data){
      //Style the chart by adding a dashed line that connects all these years.
      //HINT: Use .lineChart to style this dashed line
      self.svg.append("line")
        .attr("x1", 110)
        .attr("y1", 30)
        .attr("x2", 1300)
        .attr("y2", 30)
        .style("stroke-dasharray", "3,8")
        .style("stroke", "gray");

      //Append text information of each year right below the corresponding circle
      //HINT: Use .yeartext class to style your text elements
      self.svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "yeartext")
        .attr("x", function(d, index){
          return margin.right + (index * margin.left);
        })
        .attr("y", 75)
        .text(function(d){
          return d.YEAR;
        });

      self.svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d){
          return self.chooseClass(d.PARTY);
        })
        .attr("cx", function(d, index){
          return margin.right + (index * margin.left);
        })
        .attr("cy", 30)
        .attr("r", 15)
        .on("click", function(d){
          //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
          //HINT: Use .highlighted class to style the highlighted circle
          self.svg.selectAll("circle")
          .style("stroke", "none")
          .style("stroke-width", "none");

          d3.select(this)
            .style("class", "highlighted")
            .style("stroke", "#404040")
            .style("stroke-width", 3)

          var yearSelectedData = "election-results-"+d.YEAR+".csv";
          self.electoralVoteChart.update(yearSelectedData, self.colorScale);
          self.votePercentageChart.update(yearSelectedData);
          self.tileChart.update(yearSelectedData, self.colorScale);
				});


    }
    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
};
