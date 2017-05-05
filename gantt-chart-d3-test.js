/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

d3.gantt = function() {
  var FIT_TIME_DOMAIN_MODE = "fit";
  var FIXED_TIME_DOMAIN_MODE = "fixed";
  
  var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 150
  };

  var selector = 'body';
  var timeDomainStart = d3.time.day.offset(new Date(),-3);
  var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
  var timeDomainMode = FIT_TIME_DOMAIN_MODE;  // Fixed or fit.
  var taskTypes = [];
  var taskStatus = [];
  var height = document.body.clientHeight - margin.top - margin.bottom-5;
  var width = document.body.clientWidth - margin.right - margin.left-5;

  var tickFormat = "%H:%M";

  var keyFunction = function(d) {
    return d.startDate + d.taskName + d.endDate;
  };

  var rectTransform = function(d) {
    return "translate(" + x(d.taskName) + "," + y(d.startDate) + ")";  ///
  };

  /**
   * Calculates min and max date of tasks.
   */
  var initTimeDomain = function(tasks) {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
      if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = d3.time.day.offset(new Date(), -3);
        timeDomainEnd = d3.time.hour.offset(new Date(), +3);
        return;
      }
      tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
      });
      timeDomainEnd = tasks[tasks.length - 1].endDate;
      tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
      });
      timeDomainStart = tasks[0].startDate;
    }
  };

  /**
   * Initializes axis.
   */ 
  var initAxis = function() {
    x = d3.scale.ordinal()
        .domain(taskTypes)
        .rangeRoundBands([0, width - margin.left - margin.right], .1);

    y = d3.time.scale()
        .domain([timeDomainStart, timeDomainEnd])
        .range([0, height])
        .clamp(true);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickSize(0);

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(20)
        .tickFormat(d3.time.format(tickFormat))
        .tickSubdivide(false)
        .tickSize(8)
        .tickPadding(8);
  };

  /**
   * Draws the chart.
   */
  function gantt(tasks) {
    initTimeDomain(tasks);
    initAxis();
    
    var svg = d3.select(selector)
        .append("svg")
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("class", "gantt-chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("transform", "translate(" + margin.left + ", " + 
                margin.top + ")");

    var groups = svg.selectAll(".chart")
        .data(tasks, keyFunction).enter()
        .append("g")
          .attr("class", "era")
    
    groups.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("class", function(d) { 
          if (taskStatus[d.status] == null) { return "bar"; }
          return taskStatus[d.status];
        }) 
        .attr("y", 0)
        .attr("transform", rectTransform)
        .attr("height", function(d) { 
          return Math.max(1, (y(d.endDate) - y(d.startDate)) );
        })
        .attr("width", function(d) { return x.rangeBand(); })
     
    // // Music icons. 
    // groups.filter(function(d) { return ("idd" in d); })
    //     .append("circle")
    //     .attr("cx", 0)
    //     .attr("cy", 0)
    //     .attr("r", 15)
    //     .attr("fill", "blue")
    //     .attr("transform", function(d) {
    //       dHor = x(d.taskName) + x.rangeBand()/2
    //       dVer = y(d.startDate)
    //       return "translate(" + dHor + "," + dVer + ")"
    //     })

    // groups.append("circle")
    //     .attr("cx", 0)
    //     .attr("cy", 0)
    //     .attr("r", 15)
    //     .attr("fill", "blue")
    //     .attr("transform", function(d) {
    //       dHor = x(d.taskName) + x.rangeBand()/2
    //       dVer = y(d.startDate)
    //       return "translate(" + dHor + "," + dVer + ")"
    //     })

    svg.append("g")
        .style("font-size", "18px")
        .attr("class", "x axis")
        .attr("transform", 
            "translate(0, " + 0 + ")")
        .transition()
        .call(xAxis);
     
    svg.append("g")
        .attr("class", "y axis")
        .transition()
        .call(yAxis);

    // svg.append("g")
    //   .style("font", "14px times")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x));
     
     return gantt;
  };
  

  ////
  ///  GETTERS
  //

  gantt.margin = function(value) {
    if (!arguments.length)
      return margin;
    margin = value;
    return gantt;
  };

  gantt.timeDomain = function(value) {
    if (!arguments.length)
      return [ timeDomainStart, timeDomainEnd ];
    timeDomainStart = +value[0], timeDomainEnd = +value[1];
    return gantt;
  };

  /**
   * @param {string}
   *                vale The value can be "fit" - the domain fits the data or
   *                "fixed" - fixed domain.
   */
  gantt.timeDomainMode = function(value) {
    if (!arguments.length)
      return timeDomainMode;
    timeDomainMode = value;
    return gantt;

  };

  gantt.taskTypes = function(value) {
    if (!arguments.length)
      return taskTypes;
    taskTypes = value;
    return gantt;
  };
  
  gantt.taskStatus = function(value) {
    if (!arguments.length)
      return taskStatus;
    taskStatus = value;
    return gantt;
  };

  gantt.width = function(value) {
    if (!arguments.length)
      return width;
    width = +value;
    return gantt;
  };

  gantt.height = function(value) {
    if (!arguments.length)
      return height;
    height = +value;
    return gantt;
  };

  gantt.tickFormat = function(value) {
    if (!arguments.length)
      return tickFormat;
    tickFormat = value;
    return gantt;
  };

  gantt.selector = function(value) {
    if (!arguments.length)
      return selector;
    selector = value;
    return gantt;
  };

  return gantt;
};
