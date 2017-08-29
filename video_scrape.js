//	      Getting the number of Videos 			//
url = "https://insights.edx.org/courses/course-v1:DelftX+EnergyX+3T2017/engagement/videos/";


// Begin Snippet B
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
setTimeout(scrape(), 3000);


function scrape(){
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
    copy(vidMap);
}

// End Snbippet B