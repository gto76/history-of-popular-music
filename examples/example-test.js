example();

function example() {

var tasks = [

{"startDate":new Date(1922, 0, 0),"endDate":new Date(1956, 0, 0),"taskName":"RnR","status":"RUNNING", "songs": [{"song":"Robert_Karpinski-Dla_O", "r": 20}] },
{"startDate":new Date(1956, 0, 0),"endDate":new Date(1966, 0, 0),"taskName":"RnR","status":"KILLED", "songs": [{"song":"502", "r": 20}] },
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"RnR","status":"FAILED"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"RnR","status":"SUCCEEDED"},

{"startDate":new Date(1958, 0, 0),"endDate":new Date(1966, 0, 0),"taskName":"Rock","status":"RUNNING"},
{"startDate":new Date(1966, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"Rock","status":"KILLED"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"Rock","status":"FAILED"},
{"startDate":new Date(1986, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"Rock","status":"SUCCEEDED"},

{"startDate":new Date(1968, 0, 0),"endDate":new Date(1976, 0, 0),"taskName":"Punk","status":"RUNNING"},
{"startDate":new Date(1976, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"Punk","status":"KILLED"},
{"startDate":new Date(1986, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"Punk","status":"FAILED"},
{"startDate":new Date(1996, 0, 0),"endDate":new Date(2006, 0, 0),"taskName":"Punk","status":"SUCCEEDED"},

{"startDate":new Date(1948, 0, 0),"endDate":new Date(1986, 0, 0),"taskName":"Hip-Hop","status":"RUNNING"},
{"startDate":new Date(1986, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"Hip-Hop","status":"KILLED"},
{"startDate":new Date(1996, 0, 0),"endDate":new Date(2006, 0, 0),"taskName":"Hip-Hop","status":"FAILED"},
{"startDate":new Date(2006, 0, 0),"endDate":new Date(2016, 0, 0),"taskName":"Hip-Hop","status":"SUCCEEDED"},

{"startDate":new Date(1988, 0, 0),"endDate":new Date(1996, 0, 0),"taskName":"EDM","status":"RUNNING"},
{"startDate":new Date(1996, 0, 0),"endDate":new Date(2006, 0, 0),"taskName":"EDM","status":"KILLED"},
{"startDate":new Date(2006, 0, 0),"endDate":new Date(2016, 0, 0),"taskName":"EDM","status":"FAILED"},
{"startDate":new Date(2016, 0, 0),"endDate":new Date(2026, 0, 0),"taskName":"EDM","status":"SUCCEEDED"},

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

};

