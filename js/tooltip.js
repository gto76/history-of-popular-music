main()

function main() {
  var RECT_WIDTH = 200
  var RECT_HEIGHT = 100
  var TRIANGLE_WIDTH = 30
  var TRIANGLE_HEIGHT = 50
  var ROUNDNES = 10
  var TEXT_MARGIN = 16

  var TEXT_INFO_1 = "Click on the icon to"
  var TEXT_INFO_2 = "play audio sample."
  var TEXT_CONFIRM = "GOT IT"

  var DISAPPEAR_DELAY = 15
  var DISAPPEAR_DURATION = 100

  var mardiGras = d3.select('#namemardi_gras_in_new_orleans')
  var x = d3.transform(mardiGras.attr("transform")).translate[0] + 2.46*r
  var y = d3.transform(mardiGras.attr("transform")).translate[1] + r * 0.9;

  var group = d3.select('svg')
      .append('g')
      .attr("id", "tooltip")
      .attr("transform", "translate("+x+", "+y+")")

  var clipPath = group.append("clipPath")
      .attr("id", "cut-off-tooltip")

  clipPath.append('polygon')
      .attr("class", "bkgrnd")
      .attr("points", "0,0 "+-(TRIANGLE_WIDTH/2)+","+-(TRIANGLE_HEIGHT+1)+" "+(TRIANGLE_WIDTH/2)+","+-(TRIANGLE_HEIGHT+1))

  clipPath.append('rect')
      .attr("class", "bkgrnd")
      .attr("rx", ROUNDNES)
      .attr("ry", ROUNDNES)
      .attr("x", -(RECT_WIDTH/2))
      .attr("y", -(RECT_HEIGHT+TRIANGLE_HEIGHT))
      .attr("height", RECT_HEIGHT)
      .attr("width", RECT_WIDTH)

  group.append('rect')
      .attr("class", "bkgrnd")
      .attr("x", -(RECT_WIDTH/2))
      .attr("y", -(RECT_HEIGHT+TRIANGLE_HEIGHT))
      .attr("height", RECT_HEIGHT+TRIANGLE_HEIGHT)
      .attr("width", RECT_WIDTH+TRIANGLE_WIDTH)
      .attr("clip-path", "url(#cut-off-tooltip)");


  group.append("text")
      .attr("class", "temp-text")
      .attr("y", -(TRIANGLE_HEIGHT+RECT_HEIGHT*0.77))
      .attr("fill", 'white')
      .attr("fill-opacity", 0.88)
      .attr("font-size", RECT_HEIGHT * 0.2)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "middle")
      .text(TEXT_INFO_1)

  group.append("text")
      .attr("class", "temp-text")
      .attr("y", -(TRIANGLE_HEIGHT+RECT_HEIGHT*0.54))
      .attr("fill", 'white')
      .attr("fill-opacity", 0.88)
      .attr("font-size", RECT_HEIGHT * 0.2)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "middle")
      .text(TEXT_INFO_2)

  group.append("text")
      .attr("class", "temp-text")
      .attr("x", RECT_WIDTH/2 - TEXT_MARGIN)
      .attr("y", -(TRIANGLE_HEIGHT+RECT_HEIGHT/5))
      .attr("font-weight", "bold")
      .attr("text-decoration", "underline")
      .attr("fill", 'MediumBlue')
      .attr("fill-opacity", 1)
      .attr("font-size", RECT_HEIGHT * 0.15)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "end")
      .text(TEXT_CONFIRM)
      .on("click", function(song) {  
          animateGroup()
        })
      .on({
        "mouseover": function(d) {
          d3.select(this).style("cursor", "pointer");
        },
        "mouseout": function(d) {
          d3.select(this).style("cursor", "default");
        }
      });

  function animateGroup() {
    animate(group, DISAPPEAR_DELAY, DISAPPEAR_DURATION, 1, 0)
  }

  function animate(group, delay, duration, scale, opacity) {
    group.transition()
         .delay(delay)
         .duration(duration)
         // .attr("transform", "scale("+String(scale)+")")
         .style('opacity', opacity);
  }    

}

