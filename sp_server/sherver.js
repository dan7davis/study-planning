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
var pLog 	  = require('./app/models/event');
var zLog 	  = require('./app/models/event')

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
			           edited: { $sum: "$edited" },
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

router.route('/events/pLog')

	// create an event (accessed at POST https://server:port/api/events)
	.post(function(req, res) {
		console.log(req.body);
		var event = new pLog();		// create a new instance of the event model
		event.week 				= req.body.week;  // set the events week (comes from the request)
		event.id 				= req.body.id;
		event.course 			= req.body.course;
		event.time 				= req.body.time;
		event.index 			= req.body.index;
		event.vert 				= req.body.vert;
		event.edited 			= req.body.edited;
		event.qualPlan 			= req.body.qualPlan;
		

		// SUM OF ALL QUANT VARIABLES GROUPED BY LEARNER COURSE WEEK
		pLog.aggregate(
			   [
			     {
			       $group:
			         {
			           _id: { id: req.body.id, course: req.body.course, week: req.body.week },
			           lastQualGoalSet: { $last: req.body.qualPlan }
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

			res.json({ message: 'pLog event created!' });
		});

		
	})

	// get all the events (accessed at GET http://localhost:8080/api/events)
	.get(function(req, res) {
		console.log("QUERY: " + req.query);
		pLog
		  // our criteria to filter with
		  .find({ 
		    id: req.query.id,
		    course: req.query.course,
		    week: req.query.week,
		    lastQualGoalSet: req.query.qualPlan 
		  })
		  // -1 will sort descending (newest to oldest) by lastQualGoalSet
		  .sort({lastQualGoalSet: -1})
		  // only get the first one for efficiency
		  .limit(1)
		  .exec(function(results, err){
		    // if there is a results array, it will just have one element
		    var whatIWant = results[0];
		  });
	});


	router.route('/events/zLog')

	// create an event (accessed at POST https://server:port/api/events)
	.post(function(req, res) {
		
		var event = new zLog();		// create a new instance of the event model
		event.week 				= req.body.week;  // set the events week (comes from the request)
		event.id 				= req.body.id;
		event.course 			= req.body.course;
		event.time 				= req.body.time;
		event.vert 				= req.body.vert;		
		event.index 			= req.body.index;
		event.vidGoal 			= req.body.vidGoal;
		event.edited 			= req.body.edited;
		event.quizGoal 			= req.body.quizGoal;
		event.timeGoal 			= req.body.timeGoal;

		// SUM OF ALL QUANT VARIABLES GROUPED BY LEARNER COURSE WEEK
		zLog.aggregate(
			   [
			     {
			       $group:
			         {
			           _id: { id: req.body.id, course: req.body.course, week: req.body.week },
			           lastVidGoalSet: { $last: req.body.vidGoal},
			           lastQuizGoalSet: { $last: req.body.quizGoal },
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

			res.json({ message: 'zLog event created!' });
		});

		
	})

	// get all the events (accessed at GET http://localhost:8080/api/events)
	.get(function(req, res) {
		zLog.find({}, function(err, events) {
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

