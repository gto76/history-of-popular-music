example();

function example() {

var tasks = [

{"startDate":new Date(1951, 3, 0),"endDate":new Date(1956, 6, 12),"taskName":"RnB","status":"RUNNING"},
{"startDate":new Date(1956, 6, 12),"endDate":new Date(1966, 0, 0),"taskName":"RnB","status":"SUCCEEDED"},
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"RnB","status":"FAILED"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"RnB","status":"KILLED"},

{"startDate":new Date(1951, 3, 0),"endDate":new Date(1956, 6, 12),"taskName":"RnR","status":"RUNNING"},
{"startDate":new Date(1956, 6, 12),"endDate":new Date(1966, 0, 0),"taskName":"RnR","status":"SUCCEEDED"},
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 1, 0),"taskName":"RnR","status":"FAILED"},
{"startDate":new Date(1976, 1, 0),"endDate":new Date(1986, 0, 0),"taskName":"RnR","status":"KILLED"},

{"startDate":new Date(1958, 3, 0),"endDate":new Date(1965, 5, 5),"taskName":"Rock","status":"RUNNING"},
{"startDate":new Date(1965, 5, 5),"endDate":new Date(1976, 1, 0),"taskName":"Rock","status":"SUCCEEDED"},
{"startDate":new Date(1976, 1, 0),"endDate":new Date(1986, 0, 0),"taskName":"Rock","status":"FAILED"},
{"startDate":new Date(1986, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"Rock","status":"KILLED"},

{"startDate":new Date(1969, 6, 0),"endDate":new Date(1976, 1, 0),"taskName":"Punk","status":"RUNNING"},
{"startDate":new Date(1976, 1, 0),"endDate":new Date(1986, 0, 0),"taskName":"Punk","status":"SUCCEEDED"},
{"startDate":new Date(1986, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"Punk","status":"FAILED"},
{"startDate":new Date(1996, 0, 0),"endDate":new Date(2006, 0, 0),"taskName":"Punk","status":"KILLED"},

{"startDate":new Date(1979, 8, 15),"endDate":new Date(1986, 6, 3),"taskName":"Hip-Hop","status":"RUNNING"},
{"startDate":new Date(1986, 6, 3),"endDate":new Date(1966, 0, 0),"taskName":"Hip-Hop","status":"SUCCEEDED"},
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"Hip-Hop","status":"FAILED"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"Hip-Hop","status":"KILLED"},

{"startDate":new Date(1951, 3, 0),"endDate":new Date(1956, 6, 12),"taskName":"EDM","status":"RUNNING"},
{"startDate":new Date(1956, 6, 12),"endDate":new Date(1966, 0, 0),"taskName":"EDM","status":"SUCCEEDED"},
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"EDM","status":"FAILED"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"EDM","status":"KILLED"},

];

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

var taskNames = [ "RnB", "RnR", "Rock", "Punk", "Hip-Hop", "EDM" ];

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

};

