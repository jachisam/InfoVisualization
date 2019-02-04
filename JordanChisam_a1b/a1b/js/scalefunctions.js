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

// Modified a and b scale functions in order to fix flipped data
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

// Line and Area Generators for a and b

var aLineGenerator = d3.line()
  .x(function (d, i) {
  return iScale(i);
  })
  .y(function (d) {
  return aScaleFlipped(d.a);
  });

var bLineGenerator = d3.line()
  .x(function (d, i) {
      return iScale(i);
  })
  .y(function (d) {
      return bScaleFlipped(d.b);
  });

var aAreaGenerator = d3.area()
  .x(function (d, i) {
      return iScale(i);
  })
  .y0(0)
  .y1(function (d) {
      return aScaleFlipped(d.a);
  });

var bAreaGenerator = d3.area()
  .x(function (d, i) {
      return iScale(i);
  })
  .y0(0)
  .y1(function (d) {
      return bScaleFlipped(d.b);
  });
