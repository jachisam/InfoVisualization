
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
    self.g = self.svg.append("g").attr("id", "idI");
    self.gg = self.svg.append("g").attr("id","idDR");

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    //Initialize local variable for producing stacked bar chart
    var padding = 20;
    var margin = {top: 10, right: 15, bottom: 25, left: 80};
    var intialBarPosition = 0, marginBarPosition = 0, finalBarPosition = 0;
    var marginOfVictory = 0;
    var rStates = [], dStates = [], iStates = [], drStatesConcatened = [];
    var dTotalEV = 0, rTotalEV =0, iTotalEV = 0;

    var yrData;
    d3.csv("data/"+electionResult, function(data){

    	// Analyze the dataset in the web console
    	yrData = data;
      numeric(data);
      groupAndSortStates(data);
    });

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
    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    function groupAndSortStates(data){
      //Group into 3 party arrays
      data.forEach(function(d){
        if(d.D_Percentage > d.R_Percentage && d.D_Percentage > d.I_Percentage){
          dStates.push(d);
        }
        else if (d.R_Percentage > d.D_Percentage && d.R_Percentage > d.I_Percentage){
          rStates.push(d);
        }
        else if(d.I_Percentage > d.D_Percentage && d.I_Percentage > d.R_Percentage){
          iStates.push(d);
        }
      });

      // Sort 3 party arrays by margin of victory
      dStates.sort(function(a, b){  //democrates descending (high to low)
        return b.D_Percentage - a.D_Percentage;
      });
      rStates.sort(function(a, b){  //republicans ascending (low to high)
        return a.R_Percentage - b.R_Percentage;
      });
      iStates.sort(function(a, b){ //independents descending (high to low)
        return b.I_Percentage - a.I_Percentage;
      });
      // console.log(rStates);
      // console.log(dStates);
      // console.log(iStates);

      drStatesConcatened = dStates.concat(rStates);
      drStatesConcatened.sort(function(a, b){
        return (b.D_Percentage - b.R_Percentage) - (a.D_Percentage - a.R_Percentage);
      });
      // drStatesConcatened = drStatesConcatened.concat(iStates);
      // console.log(drStatesConcatened);


      // Independent states
      // Determine if they won? (>=270)
      dStates.forEach(function(d){
        dTotalEV += d.Total_EV;
      });
      rStates.forEach(function(d){
        rTotalEV += d.Total_EV;
      });
      iStates.forEach(function(d){
        iTotalEV += d.Total_EV;
      });
      //Total should be 537
      var totalEV = dTotalEV + rTotalEV + iTotalEV;

      removeElectoralVoteChart();
      drawEVText(iStates, dTotalEV, rTotalEV, iTotalEV);
      drawElectoralVoteChart(data, totalEV);
      bar50();
      infoEV();
  }

  function removeElectoralVoteChart(){
    self.svg.selectAll("rect").remove();
    self.svg.selectAll("text").remove();
  }

  //Display total count of electoral votes won by the Democrat and Republican party
  //on top of the corresponding groups of bars.
  //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
  // chooseClass to get a color based on the party wherever necessary
  function drawEVText(iStates, dTotalEV, rTotalEV, iTotalEV){
    if(iStates.length != 0){
      self.svg.append("text")
        .attr("x", margin.left + 1)
        .attr("y", 25)
        .attr("class", function(d){
          return self.chooseClass("I") + " electoralVoteText";
        })
        .text(iTotalEV);
      self.svg.append("text")
        .attr("x", margin.left + 70)
        .attr("y", 25)
        .attr("class", function(d){
          return self.chooseClass("D") + " electoralVoteText";
        })
        .text(dTotalEV);
      self.svg.append("text")
        .attr("x", self.svgWidth - 1)
        .attr("y", 25)
        .attr("class", function(d){
          return self.chooseClass("R") + " electoralVoteText";
        })
        .text(rTotalEV);
    }else{
    self.svg.append("text")
      .attr("x", margin.left + 1)
      .attr("y", 25)
      .attr("class", function(d){
        return self.chooseClass("D") + " electoralVoteText";
      })
      .text(dTotalEV);
    self.svg.append("text")
      .attr("x", self.svgWidth - 1)
      .attr("y", 25)
      .attr("class", function(d){
        return self.chooseClass("R") + " electoralVoteText";
      })
      .text(rTotalEV);
    }
  }

  //Create the stacked bar chart.
  //Use the global color scale to color code the rectangles.
  //HINT: Use .electoralVotes class to style your bars.
  function drawElectoralVoteChart(data, totalEV){
    var evScale = d3.scaleLinear()
      .domain([3, 55]) //min and max of electoral votes
      .range([5, 95]);

    var evTotalScale = d3.scaleLinear()
      .domain([0, totalEV])
      .range([0, 750]);

    var marginWinnerScale = d3.scaleLinear()
      .domain(0, 1)
      .range(1, 4);

    if(iStates.length != 0){
      // Independent
      var ind = self.g.selectAll("rect")
        .data(iStates)
        .enter()
        .append("rect")
        .attr("x", function(d, index){
          marginBarPosition = intialBarPosition;
          intialBarPosition += d.Total_EV + 1;
          return evTotalScale(marginBarPosition)+margin.left;
        })
        .attr("y", 35)
        .attr("width", function(d){
          return evTotalScale(d.Total_EV);
        })
        .attr("height", 35)
        .attr("fill", "green")
        .attr("class", "electoralVotes");

      // Democrat and Republican
      var dr = self.gg.selectAll("rect")
        .data(drStatesConcatened)
        .enter()
        .append("rect")
        .attr("x", function(d, index){
          // console.log(intialBarPosition);
          marginBarPosition = intialBarPosition;
          intialBarPosition += d.Total_EV + 1;
          return evTotalScale(marginBarPosition) + margin.left;
        })
        .attr("y", 35)
        .attr("width", function(d){
          return evTotalScale(d.Total_EV);
        })
        .attr("height", 35)
        .attr("fill", function(d){
          var colorDifference = d.R_Percentage - d.D_Percentage;
          return colorScale(colorDifference);
        })
        .attr("class", "electoralVotes");
    }
    else{
      // Democrat and Republican
      self.svg.selectAll("rect")
        .data(drStatesConcatened)
        .enter()
        .append("rect")
        .attr("x", function(d, index){
          marginBarPosition = intialBarPosition;
          intialBarPosition += d.Total_EV + 1;
          return evTotalScale(marginBarPosition) + margin.left;
        })
        .attr("y", 35)
        .attr("width", function(d){
          return evTotalScale(d.Total_EV);
        })
        .attr("height", 35)
        .attr("fill", function(d){
          var colorDifference = d.R_Percentage - d.D_Percentage;
          return colorScale(colorDifference);
        })
        .attr("class", "electoralVotes");
    }
  }

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    function bar50(){
      self.svg.append("rect")
        .attr("x", (self.svgWidth * 0.5) + 35)
        .attr("y", 30)
        .attr("width", 3)
        .attr("height", 46)
        .attr("class", "middlePoint");
    }

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    function infoEV(){
      self.svg.append("text")
        .attr("x", (self.svgWidth * 0.5) + 35)
        .attr("y", 27)
        .attr("class", "electoralVotesNote")
        .text("Electoral Vote (270 Needed to Win)");
    }


    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
