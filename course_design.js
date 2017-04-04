var quizDes = {
  "0": 3,
  "1": 38,
  "2": 47,
  "3": 47,
  "4": 40,
  "5": 35,
  "6": 29,
  "7": 27
}

var vidDes = {
  "0": "1",
  "1": "20",
  "2": "23",
  "3": "23",
  "4": "16",
  "5": "19",
  "6": "17",
  "7": "8",
  "8": ""
}



var vidArray = $.map(vidDes, function(value, index) {
    return [value];
});
vidArray = vidArray.map(Number);

var quizArray = $.map(quizDes, function(value, index) {
    return [value];
});
quizArray = quizArray.map(Number);

//weekMap["0"] = [weekMap["0"], vidDes["0"], quizDes["0"]];