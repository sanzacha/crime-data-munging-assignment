let dataPush = [];

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.arrestTrue); });
// define the line
var valueline2 = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.arrestFalse); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json("assets/assault.json", (getData) => {
    const obj = getData;
    Object.keys(obj).forEach(function(key, index) {
        let formData = {
        "year": key,
        "arrestTrue": Object.entries(obj)[index][1].arrestTrue,
        "arrestFalse": Object.entries(obj)[index][1].arrestFalse
    }
    dataPush.push(formData);
});
draw(dataPush);
console.log(dataPush);
});

function draw(data) {
    var data = data;
    // format the data
    data.forEach(function(d) {
        d.year = parseTime(d.year);
        d.arrestTrue = +d.arrestTrue;
        d.arrestFalse = +d.arrestFalse;
    });
    
    // sort years ascending
    data.sort(function(a, b){
        return a["year"]-b["year"];
    })
    
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) {
        return Math.max(d.arrestTrue, d.arrestFalse); })]);
    
    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline)
        .style("stroke", "green");
    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline2);  
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}