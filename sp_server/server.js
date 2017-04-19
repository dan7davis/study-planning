// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost'); // connect to our database
var Event     = require('./app/models/event');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /events
// ----------------------------------------------------
router.route('/events')

	// create a event (accessed at POST http://localhost:8080/events)
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


		event.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'event created!' });
		});

		
	})

	// get all the events (accessed at GET http://localhost:8080/api/events)
	.get(function(req, res) {
		Event.find(function(err, events) {
			if (err)
				res.send(err);

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

	// update the event with this id
	.put(function(req, res) {
		Event.findById(req.params.event_id, function(err, event) {

			if (err)
				res.send(err);

			event.week = req.body.week;
			event.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'event updated!' });
			});

		});
	})

	// delete the event with this id
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
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);