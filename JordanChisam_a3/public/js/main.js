
// SVG Size
var width = 700,
	height = 510;

var incomeScale, lifeExpectancyScale, populationDensityScale, colorScale;
var padding = 22;
var margin = {top: 10, right: 15, bottom: 25, left: 5};

var svg = d3.select("#chart-area")
	.append("svg")
	.attr("height", height)
	.attr("width", width);

// Load CSV file
var wh_data;
d3.csv("data/wealth-health-2014.csv", function(data){

	// Analyze the dataset in the web console
	console.log(data);
	wh_data = data;
	console.log("Countries: " + data.length)
	numeric(wh_data);
	createScales(wh_data);
	mapData(data);
	//createAxis(data);
});

function numeric(data){
	data.forEach(function(d){
		d.Income = parseInt(d.Income);
		d.LifeExpectancy = parseFloat(d.LifeExpectancy);
		d.Population = parseFloat(d.Population);
	});
}

function createScales(wh_data){
	incomeScale = d3.scaleLog()
	    .domain([d3.min(wh_data, function (d) {return d.Income;}) - margin.top,
							 d3.max(wh_data, function (d) {return d.Income;}) + margin.top])
	    .range([padding + margin.bottom, width-padding]);
	lifeExpectancyScale = d3.scaleLog()
	    .domain([d3.min(wh_data, function (d) {return d.LifeExpectancy;}) - margin.top,
							 d3.max(wh_data, function (d) {return d.LifeExpectancy;}) + margin.top])
			.range([height-padding, padding + margin.bottom]);
	populationDensityScale = d3.scaleLinear()
	    .domain([d3.min(wh_data, function (d) {return d.Population;}),
							 d3.max(wh_data, function (d) {return d.Population;})])
			.range([4, 30]);

	colorScale = d3.scaleOrdinal(d3.schemeCategory20c);


	//Examples
	console.log(incomeScale(5000));
	console.log(lifeExpectancyScale(68));
}

function mapData(data){
	svg.selectAll("circle")
		.data(data.sort(function(x, y){
			return y.Population - x.Population;
		}))
		.enter()
		.append("circle")
	  .attr("fill", function(d){
			return colorScale(d.Region);
		})
		.attr("cx", function(d){
			return incomeScale(d.Income);
		})
		.attr("cy", function(d){
			return lifeExpectancyScale(d.LifeExpectancy);
		})
		.attr("stroke", "black")
	  .attr("stroke-width", 1)
	  .attr("r", function(d){
			return populationDensityScale(d.Population);
		});

}

// function createAxis(data){
// 	var xAxis = d3.axisBottom()
// 		.scale(incomeScale)
// 		.tickFormat(d3.format(",.2r"))
// 		.ticks(2);
//
// 	svg.append("g")
// 		.attr("class","axis x-axis")
// 		.attr("transform", "translate(0," + (450 + padding) + ")")
// 		.call(xAxis);
//
// 	svg.append("text")
// 		.attr("class","axis-label")
// 		.attr("transform", "translate(375," + (480 + padding) + ")")
// 		.style("text-anchor", "middle")
// 		.text("Income (per person)");
//
// 	var yAxis = d3.axisLeft()
// 		.scale(lifeExpectancyScale)
// 		.tickFormat(d3.format(",.2r"))
// 		.ticks(2);
//
// 	svg.append("g")
// 		.attr("class","axis y-axis")
// 		.attr("transform", "translate(" + (padding + margin.right) + ",-16)")
// 		.call(yAxis);
//
// 	svg.append("text")
// 		.attr("class","axis-label")
// 		.attr("transform","translate(" + padding + "," + (padding * 11.5) +")rotate(-90)")
// 		.attr("y", -13)
// 		.style("text-anchor", "middle")
// 		.text("Life Expectancy");
//
// 	svg.append("text")
// 	.attr("class","axis-label")
// 	.attr("transform", "translate(250," + (margin.left + padding) + ")")
// 	.style("text-decoration", "middle")
// 	.style("font-weight", "bold")
// 	.style("font-size", "15px")
// 	.text("Life Expectancy vs. Income (per person)");
// }
