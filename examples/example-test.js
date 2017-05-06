example();

function example() {
  var tasks = [
    {"startDate":new Date(1922, 0, 0), "endDate":new Date(1956, 0, 0),
     "taskName":"RnR", "status":"RUNNING",
     "songs": [{"title":"the_fives",
                "date": new Date(1922, 0, 0),
                "year": 1922,
                "text": ["Hersal and George Thomas", "The Fives (Sheet music)"]},
               {"title":"caldonia", 
                "date": new Date(1945, 0, 0),
                "year": 1945,
                "text": ["Louis Jordan", "Caldonia"]}
              ]},
    {"startDate":new Date(1956, 0, 0), "endDate":new Date(1966, 0, 0),
     "taskName":"RnR", "status":"KILLED",
     "songs": [{"title":"rock_around_the_clock", 
                "date": new Date(1956, 0, 0),
                "year": 1955,
                "text": ["Bill Haley", "Rock Around the Clock"]}]},
    {"startDate":new Date(1966, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"RnR", "status":"FAILED"},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"RnR", "status":"SUCCEEDED",
     "songs": [{"title":"hang_on_st_christopher", 
                "date": new Date(1986, 0, 0),
                "year": 1987,
                "text": ["Tom Waits", "Hang on St. Christopher"]}]},

    {"startDate":new Date(1958, 0, 0), "endDate":new Date(1966, 0, 0), 
     "taskName":"Rock", "status":"RUNNING",
     "songs": [{"title":"rumble", 
                "date": new Date(1958, 0, 0),
                "year": 1958,
                "text": ["Link Wray", "Rumble"]}]},
    {"startDate":new Date(1966, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"Rock", "status":"KILLED",
     "songs": [{"title":"satisfaction", 
                "date": new Date(1966, 0, 0),
                "year": 1965,
                "text": ["The Rolling Stones", "(I Can't Get No) Satisfaction"]}]},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Rock", "status":"FAILED"},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Rock", "status":"SUCCEEDED",
     "songs": [{"title":"devils_haircut", 
                "date": new Date(1996, 0, 0),
                "year": 1996,
                "text": ["Beck", "Devils Haircut"]}]},

    {"startDate":new Date(1968, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"Punk", "status":"RUNNING",
     "songs": [{"title":"your_dog", 
                "date": new Date(1968, 0, 0),
                "year": 1969,
                "text": ["The Stooges", "I Wanna Be Your Dog"]}]},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Punk", "status":"KILLED",
     "songs": [{"title":"god_save_the_queen", 
                "date": new Date(1976, 0, 0),
                "year": 1977,
                "text": ["Sex Pistols", "God Save the Queen"]}]},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Punk", "status":"FAILED"},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"Punk", "status":"SUCCEEDED",
     "songs": [{"title":"time_to_get_away", 
                "date": new Date(2006, 0, 0),
                "year": 2007,
                "text": ["LCD Soundsystem", "Time to Get Away"]}]},

    {"startDate":new Date(1949, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Hip-Hop", "status":"RUNNING",
     "songs": [{"title":"mardi_gras_in_new_orleans", 
                "date": new Date(1949, 0, 0),
                "year": 1949,
                "text": ["Professor Longhair", "Mardi Gras in New Orleans"]},
               {"title":"rappers_delight", 
                "date": new Date(1978, 0, 0),
                "year": 1979,
                "text": ["The Sugarhill Gang", "Rapper's Delight"]}]},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Hip-Hop", "status":"KILLED",
     "songs": [{"title":"walk_this_way", 
                "date": new Date(1986, 0, 0),
                "year": 1986,
                "text": ["Run-D.M.C", "Walk This Way"]}]},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"Hip-Hop", "status":"FAILED"},
    {"startDate":new Date(2006, 0, 0), "endDate":new Date(2016, 0, 0), 
     "taskName":"Hip-Hop", "status":"SUCCEEDED",
     "songs": [{"title":"hood_politics", 
                "date": new Date(2016, 0, 0),
                "year": 2015,
                "text": ["Kendrick Lamar", "Hood Politics"]}]},

    {"startDate":new Date(1988, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"EDM", "status":"RUNNING",
     "songs": [{"title":"groove_is_in_the_heart", 
                "date": new Date(1988, 0, 0),
                "year": 1990,
                "text": ["Deee-Lite", "Groove Is in the Heart"]}]},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"EDM", "status":"KILLED",
     "songs": [{"title":"firestarter", 
                "date": new Date(1996, 0, 0),
                "year": 1996,
                "text": ["The Prodigy", "Firestarter"]}]},
    {"startDate":new Date(2006, 0, 0), "endDate":new Date(2016, 0, 0), 
     "taskName":"EDM", "status":"FAILED"},
    {"startDate":new Date(2016, 0, 0), "endDate":new Date(2026, 0, 0), 
     "taskName":"EDM", "status":"SUCCEEDED"},
  ];

  var taskStatus = {
    "SUCCEEDED" : "bar-revival",
    "FAILED" : "bar-crisis",
    "RUNNING" : "bar-proto",
    "KILLED" : "bar-golden"
  };

  var taskNames = [ "RnR", "Rock", "Punk", "Hip-Hop", "EDM" ];

  tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
  });
  var maxDate = tasks[tasks.length - 1].endDate;
  tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
  });
  var minDate = tasks[0].startDate;

  var format = "%y";

  var gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format);
  gantt(tasks);
}
