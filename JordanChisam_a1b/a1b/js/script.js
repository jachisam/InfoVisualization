/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)
changeData()
function staircase() { // ****** PART II ******
    //sorted version of what we previously had
    var rectangles = document.getElementById('bar_chart').children; //console.log(rectangles);
    var sorted = [];
    for(var r = 0; r < rectangles.length; r++){
      var width = rectangles[r].width.animVal.value;
      sorted.push(width);
    }
    sorted = sorted.sort(function(a, b){
      return a - b;
    });

    for(var r = 0; r < rectangles.length; r++){
      var updatedRect = rectangles[r].setAttribute("width", sorted[r]);
    }
    console.log("staircase() executed");
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
        // console.log(data);
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    var aScaleFlipped = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([150, 0]);
    var bScaleFlipped = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([150, 0]);
    // var iiScale = d3.scaleLinear()
    //     .domain([0, data.length])
    //     .range([110, 0]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    var bc1 = d3.select("#bar_chart")
      .selectAll("*")
      .remove();
    var bc1 = d3.select("#bar_chart");
  	bc1.selectAll("rect")
      .data(data)
      .enter()
    	.append("rect")
      .attr("height", 15)
      .attr("width", function(d){
        return aScale(d.a);
      })
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d, index) {
        return (index * 15 );
      });

    // TODO: Select and update the 'b' bar chart bars
    var bc2 = d3.select("#bar_chart2")
      .selectAll("*")
      .remove();
    var bc2 = d3.select("#bar_chart2");
  	bc2.selectAll("rect")
      .data(data)
      .enter()
    	.append("rect")
      .attr("height", 15)
      .attr("width", function(d){
        return aScale(d.b);
      })
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d, index) {
        return (index * 15 );
      });

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScaleFlipped(d.a);
        });

    var lc1 = d3.select("#line_chart")
      .selectAll("*")
      .remove();
    var lc1 = d3.select("#line_chart");
  	lc1.selectAll("path")
      .data(data)
      .enter()
    	.append("path")
      .attr("d", aLineGenerator(data))
      .attr("stroke", "darkgreen")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("x", 0);

    // TODO: Select and update the 'b' line chart path (create your own generator)
    var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScaleFlipped(d.b);
        });

    var lc2 = d3.select("#line_chart2")
      .selectAll("*")
      .remove();
    var lc2 = d3.select("#line_chart2");
  	lc2.selectAll("path")
      .data(data)
      .enter()
    	.append("path")
      .attr("d", bLineGenerator(data))
      .attr("stroke", "darkgreen")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("x", 0);

    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScaleFlipped(d.a);
        });

    var ac1 = d3.select("#area_chart")
      .selectAll("*")
      .remove();
        var ac1 = d3.select("#area_chart");
        ac1.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", aLineGenerator(data))
        .attr("stroke", "darkgreen")
        .attr("stroke-width", 2)
        .attr("fill", "darkgreen")
        .attr("x", 0);

    // TODO: Select and update the 'b' area chart path (create your own generator)
    var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScaleFlipped(d.b);
        });

    var ac2 = d3.select("#area_chart2")
      .selectAll("*")
      .remove();
    var ac2 = d3.select("#area_chart2");
    ac2.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", bLineGenerator(data))
      .attr("stroke", "darkgreen")
      .attr("stroke-width", 2)
      .attr("fill", "darkgreen")
      .attr("fill-opacity", "0.5")
      .attr("x", 0);

    // TODO: Select and update the scatterplot points
    var scatter = d3.select("#scatter_plot")
      .selectAll("*")
      .remove();
    var scatter = d3.select("#scatter_plot");
  	scatter.selectAll("circle")
      .data(data)
      .enter()
    	.append("circle")
      .attr("cx", function(d){
        return aScale(d.a + 10);
      })
      .attr("cy", function(d){
        return bScaleFlipped(d.b - 2);
      })
      .attr("r", 5)
      .attr("class", "circles")
      .attr("fill", "darkgreen");

    // ****** TODO: PART IV ******
    var bars = document.getElementsByClassName('bar');
    for (var i = 0; i < bars.length; i++) {
        bars[i].addEventListener('mouseover', function(){
          this.classList.add("bar_mouseover");
        });
        bars[i].addEventListener('mouseout', function(){
          this.classList.remove("bar_mouseover");
        });
    }

    var circles = document.getElementsByClassName('circles');
    for (var i = 0; i < circles.length; i++) {
        circles[i].addEventListener('mouseover', function(){
          this.classList.add("bar_mouseover");
        });
        circles[i].addEventListener('mouseout', function(){
          this.classList.remove("bar_mouseover");
        });
    }

    d3.selectAll("circle")
    .on("click", function(d,i) {
      console.log("("+ d.a + ", " + d.b + ")");
    });

}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('../data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('../data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}
