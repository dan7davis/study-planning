



//STEP-BY-STEP GUIDE TO POPULATE COURSE DESIGN FIELDS
//
// Step 1: open a new blank file in a text editor
// Step 2: Log in to your course progress page
// Step 3: enter snippet A in the console
// Step 4: paste into the text editor
// Step 5: go to the edX insights videos page
// Step 6: enter snippet B 
// Step 7: paste this text below the existing text in the text editor
//            add "var quiz-des =" before the first object 
//            add "var vid-des =" before the second object
// Step 8: save this text file as "course_design.JSON" 
// Step 9: upload this file to your edX course in studio (content > files & uploads)





////// Getting the number of Quiz Questions ////////

//  		Output # Questions to Object		//

// Begin Snippet A

var chaps = [];
$( ".chapters section" ).each( function( index, element ){
    chaps.push($( this ).find( "dd" ).length);
});
var quMap = chaps.reduce(function(acc, cur, i) {
  acc[i] = cur;
  return acc;
}, {});
quMap["type"] = "quizzes";
copy(quMap);

// End Snippet A

//////////////////// Misc Quiz //////////////////////////////

$("section[aria-labelledby='chapter_1']").length; // counts unique
var cl = $('.chapters > section').length; // counts number of chapters to parse
$('dd', '.chapters') // total number of questions
$('dd', "section[aria-labelledby='chapter_1']").length; // # questions chap 1

//	      Getting the number of Videos 			//
url = "https://insights.edx.org/courses/course-v1:DelftX+TP101x+1T2017/engagement/videos/";


// Begin Snippet B

$('tbody').children().removeClass().addClass("video_row");

$( "*" ).each(function( index ) {
   $( this ).append(' ');
});
var str = $('#content-area').text();
str = str.replace(/\s\s+/g, ' ');
$('#new').text(str);
var vidz = $('table tr td:nth-child(3)').text().split(" ");
var vidMap = {};
vidMap = vidz.reduce(function(acc, cur, i) {
  acc[i] = cur;
  return acc;
}, {});
vidMap["type"] = "videos";
copy(vidMap);

// End Snbippet B


/////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//                  Output to JSON                 //
/////////////////////////////////////////////////////








/////////////////////////////////////////////////////
