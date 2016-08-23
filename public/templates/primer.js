d3.json("dbMetricJson.json", function(json){

    var data = [];
    var values = {};

    for(var i=0; i< json.length; i++){
      console.log(i);
      console.log(json[i]._id);
      //var xValue = json[i]._id;
      var xValue = i;
      var yValue = json[i]._source.body.VALUE;
      console.log(yValue);

      if(values[xValue] === undefined){
        values[xValue]=0;
      }

      
      values[xValue] += yValue;


      data.push({"x": xValue, "y": values[xValue]});
    

    }

    console.log("DATA "+data.length);
    createHistogram(data, "Naslov..?");

});


var createHistogram = function (data, title)
{
  var formatCount = d3.format(",.0f");
  var totalWidth = 960; 
  var totalHeight = 600;

  var margin = {top: 20, right: 20, bottom: 70, left: 60},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


var binArray = [];
var maxBin = data.length-1;
var binInc = 1;

  for (var i = 0; i <= maxBin + binInc; i += binInc) {
    binArray.push(i);
  }
  var binTicks = [];
  for (var i = 0; i < maxBin + binInc; i += binInc) {
    binTicks.push(i);
  }


  var x = d3.scale.linear()
      //.domain(data.map(function(d) { return d.x; }))
      .domain([0, maxBin + binInc])
      .range([0, width]);


  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues(binTicks);
      
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var binWidth = parseFloat(width / (binArray.length - 1)) - 1;


  var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");

  var bar = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class" , "bar")
            //.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
            .attr("x", function(d){return x(d.x); })
            .attr("width", binWidth)
            .attr("y", function(d){return y(d.y); })
            .attr("height", function(d){ return height - y(d.y); });
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
  svg.append("g")
      .attr("class", "y axis")
      //.attr("transform", "translate(0," + height + ")")
      .call(yAxis);
      
  // Add axis labels
  svg.append("text")
      .attr("class", "x label")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom-50) + ")")
      //.attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Ids ");
      
  svg.append("text")
      .attr("class", "y label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Values");
      
  // Add title to chart
  svg.append("text")
      .attr("class", "title")
      .attr("transform", "translate(" + (width / 2) + " ," + (-20) + ")")
      //.attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text(title);  

  svg.append("text")
      .attr("class", "title")
      .attr("transform", "translate("+(width / 2)+ ", "+(-20)+")")
      .attr("text-anchor", "middle")
      .text(title);

  
};