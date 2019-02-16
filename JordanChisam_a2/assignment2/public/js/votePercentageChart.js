/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
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
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+" ("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;
    var totalVote = 0, dVotes = 0, dP = 0, rVotes = 0, rP = 0, iVotes = 0, iP = 0;
    var dNom = "", rNom = "", iNom = "";
    var yrData;
    d3.csv("data/"+electionResult, function(data){

    	// Analyze the dataset in the web console
    	yrData = data;
      numeric(data);
      // console.log(data);
      totalVotes(data);
      calcPercentages(data);
      removeElectoralVoteChart();
      drawElectoralVoteChart();
      bar50();
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

      function totalVotes(data){
        data.forEach(function(d){
          totalVote += d.D_Votes;
          totalVote += d.R_Votes;
          totalVote += d.I_Votes;
        });
      }
      function round(num){
        return num = Math.round(num * 10 ) / 10;
      }
      function calcPercentages (data){
        data.forEach(function(d){
          dVotes += d.D_Votes;
          rVotes += d.R_Votes;
          iVotes += d.I_Votes;
        });
        dP = round((dVotes/totalVote)*100);
        rP = round((rVotes/totalVote)*100);
        iP = round((iVotes/totalVote)*100);
        dNom = data[11].D_Nominee;
        rNom = data[11].R_Nominee;
        iNom = data[11].I_Nominee;
        // console.log(dP, rP, iP);
      }

      //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
      //then, vote percentage and number of votes won by each party.

      //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

      //for reference:https://github.com/Caged/d3-tip
      //Use this tool tip element to handle any hover over the chart
      tip = d3.tip()
        .attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
             // populate data in the following format
             if (iVotes != 0){
               tooltip_data = {
                 "result":[
                   {"nominee": dNom,"votecount": dVotes,"percentage": dP,"party":"D"} ,
                   {"nominee": rNom,"votecount": rVotes,"percentage": rP,"party":"R"} ,
                   {"nominee": iNom,"votecount": iVotes,"percentage": iP,"party":"I"}
                 ]
               }
             }else{
               tooltip_data = {
                 "result":[
                   {"nominee": dNom,"votecount": dVotes,"percentage": dP,"party":"D"} ,
                   {"nominee": rNom,"votecount": rVotes,"percentage": rP,"party":"R"}// ,
                   // {"nominee": "No Independet Nominee","votecount": iVotes,"percentage": iP,"party":"I"}
                 ]
               }
             }
             // pass this as an argument to the tooltip_render function then,
             // return the HTML content returned from that method.
             let tooltipHTML = VotePercentageChart.prototype.tooltip_render(tooltip_data);
             return tooltipHTML;
      });




      // ******* TODO: PART III *******

      //Create the stacked bar chart.
      //Use the global color scale to color code the rectangles.
      //HINT: Use .votesPercentage class to style your bars.
      //Display the total percentage of votes won by each party
      //on top of the corresponding groups of bars.
      //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
      // chooseClass to get a color based on the party wherever necessary
      //Just above this, display the text mentioning details about this mark on top of this bar
      //HINT: Use .votesPercentageNote class to style this text element
      function drawElectoralVoteChart(){
        var evScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, 819]);

        var ind = self.svg.append("rect")
          .attr("x", self.margin.left + 30)
          .attr("y", 35)
          .attr("width", evScale(iP))
          .attr("height", 35)
          .attr("class", function(d){
            return self.chooseClass("I") + " votesPercentage";
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
        self.svg.call(tip);

        if(iP != 0){
          self.svg.append("text")
            .attr("x", self.margin.left + 30)
            .attr("y", 30)
            .attr("class", function(d){
              return self.chooseClass("I") + " votesPercentageText";
            })
            .text(iP+"%");
          self.svg.append("text")
            .attr("x", self.margin.left + 30)
            .attr("y", 11)
            .attr("class", function(d){
              return self.chooseClass("I") + " votesPercentageNote";
            })
            .text(iNom);
          }

        var de = self.svg.append("rect")
          .attr("x", evScale(iP) + self.margin.left + 30)
          .attr("y", 35)
          .attr("width", evScale(dP))
          .attr("height", 35)
          .attr("class", function(d){
            return self.chooseClass("D") + " votesPercentage";
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
        self.svg.call(tip);

          var padding = 30;
          var padding2 = evScale(iP) + self.margin.left + padding;
          if(iP != 0){
            padding = 50;
            padding2 = 233;
          }
          self.svg.append("text")
            .attr("x", padding2)
            .attr("y", 30)
            .attr("class", function(d){
              return self.chooseClass("D") + " votesPercentageText";
            })
            .text(dP+"%");
          self.svg.append("text")
            .attr("x", padding2)
            .attr("y", 11)
            .attr("class", function(d){
              return self.chooseClass("D") + " votesPercentageNote";
            })
            .text(dNom);

        var re = self.svg.append("rect")
          .attr("x", evScale(iP) + evScale(dP) + self.margin.left + 30)
          .attr("y", 35)
          .attr("width", evScale(rP))
          .attr("height", 35)
          .attr("class", function(d){
            return self.chooseClass("R") + " votesPercentage";
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
        self.svg.call(tip);

        self.svg.append("text")
          .attr("x", self.svgWidth)
          .attr("y", 30)
          .attr("class", function(d){
            return self.chooseClass("R") + " votesPercentageText";
          })
          .text(rP+"%");
        self.svg.append("text")
          .attr("x", self.svgWidth)
          .attr("y", 11)
          .attr("class", function(d){
            return self.chooseClass("R") + " votesPercentageNote";
          })
          .text(rNom);
      }


    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    function bar50(){
      self.svg.append("rect")
        .attr("x", (self.svgWidth * 0.5) + 35)
        .attr("y", 30)
        .attr("width", 5)
        .attr("height", 46)
        .attr("class", "middlePoint");
      infoEV();
    }
    function infoEV(){
      self.svg.append("text")
        .attr("x", (self.svgWidth * 0.5) + 35)
        .attr("y", 27)
        .attr("class", "electoralVotesNote")
        .text("Popular Vote (50%)");
    }

    function removeElectoralVoteChart(){
      self.svg.selectAll("rect").remove();
      self.svg.selectAll("text").remove();
    }
};
