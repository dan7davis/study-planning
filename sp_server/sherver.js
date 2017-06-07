// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var options = {
  key: fs.readFileSync('/home/ubuntu/privkey.pem'),
  cert: fs.readFileSync('/home/ubuntu/fullchain.pem'),
  ca: fs.readFileSync('/home/ubuntu/chain.pem')
}
var querystring = require('querystring');

var mongoose   = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/le_db_name'); // connect to our database
var Event     = require('./app/models/event');

// configure body parser, get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port     = process.env.PORT || 8080; // set our port

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, X-CSRFToken, chap, seq, vert");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
  next();
});


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});



// on routes that end in /events
// ----------------------------------------------------
router.route('/events')

	// create an event (accessed at POST https://server:port/api/events)
	.post(function(req, res) {
		
		var event = new Event();		// create a new instance of the event model
		event.week 				= req.body.week;  // set the events week (comes from the request)
		event.id 				= req.body.id;
		event.course 			= req.body.course;
		event.time 				= req.body.time;
		event.index 			= req.body.index;
		event.vert 				= req.body.vert;
		event.edited 			= req.body.edited;
		event.vidID 			= req.body.vidID;
		event.vidDuration 		= req.body.vidDuration;
		event.watched 			= req.body.watched;
		event.submits 			= req.body.submits;
		event.uniqueSubmits 	= req.body.uniqueSubmits;
		event.timeSite 			= req.body.timeSite;
		event.qualPlan 			= req.body.qualPlan;
		event.quantGoals		= req.body.quantGoals;

		// SUM OF ALL QUANT VARIABLES GROUPED BY LEARNER COURSE WEEK
		Event.aggregate(
			   [
			     {
			       $group:
			         {
			           _id: { id: req.body.id, course: req.body.course, week: req.body.week },
			           totalSubmits: { $sum: "$uniqueSubmits" },
			           totalVidDuration: { $sum: "$vidDuration" },
			           totalVidWatched: { $sum: "$watched" },
			           totalTimeSite: { $sum: "$timeSite" },
			           totalEvents: { $sum: 1 },
			           lastQualGoalSet: { $last: req.body.qualPlan },
			           lastVidGoalSet: { $last: req.body.vidGoal},
			           lastQuizGoalSet: { $last: req.body.quizGoal },
			           edited: { $sum: "edited" },
			           lastTimeGoalSet: { $last: req.body.timeGoal }
			         }
			     }
			   ], function(err,result) {
			   		console.log(result);
			   		res.json(result);
			    }
			);


		event.save(function(err) {
			if (err)
				return res.send(err);

			res.json({ message: 'event created!' });
		});

		
	})

	// get all the events (accessed at GET http://localhost:8080/api/events)
	.get(function(req, res) {
		Event.find({}, function(err, events) {
			if (err)
				return res.send(err);

			res.json(events);
		});
	});

// on routes that end in /events/:event_id
// ----------------------------------------------------
router.route('/events/:event_id')

	// get the event with that id
	.get(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {
			if (err)
				res.send(err);
			res.json(event);
		});
	})

    // delete the event with this id (accessed at DELETE https://server:port/api/events/:event_id)
	.delete(function(req, res) {
		Event.remove({
			_id: req.params.event_id
		}, function(err, event) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
https.createServer(options, app).listen(port);
console.log('Node server start on port: ' + port);

