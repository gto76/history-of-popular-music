// <!DOCTYPE html>
// <html>
// <head>
// 	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

// 	<script src="lib/jquery-2.1.3.js"></script>
// 	<script src="lib/d3.v3.min.js"></script>
// 	<script src="lib/bootstrap.min.js"></script>
// 	<link rel="stylesheet" href="lib/bootstrap.min.css">
// 	<script src="lib/bootstrap-slider.js"></script>
// 	<link rel="stylesheet" href="lib/bootstrap-slider.css">

// 	<script src="data/jamendo-data.js"></script>

// 	<style>
// 		.overlay {
// 			fill: none;
// 			pointer-events: all;
// 		}
// 	</style>
// </head>

// <body>
// <button id="shuffleButton" type="button" class="btn btn-default" style="position: absolute; left: 20px; top: 22px">Shuffle: Off</button>

// <h4 style="position: absolute; left: 130px; top: 20px">Crossfade:</h4>

// <input id="ex6" type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="3"/>

// <script>
// 	$("#ex6").slider() 
// 	$(".slider").attr('style', 'position: absolute; left: 230px; top: 30px');
// 	$("#ex6").on("slide", function(slideEvt) {
// 		crossfadeDuration = slideEvt.value * 1000
// 	});
// </script>

// <div id="body">

// <script type="text/javascript">

//////////////////////////////////////
var DEBUG = true

var RADIUS = 20
var PLAYING_RADIUS_FACTOR = 2.5

// Number of sectors in one dimension, actual number of sectors is the power of two.
// Each sector contains a copy of all the nodes.
// This enables scrolling over the edge
var NUMBER_OF_SECTORS = 2

// This should probably be a whole number, so that node size doesn't keep oscilating 
// after reaching its final size
var NODE_GROWTH_RATE = 1

var TRIANGLE_SIZE_FACTOR = 0.72
var TRIANGLE_COLOR = "white"
var BACKGROUND_COLOR = "black"
var TRIANGLE_FILL_OPACITY = 0.9 
var BACKGROUND_OPACITY = 0.22
var OPACITY_FADE_TIME = 300

var AUTOPLAY = true
var CROSSFADE_DURATION = 3000
var CROSSFADE_VOLUME = true
var FADEOUT_DURATION = 1000
var FADEIN_DURATION = 0
var RADIUS_TRANSITION_MIN = 1000

var SHUFFLE = false
//////////////////////////////////////

var shuffle = SHUFFLE
var crossfadeDuration = CROSSFADE_DURATION

var songs = JSON.parse(songs);

var width = getWidth()
var height = getHeight() 


//################
//##### DATA #####
//################

var numOfSongs = Object.keys(songs.songs).length

// Each node has 4 bubles, each in one sector,
var data = d3.range(numOfSongs*NUMBER_OF_SECTORS*NUMBER_OF_SECTORS)
	.map(function() { 
		return {r: RADIUS}; 
	})
	
data.forEach(function(d, i) { 
	// SET id
	var keys = Object.keys(songs.songs)
	var songIndex = keys[i%numOfSongs]
	d.id = songIndex.slice(1)

	var sectorIndex = Math.floor(i/numOfSongs)

	// SET X
	var tempo = songs.songs[songIndex].tempo
	var sectorX = sectorIndex % NUMBER_OF_SECTORS
	d.fociX = getFociX(tempo) + sectorX * width
	d.x = d.fociX

	// SET Y
	var key = songs.songs[songIndex].key
	var sectorY = Math.floor(sectorIndex/NUMBER_OF_SECTORS)
	d.fociY = getFociY(key) + sectorY * height
	d.y = d.fociY
})

function getFociX(tempo) {
	if (tempo == 0) {
		tempo = Math.random()
	}
	var logOfTempo = Math.floor( Math.log(tempo) / Math.log(2));
	var tempoFloor = Math.pow(2, logOfTempo)
	var widthRatio = (tempo - tempoFloor) / tempoFloor
	return width * widthRatio
}

function getFociY(key) {
	// the keys are ordered in circle of fifths,
	// so that songs with keys that sound nicer together get positioned 
	// closer to one another 
	var positions = [11, 4, 9, 2, 7, 12, 5, 10, 3, 8, 1, 6]
	var pos = positions[key]
	var heightRatio = pos / 12	
	return height * heightRatio
}

// Add to every node the map of the distances to other nodes
data.forEach(function(d) { 
	d.distances = {}
	data.forEach(function(e) {
		d.distances[e.id] = getDistance(d, e)
	})
})

function getDistance(node1, node2) {
	var distance = getDistanceA(node1.fociX, node1.fociY, node2.fociX, node2.fociY)
	// It needs to check if any distance to the node in
	// adjacent sectors of the torus space is smaller then the
	// one inside its own sector
	// NOTE: it will also work without it for the upper left corner nodes,
	// but not for the lower right. I don't know why.
	for (i = -1; i <= 1; i++) {
		for (j = -1; j <= 1; j++) {
			var x2 = node2.fociX + width*i
			var y2 = node2.fociY + height*i
			var distanceCandidate = getDistanceA(node1.fociX, node1.fociY, x2, y2)
			if (distanceCandidate < distance) {
				distance = distanceCandidate
			}
		}
	}
	return distance
}

function getDistanceA(x1, y1, x2, y2) {
	var dx = x1 - x2 
	var dy = y1 - y2
	return Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
}

//###############
//##### SVG #####
//###############

var svg = d3.select("#body").append("svg:svg")
	.attr("width", width)
	.attr("height", height)
  .append("g")
  .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomHandler))
  .append("g");

svg.append("rect")
	.attr("class", "overlay")
	.attr("width", width*NUMBER_OF_SECTORS)
	.attr("height", height*NUMBER_OF_SECTORS);

//<rect width="1287" height="78" style="fill:rgba(100,100,100,0.2)"></rect>
d3.select("svg").append("rect")
	.attr("style", "fill:rgba(100,100,100,0.2)")
	.attr("width", width*NUMBER_OF_SECTORS)
	.attr("height", 78);

//#################
//##### NODES #####
//#################

var nodes = svg.selectAll("g")
	.data(data)
  	.enter().append("g")
	.on("click", function(d) { play(d) })
	.attr('id', function(d) { return 'name' + d.id })

var clipPath = nodes.append("clipPath")
	.attr("id", "cut-off-bottom")

clipPath.append("circle")
	.attr("cx", function(d) { return d.r; })
	.attr("cy", function(d) { return d.r; })
	.attr("r", function(d) { return d.r; })

nodes.append("image")
	.attr("x", "0")
	.attr("y", "0")
	.attr("xlink:href", function(d) { return "../JamendoDataset/"+ d.id + ".jpg" })
	.attr("height", function(d) { return (d.r) * 2; })
	.attr("width", function(d) { return (d.r) * 2; })
	.attr("clip-path", "url(#cut-off-bottom)")

addPlayIcon(nodes)

function zoomHandler() {
	svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

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

// #### RADIUS ####

function shrinkNode(audioEl, duration) {
	changeNodesRadius(audioEl, RADIUS, duration)
}

function enlargeNode(audioEl, duration) {
	changeNodesRadius(audioEl, RADIUS*PLAYING_RADIUS_FACTOR, duration)
}

function changeNodesRadius(audioEl, radius, duration) {
	if (DEBUG) {
		//console.log("id "+audioEl.id)
		//console.log("radius "+radius)
		//console.log("duration "+duration)
	}
	if (duration < RADIUS_TRANSITION_MIN) {
		duration = RADIUS_TRANSITION_MIN
	}
	var g = getNode(audioEl)
	var gId = g.attr("id").slice(4)

	data.forEach(function(d) {
		if (d.id == gId) {
			$(d).stop(true, false)
			$(d).animate({r: radius}, duration);
		}
	})

	force.start();
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

//###################
//##### ON TICK #####
//###################

var force = d3.layout.force()
	.gravity(0)
	.nodes(data)
	.size([width, height])
	.links([])

force.start();

force.on("tick", function(e) {
	var k = .1 * e.alpha;
  data.forEach(function(o) {
		o.y += (o.fociY - o.y) * k
		o.x += (o.fociX - o.x) * k
	});

	var q = d3.geom.quadtree(data)
	data.forEach(function(o) { q.visit(collide(o)) })

	var ggg = svg.selectAll("g")
  	.attr("transform", function(d) { 
			var relativeSize = d.r/RADIUS
			var x = d.x - d.r
			var y = d.y - d.r
			return "translate("+x+","+y+")scale("+relativeSize+")" 
		})
   
  ggg.selectAll("circle")
		.attr("fill-opacity", function(d) { return ((d.r/RADIUS)-1) * BACKGROUND_OPACITY })

	//ggg.select("path") // transparency of play icon depends on the radius
	//		.attr("fill-opacity", function(d) { return ((d.r/RADIUS)-1) * TRIANGLE_FILL_OPACITY })
});

function collide(node) {
  var r = node.r + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;

  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = node.r + quad.point.r;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2
        || x2 < nx1
        || y1 > ny2
        || y2 < ny1;
  };
}

//#################
//##### AUDIO #####
//#################

generateAudioElements()

// already played audio elements
var played = []

// last audio element that started playing and is still playing
var playing = ""

// Id of a timeout function that was most recently created.
// Used for crossfades at the end of songs.
var timeout = ""

function generateAudioElements() {
	for (var id in songs.songs) {
		var id = id.slice(1),
	  		track = new Audio(),
				audioElement = document.createElement("source");
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
	// update state
	var id = audioEl.id.slice(5)
	played.push(id)
	playing = audioEl
	
	// fade in
	fadeIn(audioEl, FADEIN_DURATION)

	// set timeout to start next song at the beginning of fadeout if autoplay is on
	cueNextSong(audioEl)
}

function skipTo(audioEl) {
	// update state
	clearTimeout(timeout)
	timeout = ""
	exPlaying = playing
	playing = audioEl

	// fade out/in
	fadeOut(exPlaying, crossfadeDuration)
	fadeIn(audioEl, crossfadeDuration) 

	// set timeout to start next song at the beginning of fadeout if autoplay is on
	cueNextSong(audioEl)
}

function stopPlayback(audioEl) {
	// update state
	clearTimeout(timeout)
	timeout = ""
	exPlaying = playing
	playing = ""

	// fade out
	fadeOut(audioEl, FADEOUT_DURATION)
	if (exPlaying != "") { 
		fadeOut(exPlaying, FADEOUT_DURATION)
	}
}

// TODO deny three simultaneous tracks at once >>>

function cueNextSong(audioEl) {
	var timeBeforeFadeout = Math.round( audioEl.duration * 1000 - crossfadeDuration)
	timeout = setTimeout(function(){
		var id = $(audioEl).attr('id').slice(5)
		if (DEBUG) console.log("audioEl.id "+audioEl.id)
		if (AUTOPLAY) {
			fadeOut(audioEl, crossfadeDuration)
			playNextSong(id)
		} else {
			playing = ""
			timeout = ""
		}
	}, timeBeforeFadeout);
}

function playNextSong(id) {
	var audioEl = getNextSong(id)

	// update state
	playing = audioEl
	var id = audioEl.id.slice(5)
	played.push(id)

	// fade in
	fadeIn(audioEl, crossfadeDuration)

	// set timeout to start next song at the beginning of fadeout if autoplay is on
	cueNextSong(audioEl)
}

// <<< TODO deny three simultaneous tracks at once

function fadeIn(audioEl, duration) {
	if (CROSSFADE_VOLUME) {
		$(audioEl).stop(true, false)
		$(audioEl).prop('volume', 0.0)
		$(audioEl).animate({volume: 1.0}, duration);
	}
	audioEl.play()
	enlargeNode(audioEl, duration)
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
	shrinkNode(audioEl, duration)
}

// #### SONG SELECTION ####

function getNextSong(id) {
	var g = d3.select('#name' + id)
	if (shuffle) {
		var nextSong = getRandomNode()
	} else {
		var nextSong = findClosestNode(g)
	}
	return getAudioEl(nextSong)
}

function findClosestNode(nodeIn) {
	var closestNode = null
	var smallestDistance = 99999

	data.forEach(function(d) {
		var nodeInId = nodeIn.attr("id").slice(4)
		var distance = d.distances[nodeInId]
		var nodeIsNotTheSameOne = nodeInId != d.id
		var nodeIsClosestOneYet = distance < smallestDistance
		var songHasntBeenPlayedYet = !contains(played, d.id)
		if (nodeIsNotTheSameOne && nodeIsClosestOneYet && songHasntBeenPlayedYet) {
			closestNode = d
			smallestDistance = distance
		}
	})
	return closestNode
}

function getRandomNode() {
	var allSongsAlreadyPlayed = data.length == played.length
	if (allSongsAlreadyPlayed) {
		return null
	}
	do {
		var node = data[Math.floor(Math.random()*data.length)];
		var songWasAlreadyPlayed = contains(played, node.id)
	}
	while (songWasAlreadyPlayed);
	return node
}

//##########################
//##### SHUFFLE BUTTON ##### 
//##########################

$("#shuffleButton").click(function() {
	toggleShuffle()
	changeButtonColor(this)
	changeButtonText(this)
});

function toggleShuffle() {
	shuffle = !shuffle
}

function changeButtonColor(button) {
  if ($(button).hasClass('btn btn-primary')) {
		$(button).removeClass('btn btn-primary');
    $(button).addClass('btn btn-active');
	} else {
		$(button).removeClass('btn btn-active');
    $(button).addClass('btn btn-primary');
	}
}

function changeButtonText(button) {
	if (shuffle) {
		button.textContent = "Shuffle: On"
	} else {
		button.textContent = "Shuffle: Off"
	}
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
	var audioFileId = nodesData.id
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
