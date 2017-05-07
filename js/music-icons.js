/**
 * Script for drawing circles, that play music when clicked on.
 */

var DEBUG = false

var RADIUS = 20
var PLAYING_RADIUS_FACTOR = 2.5

// This should probably be a whole number, so that node size doesn't keep 
// oscilating after reaching its final size.
var NODE_GROWTH_RATE = 1

var TRIANGLE_SIZE_FACTOR = 0.72
var TRIANGLE_COLOR = "white"
var BACKGROUND_COLOR = "black"

// Opacities
var TRIANGLE_FILL_OPACITY = 0.9 
var BACKGROUND_OPACITY = 0.32
var BACKGROUND_OPACITY_PLAY = 0.22
var YEAR_OPACITY = 0.88 //0.85

var OPACITY_FADE_TIME = 300
var BKG_OPACITY_FADE_TIME = 400

var CROSSFADE_DURATION = 1000
var CROSSFADE_VOLUME = true
var FADEOUT_DURATION = 750
var FADEIN_DURATION = 0
var RADIUS_TRANSITION_MIN = 1000

//////////////////////////////////////

var crossfadeDuration = CROSSFADE_DURATION

var width = getWidth()
var height = getHeight() 

var hSpace = x.rangeBand() / 7; //4;
var vSpace = getYRange(new Date(1986, 0, 0), new Date(1996, 0, 0)) / 4;

var r = Math.min(hSpace, vSpace);

function getYRange(startDate, endDate) {
  return y(endDate) - y(startDate)
}

// Last audio element that started playing and is still playing.
var playing = ""

//////////////////////////////////////

main()

function main() {
  var songIcons = generateSongIcons()
  addClipPath(songIcons)
  addImage(songIcons)
  addPlayIcon(songIcons)
  addYear(songIcons)
  addText(songIcons)
  addRemarks()

  // Generates audio element for each songIcon.
  songIcons.each(function(song) { generateAudioElement(song.title); });
}


////
///  SONG ICONS
//

function generateSongIcons() {
  return d3.selectAll("g.era")
    .filter(function(task) { return ("songs" in task); })
    .selectAll('g.icon')
      .data(function (task) {
          return appendTaskNameToAll(task.taskName, task.songs);
        })
      .enter()
      .append('g')
        .attr("class", "icon")
        .on("click", function(song) { play(song) })
        .attr('id', function(song) { return 'name' + song.title })
        .attr("transform", function(song) {
          dHor = x(song.taskName) + x.rangeBand()/2 - r
          dVer = y(song.date) - r
          return "translate(" + dHor + "," + dVer + ")"
        })
        .on({
          "mouseover": function(d) {
            d3.select(this).style("cursor", "pointer");
          },
          "mouseout": function(d) {
            d3.select(this).style("cursor", "default");
          }
        });
}

function appendTaskNameToAll(taskName, elements) { 
  var out = [];
  for (i = 0; i < elements.length; i++) {
    var element = elements[i]
    element.taskName = taskName
    out.push(element)
  } 
  return out; 
}

function addClipPath(songIcons) {
  songIcons.append("clipPath")
    .attr("id", "cut-off-bottom")
    .append("circle")
      .attr("cx", r)
      .attr("cy", r)
      .attr("r", r)
}

function addImage(songIcons) {
  songIcons.append("image")
    .attr("x", "0")
    .attr("y", "0")
    .attr("xlink:href", 
        function(song) { return "media/"+ song.title + ".jpg" })
    .attr("height", r * 2)
    .attr("width", r * 2)
    .attr("clip-path", "url(#cut-off-bottom)");
}

function addPlayIcon(songIcons) {
  // There are five points so that all corners of triangle are rendered nicely.
  var s = TRIANGLE_SIZE_FACTOR
  var triangle = [ 
      { "x": r - (r*0.55 * s), "y": r - (r*0.45 * s) }, 
      { "x": r + (r*0.75 * s), "y": r },
      { "x": r - (r*0.55 * s), "y": r + (r*0.45 * s) },
      { "x": r - (r*0.55 * s), "y": r - (r*0.45 * s) },
      { "x": r + (r*0.75 * s), "y": r }
    ];

  var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");

  var shade = songIcons.append("circle")
    .attr("class", "play-background")
    .attr("cx", r)
    .attr("cy", r)
    .attr("r", r)
    .attr("fill", BACKGROUND_COLOR)
    .attr("fill-opacity", BACKGROUND_OPACITY);

  var path = songIcons.append("path")
    .attr("d", lineFunction(triangle))
    .attr("fill-opacity", "0.0")
    .attr("fill", TRIANGLE_COLOR);
}

function showPlayIcon(id) {
  setPlayIconOpacity(id, TRIANGLE_FILL_OPACITY, BACKGROUND_OPACITY_PLAY, 
                     OPACITY_FADE_TIME, BKG_OPACITY_FADE_TIME, 0.0, 
                     BKG_OPACITY_FADE_TIME);
}

function hidePlayIcon(id) {
  setPlayIconOpacity(id, 0.0, BACKGROUND_OPACITY, OPACITY_FADE_TIME, 
                     OPACITY_FADE_TIME, YEAR_OPACITY, 1.0);
}

function setPlayIconOpacity(id, opacity, backgroundOpacity, triangleFadeTime,
                            bkgFadeTime, yearOpacity, yearFadeTime) {
  var songIcon = d3.selectAll('#name' + id)
  songIcon.select("path")
    .transition()
    .duration(triangleFadeTime)
    .attr("fill-opacity", opacity)

  songIcon.select("circle.play-background")
    .transition()
    .duration(bkgFadeTime)
    .attr("fill-opacity", backgroundOpacity)

  songIcon.select("text.year")
    .transition()
    .duration(yearFadeTime)
    .attr("fill-opacity", yearOpacity)
}

function addYear(songIcons) {
  songIcons
    .filter(function(song) { return ("year" in song); })
    .append("text")
      .attr("class", "year")
      .attr("x", r * 1.04)
      .attr("y", r * 1.09)
      // .attr("stroke", "#000000")
      // .attr("stroke-width", "0.2px")
      // .attr("stroke-opacity", 0.7)
      // .attr("stroke-linecap", "butt")
      // .attr("stroke-linejoin", "miter")
      .attr("fill", 'white')
      .attr("fill-opacity", YEAR_OPACITY)
      .attr("font-size", r * 1.02)
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "middle")
      .text(function(song) { return String(song.year).substr(2,4) + "'"; })
}

function addText(songIcons) {
  songIcons
    .filter(function(song) { return ("text" in song); })
    .selectAll('text.title')
      .data(function (song) { return song.text; })
      .enter()
      .append("text")
        .attr("class", "title")
        .attr("x", r)
        .attr("y", function(text, i) { return 2.4*r + i*r*3.1/5; })
        .attr("fill", "#111111")
        .attr("fill-opacity", 0.9)
        .attr("font-size", r * 2.6/5)
        .attr("font-weight", "bold")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text(function(text) { return text; })
}

function addRemarks() {
  d3.selectAll("g.era")
    .filter(function(task) { return ("remarks" in task); })
    .selectAll('text.remark')
    .data(function (task) {
        var lines = []
        for (i = 0; i < task.remarks.length; i++) {
          var remark = task.remarks[i]
          var noOfLines = remark.lines.length
          var yTop = y(remark.top) + r * remark.topMargin
          var yBottom = y(remark.bottom) - r * remark.bottomMargin
          var yDelta = (yBottom - yTop) / (noOfLines + 1);
          for (j = 0; j < noOfLines; j++) {
            var line = remark.lines[j]
            line.x = x(task.taskName) + x.rangeBand()/2
            line.y = yTop + (j + 1) * yDelta;
            lines.push(line)
          }
        }
        return lines;
      })
      .enter()
      .append('text')
        .attr("class", "remark")
        .attr("x", function(line) { return line.x })
        .attr("y", function(line, i) { return line.y; })
        .attr("fill", "#111111")
        .attr("fill-opacity", 0.9)
        .attr("font-size", r * 2.9/5)
        .attr("font-weight", "bold")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .text(function(line) { return line.text; })
}


////
///  AUDIO ELEMENTS
// 

function generateAudioElement(id) {
  var track = new Audio();
  var audioElement = document.createElement("source");

  track.setAttribute("id", "audio"+id);
  track.preload = "auto"
  audioElement.setAttribute("src", "media/"+id+".mp3");

  track.addEventListener('ended', function(e) {
    if (DEBUG) console.log("ENDED event "+this.id)
    hidePlayIcon(this.id.slice(5))
  }, false);

  track.addEventListener('play', function(e) {
    if (DEBUG) console.log("PLAY event "+this.id)
    showPlayIcon(this.id.slice(5))
  }, false);

  track.addEventListener('pause', function(e) {
    if (DEBUG) console.log("PAUSE event "+this.id)
    hidePlayIcon(this.id.slice(5))
  }, false);

  track.appendChild(audioElement)
  document.body.appendChild(track)
}

function play(nodesData){
  var audioEl = getAudioEl(nodesData)

  if (audioEl.paused) {
    if (playing == "") {
      if (DEBUG) console.log("### start playback "+audioEl.id)
      startPlayback(audioEl)
    } else {
      if (DEBUG) console.log("### skip to "+audioEl.id)
      skipTo(audioEl)
    }
  } else {
    if (DEBUG) console.log("### stop playback "+audioEl.id)
    stopPlayback(audioEl)
  }
}

function startPlayback(audioEl) {
  // Updates state.
  var id = audioEl.id.slice(5)
  playing = audioEl
  
  // Fades in.
  fadeIn(audioEl, FADEIN_DURATION)
}

function skipTo(audioEl) {
  // Updates state.
  exPlaying = playing
  playing = audioEl

  // Fades out/in.
  fadeOut(exPlaying, crossfadeDuration)
  fadeIn(audioEl, crossfadeDuration) 
}

function stopPlayback(audioEl) {
  // Updates state.
  exPlaying = playing
  playing = ""

  // Fades out.
  fadeOut(audioEl, FADEOUT_DURATION)
  if (exPlaying != "") { 
    fadeOut(exPlaying, FADEOUT_DURATION)
  }
}

// <<< TODO deny three simultaneous tracks at once

function fadeIn(audioEl, duration) {
  if (CROSSFADE_VOLUME) {
    $(audioEl).stop(true, false)
    $(audioEl).prop('volume', 0.0)
    $(audioEl).animate({volume: 1.0}, duration);
  }
  audioEl.play()
}

function fadeOut(audioEl, duration) {
  if (DEBUG) console.log("fadeOut, audioEl "+audioEl.id)
  if (CROSSFADE_VOLUME) {
    $(audioEl).stop(true, false)
    $(audioEl).animate({volume: 0.0}, duration);
  }
  setTimeout(function() {
    audioEl.pause()
    audioEl.currentTime = 0
  }, duration);
}


////
///  UTIL
// 

function contains(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}

function getNode(audioEl) {
  var id = audioEl.id.slice(5)
  return d3.select('#name' + id)
}

function getAudioEl(nodesData){
  var audioFileId = nodesData.title
  var node = d3.select( '#name' + audioFileId );  
  return document.getElementById("audio"+audioFileId);
}

function getWidth() {
  var w = window,
      e = document.documentElement,
      g = document.getElementsByTagName('body')[0]
  return w.innerWidth || e.clientWidth || g.clientWidth;
}

function getHeight() {
  var w = window,
      e = document.documentElement,
      g = document.getElementsByTagName('body')[0]
  return w.innerHeight|| e.clientHeight|| g.clientHeight;
}
