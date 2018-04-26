// ajax call to fetch json
function loadData(){
  $("svg").remove();
  var first_date = $.datepicker.formatDate('yy-mm-dd', new Date($("#fdate").val()))
  var last_date = $.datepicker.formatDate('yy-mm-dd', new Date($("#ldate").val()))
  var username = $("#username").val();
  var reponame = $("#reponame").val();

  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    url: 'https://api.github.com/repos/' + username + '/' + reponame + '/commits',
    dataType: 'json',
    success: function(data){
      var commits = [];
      var dates = [];
      $.each(data, function( index, value ) {
        var date = $.datepicker.formatDate('yy-mm-dd', new Date(value.commit.author.date))
        if ($.inArray(date, dates) == -1 && date >= first_date && date <= last_date) {
          dates.push(date);
          var year = new Date(date).getFullYear();
          var commit = { commit_year: year, no_of_commits: 0 }
          if (typeof commit !== 'undefined') {
            $.each(data, function( index1, value1 ) {
              var date2 = $.datepicker.formatDate('yy-mm-dd', new Date(value1.commit.author.date))
              if (date === date2)
                commit.no_of_commits = (commit.no_of_commits + 1);
            });
          };
          commits.push(commit);
        }
      });
      drawBarPlot(commits, first_date, last_date);
    }
  });
};

function error() {
    console.log("Something went wrong!");
}

// fetch data on page load
$(document).ready(function(){
  loadData(); 
});
 
function drawBarPlot(data, first_date, last_date) {
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
      .x(function(d) { return x(d.commit_year); })
      .y(function(d) { return y(d.no_of_commits); });
    
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  data.forEach(function(d) {
    d.commit_year = parseTime(d.commit_year);
    d.no_of_commits = +d.no_of_commits;
  });
  
  // sort years ascending
  data.sort(function(a, b){
    return a["commit_year"]-b["commit_year"];
  })
 
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.commit_year; }));
  y.domain([0, d3.max(data, function(d) {
    return Math.max(d.no_of_commits); })]);
  
  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);  
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}
 
function error() {
    console.log("error")
}