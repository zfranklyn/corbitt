//Reminding actions

var User = require('./schemas/user.js')
var tools = require('./tools.js').tools;
var db = require('./dbinteraction')
var messages = require('./messages.js')
	
var sched = function(){};

//Send survey to all users who have not yet received a survey
sched.prototype.sendAll = function(){
	User.find().exec().then(function(users){

	users.forEach(function(element, index, array){
		if (element.sent == false){
			console.log("sending survey to: "+ element.number);
			db.sendSurvey(messages.send, messages.surveyLink, element.number, element.id);
			element.date = tools.date();
			element.sent = true;
			element.save(function(err){
				if (err) { console.log("failed to update")} else {
					console.log("updated");
				}
			})
		}
		
	})
	})
}

//Remind all users who have received, but not yet completed the survey
sched.prototype.remindAll = function(element){
	User.find().exec().then(function(users){

		users.forEach(function(element, index, array){
			if (element.sent == true && element.completed == false){
				console.log("user "+ element.number + " has not completed the survey");

				if (element.reminder1 == 0){
					db.sendSurvey(messages.reminder1, messages.surveyLink, element.number, element.id)
					element.reminder1 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder2 == 0){
					db.sendSurvey(messages.reminder2, messages.surveyLink, element.number, element.id)
					element.reminder2 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder3 == 0){
					db.sendSurvey(messages.reminder3, messages.surveyLink, element.number, element.id)
					element.reminder3 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder4 == 0){
					db.sendSurvey(messages.reminder4, messages.surveyLink, element.number, element.id)
					element.reminder4 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else {
					// even after 4 reminders, this person has not completed; his/her number is sent to the admin number
					tools.sendMessage(messages.adminNumber, "WARNING (" + tools.date() + ")" + ": Incomplete after 4 reminders: " + element.number + "ID: " + element.id);
				}

			}
			
		})
	})

}

sched.prototype.resetAll = function(){
	User.find().exec().then(function(users){
		users.forEach(function(element, index, array){
			console.log("resetting");

			if (element.completed == false){
				element.history.push({
											"incomplete": true,
											"date": tools.date(),
											"reminders": element.reminder1 + element.reminder2 + element.reminder3 + element.reminder4
											})
			}

			console.log("HISTORY: " + element.history);

			//reset
			element.reminder1 = 0;
			element.reminder2 = 0;
			element.reminder3 = 0;
			element.reminder4 = 0;
			element.sent = false;
			element.completed = false;
			element.date = tools.date();


			element.save();
			
		})
	})
}



// sched.prototype. = function(){
// 	return User.find()
// 				.exec()
// }

module.exports = new sched;