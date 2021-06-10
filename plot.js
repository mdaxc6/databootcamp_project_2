const url = "https://park-accidents-api.herokuapp.com/api/v1.0/all_accidents";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
  // Call `init()` function
  init(data);
});

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


//PLOTS//


/*Accidents/time, Device type/accidents, Business type/accident, name/accidents */

//Barchart

// Function to display the plot
function plotBar(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];

  var device_type = data[device_type];

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
    if(data.device_type && data.date){
      xData.push(data.device_type);
      yData.push(data.date);
    }
  }});

  console.log(xData);
  console.log(yData);


  // Create a trace using the platform keys and values
  var trace = {
      x: xData,
      y: yData,
      type: "bar"
  };

  var chartData = [trace];

  // Return data to form chart
  return chartData;
}

function updatePlot(data) {
  var chartData = plotBar(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

//SCATTER PLOT WITH HOVER TEXT//


function plotScatter(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];
  var device_category = [];
  var trademarkname_or_generic = [];

  var device_type = data[device_type];
  var parseTime = d3.timeParse("%m/%d/%Y");

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
        data.date = parseTime(data.date);
      xData.push(data.date);
      yData.push(data.bus_type);
    }
  });

  console.log(xData);
  console.log(yData);

  // Creating Trace

  var trace = {
    x: xData,
    y: yData,
    mode: 'markers',
    type: 'scatter',
    text: [''],
    marker: { size: 5 }
  };
  
  var data = [trace];
  
  var layout = {
    
    title:'Accidents Vs Type of Amusement Park'
  };
  
  Plotly.newPlot('scatterDiv', data, layout);
  // Return data to form chart
  return chartData;
}

function updatePlot(data) {
  var chartData = plotScatter(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("scatterDiv", chartData);
}

////Bubblechart
function plotBar(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];

  var device_type = data[device_type];

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
    if(data.device_type && data.date){
      xData.push(data.device_type);
      yData.push(data.date);
    }
  }});

  console.log(xData);
  console.log(yData);
  // // Create arrays 
  // var xData = Object.values(accident_data.device_type);
  // var yData = Object.values(accident_data.acc_date);

  // Create a trace using the platform keys and values
  var trace = {
      x: xData,
      y: yData,
      type: "bar"
  };

  var chartData = [trace];

  // Return data to form chart
  return chartData;
}

function updatePlot(data) {
  var chartData = plotBar(data);

  // Use `Plotly.react()` to update plot
  Plotly.react("chartDiv", chartData);
}

//BubbleChart with hover text//


function plotBubble(data) {
  
  // Create arrays 
  var xData = [];
  var yData = [];
  var device_category = [];
  var trademarkname_or_generic = [];

  var device_type = data[device_type];
  var parseTime = d3.timeParse("%m/%d/%Y");

  data["accidents"].forEach(function(data){
    if (data.device_type && data.date){
        data.date = parseTime(data.date);
      xData.push(data.date);
      yData.push(data.bus_type);
    }
  });

  console.log(xData);
  console.log(yData);

  var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 11, 12, 13],
    text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
    mode: 'markers',
    marker: {
      color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
      size: [40, 60, 80, 100]
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bubble Chart Hover Text',
    showlegend: false,
    height: 600,
    width: 600
  };
  
  Plotly.newPlot('myDiv', data, layout);

// Function to create initial chart
function init(data) {
  plotBar(data);
  plotScatter(data);
  plotBubble(data);

}}

// On change to the DOM, call updatePlot()
d3.selectAll("selDataset").on("change", updatePlot);