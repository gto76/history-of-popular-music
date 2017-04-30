/**
 * Script for drawing circles, that play music when clicked on.
 */

var DEBUG = true

var RADIUS = 20
var PLAYING_RADIUS_FACTOR = 2.5

// This should probably be a whole number, so that node size doesn't keep 
// oscilating after reaching its final size.
var NODE_GROWTH_RATE = 1

var TRIANGLE_SIZE_FACTOR = 0.72
var TRIANGLE_COLOR = "white"
var BACKGROUND_COLOR = "black"
var TRIANGLE_FILL_OPACITY = 0.9 
var BACKGROUND_OPACITY = 0.22
var OPACITY_FADE_TIME = 300

var CROSSFADE_DURATION = 1000
var CROSSFADE_VOLUME = true
var FADEOUT_DURATION = 750
var FADEIN_DURATION = 0
var RADIUS_TRANSITION_MIN = 1000

//////////////////////////////////////

var crossfadeDuration = CROSSFADE_DURATION

var width = getWidth()
var height = getHeight() 

var hSpace = x.rangeBand() / 4;
var vSpace = (y(new Date(1996, 0, 0)) - y(new Date(1986, 0, 0))) / 4;

var r = Math.min(hSpace, vSpace);

//////////////////////////////////////

var nodes = d3.selectAll("g.era")
  .filter(function(d) { return ("songs" in d); })
  .append("g")
    .on("click", function(d) { play(d.songs[0]) })
    .attr('id', function(d) { return 'name' + d.songs[0].song })
    .attr("transform", function(d) {
      dHor = x(d.taskName) + x.rangeBand()/2 - r
      dVer = y(d.startDate) - r
      return "translate(" + dHor + "," + dVer + ")"
    })

var clipPath = nodes.append("clipPath")
  .attr("id", "cut-off-bottom")

clipPath.append("circle")
  .attr("cx", r)
  .attr("cy", r)
  .attr("r", r)

nodes.append("image")
  .attr("x", "0")
  .attr("y", "0")
  .attr("xlink:href", 
      function(d) { return "../JamendoDataset/"+ d.songs[0].song + ".jpg" })
  .attr("height", r * 2)
  .attr("width", r * 2)
  .attr("clip-path", "url(#cut-off-bottom)")

//#####################
//##### PLAY ICON #####
//#####################

addPlayIcon(nodes)

function addPlayIcon(ggg) {
  var s = TRIANGLE_SIZE_FACTOR

  // Rhere are five points so that all corners of triangle are rendered nicely.
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

  var shade = ggg.append("circle")
    .attr("cx", r)
    .attr("cy", r)
    .attr("r", r)
    .attr("fill", BACKGROUND_COLOR)
    .attr("fill-opacity","0.4")

  var path = ggg.append("path")
    .attr("d", lineFunction(triangle))
    .attr("fill-opacity","0.0")
    .attr("fill", TRIANGLE_COLOR)
}

function showPlayIcon(id) {
  setPlayIconOpacity(id, TRIANGLE_FILL_OPACITY)
}

function hidePlayIcon(id) {
  setPlayIconOpacity(id, 0.0)
}

function setPlayIconOpacity(id, opacity) {
  var ggg = d3.selectAll('#name' + id)
  ggg.select("path")
    .transition()
    .duration(OPACITY_FADE_TIME)
    .attr("fill-opacity", opacity)
}

//#################
//##### AUDIO #####
//#################

// Last audio element that started playing and is still playing.
var playing = ""

var nodes = d3.selectAll("g.era") //.enter()
  .filter(function(d) { return ("songs" in d); })
  .each(function(d) {
    generateAudioElement(d.songs[0].song); 
  });

function generateAudioElement(id) {
  var track = new Audio();
  var audioElement = document.createElement("source");

  track.setAttribute("id", "audio"+id);
  audioElement.setAttribute("src", "../JamendoDataset/"+id+".mp3");

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

//################
//##### UTIL #####
//################

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
  var audioFileId = nodesData.song
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
