var express = require('express');
var router = express.Router();
var db = require('../db.js');
var misc = require('../misc.js').misc;

/* GET home page. */
router.get('/', function(req, res, next) {
	date = misc.date();
	db.allUsers().then(function(users){
	console.log("user data retrieved from server.");
	console.log(users);
	var num_users = users.length;
	var num_completed = 0, 
		num_remind_1 = 0, 
		num_remind_2 = 0, 
		num_remind_3 = 0, 
		num_remind_4 = 0;
	var user_list;

	for (var n; n < num_users; n++){
		if (users[n].completed == true){
			num_completed =+ 1;
		}

		if (users[n].reminder1 == true){
			num_remind_1 =+ 1;
		}

		if (users[n].reminder2 == true){
			num_remind_2 =+ 1;
		}

		if (users[n].reminder3 == true){
			num_remind_3 =+ 1;
		}

		if (users[n].reminder4 == true){
			num_remind_4 =+ 1;
		}
	}

	console.log(num_remind_1);


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

	})




router.post('/', function(req, res, next) {
	console.log("posted");
  res.send('respond with a resource');
});

module.exports = router;
