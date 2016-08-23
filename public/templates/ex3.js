var margin = { top: 10, right: 20, bottom: 20, left:60 },
    width = 960 - margin.left - margin.right, 
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
          .attr("width", width+margin.left + margin.right)
          .attr("height", height+margin.top+margin.bottom)
          .append("g")
          .attr("transform", "translate("+margin.left+","+margin.top+")");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

d3.csv("income.csv", function(error, bins){
    if(error) throw error;

     bins.forEach(function(bin){
        bin.Income = +bin.Income;
        bin.People = +bin.People;
     });

     for (var i=1, n = bins.length, bin; i<n; i++){
        bin = bins[i];
        bin.offset = bins[i-1].Income;
        bin.width = bin.Income - bin.offset;
        bin.height = bin.People/bin.width; 
     }

     bins.shift();
     x.domain([0, d3.max(bins.map(function(d){return d.offset + d.width}))]);
     y.domain([0, d3.max(bins.map(function(d){return d.height; }))]);


     svg.selectAll(".bin")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bin")
        .attr("x", function(d) {return x(d.offset); })
        .attr("width", function(d) {return x(d.width)-1; })
        .attr("y", function(d) {return y(d.height); })
        .attr("height", function(d) {return height -y(d.height); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+height+")")
        .call(d3.svg.axis()
        .scale(x)
        .orient("bottom"));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis()
        .scale(y)
        .orient("left"));

})
