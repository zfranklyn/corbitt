var express = require('express');
var router = express.Router();

var tools = require('../tools.js').tools

/* GET home page. */
router.get('/', function(req, res, next) {
	date = tools.date();

	var num_users = 100;
	var num_completed = 90;
	var num_remind_1 = 3;
	var num_remind_2 = 2;
	var num_remind_3 = 4;
	var num_remind_4 = 1;

	res.render('index', { 	date: date,
							users: [
					                    {   "id" : "Franklyn",
					                        "number" : "6509467649",
					                        "history" : [{  "day_1":    [{     "sent":0,
					                                                        "completed":0
					                                                    }]
					                                    }]
					                    },
					                    {   "id" : "Franklyn 2",
					                        "number" : "6509467649",
					                        "history" : [{  "day_1":    [{     "sent":0,
					                                                        "completed":0
					                                                    }]
					                                    }]
					                    },
					                    {   "id" : "Franklyn 3",
					                        "number" : "6509467649",
					                        "history" : [{  "day_1":    [{     "sent":0,
					                                                        "completed":0
					                                                    }]
					                                    }]
					                    },
					                    ],

							num_users: num_users,
							num_completed: num_completed,
							num_remind_1: num_remind_1,
							num_remind_2: num_remind_2,
							num_remind_3: num_remind_3,
							num_remind_4: num_remind_4

						});

});

router.post('/', function(req, res, next) {
	console.log("posted");
  res.send('respond with a resource');
});

module.exports = router;
