// <!DOCTYPE html>
// <html>
// <head>
//  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

//  <script src="lib/jquery-2.1.3.js"></script>
//  <script src="lib/d3.v3.min.js"></script>
//  <script src="lib/bootstrap.min.js"></script>
//  <link rel="stylesheet" href="lib/bootstrap.min.css">
//  <script src="lib/bootstrap-slider.js"></script>
//  <link rel="stylesheet" href="lib/bootstrap-slider.css">

//  <script src="data/jamendo-data.js"></script>

//  <style>
//    .overlay {
//      fill: none;
//      pointer-events: all;
//    }
//  </style>
// </head>

// <body>

// <h4 style="position: absolute; left: 130px; top: 20px">Crossfade:</h4>

// <input id="ex6" type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3"/>

// <script>
//  $("#ex6").slider() 
//  $(".slider").attr('style', 'position: absolute; left: 230px; top: 30px');
//  $("#ex6").on("slide", function(slideEvt) {
//    crossfadeDuration = slideEvt.value * 1000
//  });
// </script>

// <div id="body">

// <script type="text/javascript">

//////////////////////////////////////
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

var CROSSFADE_DURATION = 3000
var CROSSFADE_VOLUME = true
var FADEOUT_DURATION = 1000
var FADEIN_DURATION = 0
var RADIUS_TRANSITION_MIN = 1000

//////////////////////////////////////

var crossfadeDuration = CROSSFADE_DURATION

var songs = JSON.parse(songs);

var width = getWidth()
var height = getHeight() 


//################
//##### DATA #####
//################

// var numOfSongs = Object.keys(songs.songs).length

// Each node has 4 bubles, each in one sector,
// var data = d3.range(numOfSongs)
//   .map(function() { 
//     return {r: RADIUS}; 
//   })
  
// data.forEach(function(d, i) { 
//   // SET id
//   var keys = Object.keys(songs.songs)
//   var songIndex = keys[i%numOfSongs]
//   d.id = songIndex.slice(1)
//   d.x = 100
//   d.y = 100
// })

//###############
//##### SVG #####
//###############

// var groups = svg.selectAll(".chart")
//         .data(tasks, keyFunction).enter()
//         .append("g")

// Music icons. 
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

//#################
//##### NODES #####
//#################

// var nodes = svg.selectAll("g")
//   .data(data)
//     .enter().append("g")
//   .on("click", function(d) { play(d) })
//   .attr('id', function(d) { return 'name' + d.id })


var nodes = d3.selectAll("g.era") //.enter()
  .filter(function(d) { return ("song" in d); })
  .append("g")
    .on("click", function(d) { play(d) })
    .attr('id', function(d) { return 'name' + d.song })

var clipPath = nodes.append("clipPath")
  .attr("id", "cut-off-bottom")

clipPath.append("circle")
  .attr("cx", function(d) { return d.r; })
  .attr("cy", function(d) { return d.r; })
  .attr("r", function(d) { return d.r; })

nodes.append("image")
  .attr("x", "0")
  .attr("y", "0")
  .attr("xlink:href", 
      function(d) { return "../JamendoDataset/"+ d.song + ".jpg" })
  .attr("height", function(d) { return (d.r) * 2; })
  .attr("width", function(d) { return (d.r) * 2; })
  .attr("clip-path", "url(#cut-off-bottom)")

addPlayIcon(nodes)

function addPlayIcon(ggg) {
  var s = TRIANGLE_SIZE_FACTOR
  var r = RADIUS

  // there are five points so that all corners are rendered nicely
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
    .attr("cx", function(d) { return d.r; })
    .attr("cy", function(d) { return d.r; })
    .attr("r", function(d) { return d.r; })
    .attr("fill", BACKGROUND_COLOR)
    .attr("fill-opacity","0.4")

  var path = ggg.append("path")
    .attr("d", lineFunction(triangle))
    .attr("fill-opacity","0.0")
    .attr("fill", TRIANGLE_COLOR)
}

// #### PLAY ICON ####

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

// generateAudioElements()

// last audio element that started playing and is still playing
var playing = ""

var nodes = d3.selectAll("g.era") //.enter()
  .filter(function(d) { return ("song" in d); })
  .each(function(d) {
    generateAudioElements(d.song); 
  });

function generateAudioElements(id) {
  // var id = id.slice(1),
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

// function generateAudioElements() {
//   for (var id in songs.songs) {
//     var id = id.slice(1),
//         track = new Audio(),
//         audioElement = document.createElement("source");
//     track.setAttribute("id", "audio"+id);
//     audioElement.setAttribute("src", "../JamendoDataset/"+id+".mp3");

//     track.addEventListener('ended', function(e) {
//       if (DEBUG) console.log("ENDED event "+this.id)
//       hidePlayIcon(this.id.slice(5))
//     }, false);

//     track.addEventListener('play', function(e) {
//       if (DEBUG) console.log("PLAY event "+this.id)
//       showPlayIcon(this.id.slice(5))
//     }, false);

//     track.addEventListener('pause', function(e) {
//       if (DEBUG) console.log("PAUSE event "+this.id)
//       hidePlayIcon(this.id.slice(5))
//     }, false);

//     track.appendChild(audioElement)
//     document.body.appendChild(track)
//   }
// }

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
  // update state
  var id = audioEl.id.slice(5)
  playing = audioEl
  
  // fade in
  fadeIn(audioEl, FADEIN_DURATION)
}

function skipTo(audioEl) {
  // update state
  exPlaying = playing
  playing = audioEl

  // fade out/in
  fadeOut(exPlaying, crossfadeDuration)
  fadeIn(audioEl, crossfadeDuration) 
}

function stopPlayback(audioEl) {
  // update state
  exPlaying = playing
  playing = ""

  // fade out
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

// </script>
// </body></html>
