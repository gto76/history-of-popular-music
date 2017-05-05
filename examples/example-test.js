example();

function example() {
  var tasks = [
    {"startDate":new Date(1922, 0, 0), "endDate":new Date(1956, 0, 0),
     "taskName":"RnR", "status":"RUNNING",
     "songs": [{"title":"the_fives", "date": new Date(1922, 0, 0)},
               {"title":"caldonia", "date": new Date(1946, 0, 0)}]},
    {"startDate":new Date(1956, 0, 0), "endDate":new Date(1966, 0, 0),
     "taskName":"RnR", "status":"KILLED",
     "songs": [{"title":"rock_around_the_clock", "date": new Date(1956, 0, 0)}]},
    {"startDate":new Date(1966, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"RnR", "status":"FAILED"},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"RnR", "status":"SUCCEEDED"},

    {"startDate":new Date(1958, 0, 0), "endDate":new Date(1966, 0, 0), 
     "taskName":"Rock", "status":"RUNNING",
     "songs": [{"title":"rumble", "date": new Date(1958, 0, 0)}]},
    {"startDate":new Date(1966, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"Rock", "status":"KILLED",
     "songs": [{"title":"satisfaction", "date": new Date(1966, 0, 0)}]},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Rock", "status":"FAILED"},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Rock", "status":"SUCCEEDED"},

    {"startDate":new Date(1968, 0, 0), "endDate":new Date(1976, 0, 0), 
     "taskName":"Punk", "status":"RUNNING",
     "songs": [{"title":"your_dog", "date": new Date(1968, 0, 0)}]},
    {"startDate":new Date(1976, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Punk", "status":"KILLED",
     "songs": [{"title":"god_save_the_queen", "date": new Date(1976, 0, 0)}]},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Punk", "status":"FAILED"},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"Punk", "status":"SUCCEEDED"},

    {"startDate":new Date(1948, 0, 0), "endDate":new Date(1986, 0, 0), 
     "taskName":"Hip-Hop", "status":"RUNNING",
     "songs": [{"title":"mardi_gras_in_new_orleans", "date": new Date(1948, 0, 0)},
               {"title":"rappers_delight", "date": new Date(1978, 0, 0)}]},
    {"startDate":new Date(1986, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"Hip-Hop", "status":"KILLED",
     "songs": [{"title":"walk_this_way", "date": new Date(1986, 0, 0)}]},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"Hip-Hop", "status":"FAILED"},
    {"startDate":new Date(2006, 0, 0), "endDate":new Date(2016, 0, 0), 
     "taskName":"Hip-Hop", "status":"SUCCEEDED"},

    {"startDate":new Date(1988, 0, 0), "endDate":new Date(1996, 0, 0), 
     "taskName":"EDM", "status":"RUNNING",
     "songs": [{"title":"groove_is_in_the_heart", "date": new Date(1988, 0, 0)}]},
    {"startDate":new Date(1996, 0, 0), "endDate":new Date(2006, 0, 0), 
     "taskName":"EDM", "status":"KILLED",
     "songs": [{"title":"firestarter", "date": new Date(1996, 0, 0)}]},
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
