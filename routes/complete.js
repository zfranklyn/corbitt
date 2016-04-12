var express = require('express');
var router = express.Router();
var db = require('../dbinteraction.js')

var tools = require('../tools.js').tools

/* GET home page. */
router.get('/', function(req, res, next) {
	var date = tools.date();
	var userID = Number(req.query.number);
	var surveyType = req.query.survey;

	db.findUser(userID).then(function(user){
		var userTel = user.number;

	db.findUser(userID).then(function(user){

		if (user.completed == false){
			console.log("user " + userID + " just completed a survey on " + date);
			tools.sendMessage(userTel, "Thank you for completing today's survey! Let us know if you have any questions.");
			user.completed = true;
			user.save(function(error){

				if (!error){
					console.log("User " + userID + " has completed survey; records have been updated");
				} else{
					console.log("User " + userID + "has completed survey, but records have FAILED to be updated");
					
				}

			})
		} else {
			// console.log("user " + userTel + " has already completed this survey.")
		}

		
	});

	});

});




module.exports = router;
