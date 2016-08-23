import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import './less/main.less';
import template from './templates/index.html';

chrome
  .setNavBackground('#222222')
  .setTabs([]);

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  controller: 'kristinaTestHelloWorld',
  controllerAs: 'ctrl', 

   resolve: {

    dbMetricRouteData($http) {
      return $http.get('/api/proba/dbMetric/2016-07-31').then(function (resp) {
        return resp.data;
      });
    }, 

    allOracleIds($http) {
      return $http.get('/api/proba/getAllIds').then(function (resp) {
        return resp.data;
      });
    }, 

    allMetricNames($http) {
      return $http.get('/api/proba/getAllMetricNames/2016-08-14').then(function (resp) {
        return resp.data;
      });
    }
  }

});


uiModules
.get('app/proba', [])
.controller('kristinaTestHelloWorld', function ($scope, $route, $http) {

  var d3 = require('d3');


  $scope.parseJsonKeys = function(jsonData)
  {
    var arr = jsonData.aggregations.metrics.buckets;
    var listOfValues = []; 

    for(var i=0; i<arr.length; i++)
    {
      var value = arr[i].key;
      listOfValues.push(value);
    }
    return listOfValues;
  }

  $scope.setChartData = function(jsonData)
  {
    var json = jsonData.hits.hits;
    $scope.data = [];
    var values = {};
    
    for(var i=0; i< json.length; i++){
      var xValue = i;
      var yValue = parseFloat(json[i]._source.VALUE);
      console.log("Values "+xValue+",  "+yValue);
      

      if(values[xValue] === undefined){
        values[xValue]=0;
      }

      values[xValue] += yValue;

      $scope.data.push({"x": xValue, "y": values[xValue]});  
    };
  }


  $scope.setDataForChart = function(jsonData)
  {
    var json = jsonData.aggregations.aggQueryData.buckets;
    $scope.data = [];
    var values = {};
    
    for(var i=0; i< json.length; i++){
      var xValue = i;
      var yValue = parseFloat(json[i].avg_value.value);
      console.log("Values "+xValue+",  "+yValue);
      

      if(values[xValue] === undefined){
        values[xValue]=0;
      }

      values[xValue] += yValue;

      $scope.data.push({"x": xValue, "y": values[xValue]});  
    };

  }

  $scope.createChart = function(data, title, metricName)
  {
    var formatCount = d3.format(",.0f");
     var totalWidth = 1600; //960
    var totalHeight = 900; //600

    var margin = {top: 20, right: 20, bottom: 70, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;


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
        //.domain([0, maxBin + binInc])
        //.domain(d3.extent(data, function(d) { return d.x; }))
        .domain([0, d3.max(data, function(d) { return d.x; })])
        .range([0, width]);

    $scope.maxVal = d3.max(data, function(d) { return d.y; });
    console.log("Max value in array: "+$scope.maxVal);
    var dataLength = data.length;


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



    var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });



    var svg = d3.select("#hist").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
    svg.append("g")
        .attr("class", "y axis")
        //.attr("transform", "translate(0," + height + ")")
        .call(yAxis);
        
    // Add axis labels
    /*svg.append("text")
        .attr("class", "x label")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom-50) + ")")
        //.attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Ids ");
      */

    svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(metricName);
        
    // Add title to chart
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (width / 2) + " ," + (-20) + ")")
        //.attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text(title);  


    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  };

   $scope.applyFilter = function($http, url) {
      return $http.get(url).then(function (resp) {
        return resp.data;
      });
    }

    $scope.getMetricNames = function($http, url)
    {
      return $http.get(url).then(function (resp) {
        return resp.data;
      });
    }

  $scope.finishSelection = function()
  {
    console.log("FINISH selection button. Chosen parameters: "+$scope.selectedName+", "+$scope.selectedId+", "+$scope.beginDate+", "+$scope.endDate);
    //var url = '/api/proba/getFilteredData/'+$scope.selectedName+'/'+$scope.selectedId+"/"+$scope.beginDate+"/"+$scope.endDate;
    //console.log("URL: "+url); 
    var diff = Math.abs($scope.selectedEndDate - $scope.selectedBeginDate);
    var hours = diff/(1000*60*60);  // u razlici se jedan dan ne racuna..
    var interval = hours/$scope.numOfDivisionUnits;
    console.log("DIFF "+diff+" HOURS "+hours+" INTERVAL "+interval);

    var url = "/api/proba/getQueryData/"+$scope.selectedName+'/'+$scope.selectedId+"/"+$scope.beginDate+"/"+$scope.endDate+"/"+interval+"h";
    $scope.applyFilter($http, url).then(function(data) {
      var myEl = angular.element( document.querySelector( '#hist' ) );
      myEl.empty();
      $scope.dataJSON = data;
      console.log("DATA: "+JSON.stringify($scope.dataJSON));
      $scope.setDataForChart($scope.dataJSON);
      $scope.createChart($scope.data, "Naslov!", $scope.selectedName);
    });
  }

  $scope.parseDate = function(year, month, date)
  {

    var selYear = 1900 + year;
    console.log("PARSE DATE: "+year+" to "+selYear);
    var selMonth = 1 + month;
    var selDate = date;

    var selM = "";
    var selD = "";
    if(selMonth<10)
    {
      selM = "0"+selMonth;
    }
    else
    {
      selM = selMonth;
    }

     if(selDate<10)
    {
      selD = "0"+selDate;
    }
    else
    {
      selD = selDate;
    }

    var date = selYear+"-"+selM+"-"+selD;
    console.log("DATE: "+date);
    return date;

  }

  $scope.beginDateChanged = function()
  {
    console.log("Begin date changed to "+$scope.selectedBeginDate);
    var year =  $scope.selectedBeginDate.getYear();
    var month = $scope.selectedBeginDate.getMonth();
    var day = $scope.selectedBeginDate.getDate();

    $scope.beginDate = $scope.parseDate(year, month, day);

    var url = "/api/proba/getAllMetricNames/"+$scope.beginDate;
    $scope.getMetricNames($http, url).then(function(data) {
      console.log("HERE "+data);
      $scope.allMetricNamesJSON = data;
      $scope.metricNames = $scope.parseJsonKeys($scope.allMetricNamesJSON);
    });

  }  

  $scope.endDateChanged = function()
  {
    console.log("End date changed to "+$scope.selectedEndDate);    

    var year =  $scope.selectedEndDate.getYear();
    var month = $scope.selectedEndDate.getMonth();
    var day =  $scope.selectedEndDate.getDate();

    //var d = new Date($scope.selectedEndDate.getYear(), $scope.selectedEndDate.getMonth(), $scope.selectedEndDate.getDate());
    //d.setDate(d.getDate()+1);
    //console.log("Try d: "+d);

    $scope.endDate = $scope.parseDate(year, month, day);
    //$scope.endDate = $scope.parseDate(d.getYear(), d.getMonth(), d.getDate());
  }
  
  $scope.selectedName = "";
  $scope.selectedId = ""; 
  $scope.selectedBeginDate = new Date();
  $scope.selectedEndDate = new Date();
  $scope.data = [];
  $scope.numOfDivisionUnits = 50.0;

  $scope.allOracleIdsJSON = $route.current.locals.allOracleIds;
  //$scope.allMetricNamesJSON = $route.current.locals.allMetricNames;

  $scope.oracleIds = $scope.parseJsonKeys($scope.allOracleIdsJSON);
  //$scope.metricNames = $scope.parseJsonKeys($scope.allMetricNamesJSON);
  $scope.beginDateOpened = false;
  $scope.endDateOpened = false;


});




