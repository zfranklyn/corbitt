//Reminding actions

var User = require('./schemas/user.js')
var tools = require('./tools.js').tools;
var db = require('./dbinteraction')
var messages = require('./messages.js')

//mailer
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://yceilab%40gmail.com:betheobserver@smtp.gmail.com');
	
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

//Send TRIMESTER survey to peoples' emails and SMS
sched.prototype.sendAllTrimester = function(){
	User.find().exec().then(function(users){
		users.forEach(function(element, index, array){

			//if we have not yet sent it to you...
			if (element.sent == false){
				// setup e-mail data with unicode symbols
				var mailOptions = {
				    from: '"Yale Center for Emotional Intelligence" <yceilab@gmail.com>', // sender address
				    to: element.email, // list of receivers
				    subject: 'YCEI: Corbett Prep Baseline Survey', // Subject line
				    text: messages.trimesterText + messages.surveyLinkTrimester + "&tel=" + element.id + "\n\n The YCEI Contentment Team", // plaintext body
				    html: '' // html body
				};

				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        tools.sendMessage(messages.adminNumber, "FAILED: EMAIL TO USER " + element.id);
				        // tools.sendMessage(messages.adminNumber2, "FAILED: EMAIL TO USER " + element.id);
				        return console.log("EMAIL ERROR", error);

				    } else {
					    console.log('Email sent: ' + info.response);
					    tools.sendMessage(messages.adminNumber, "SUCCESS: EMAIL TO USER " + element.id);
					    // tools.sendMessage(messages.adminNumber2, "SUCCESS: EMAIL TO USER " + element.id);

					    // email sent, now send SMS reminder and save sent state
						console.log("Sending SMS reminder for Trimester Survey");
						tools.sendMessage(element.number, messages.sendTrimester);
						element.date = tools.date();
						element.sent = true;
						element.save(function(err){
							if (err) { 
								console.log("failed to update")
							} else {
								console.log("updated");
							}
						})

				    }



				});


			}
		})
	})
}

sched.prototype.sendSingleTrimester = function(email, tel, id){


	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"Yale Center for Emotional Intelligence" <yceilab@gmail.com>', // sender address
	    to: email, // list of receivers
	    subject: 'YCEI: Corbett Prep Baseline Survey', // Subject line
	    text: messages.trimesterText + messages.surveyLinkTrimester + "&tel=" + id + "\n\n The YCEI Contentment Team", // plaintext body
	    html: '' // html body
	}

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        tools.sendMessage(messages.adminNumber, "FAILED: EMAIL TO USER " + id);
	        return console.log(error);

	    }
	    console.log('Email sent: ' + info.response);
	    tools.sendMessage(messages.adminNumber, "SUCCESS: EMAIL TO USER " + id);
	});

	console.log("Sending SMS reminder for Trimester Survey");
	tools.sendMessage(tel, messages.sendTrimester);


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
					tools.sendMessage(messages.adminNumber2, "WARNING (" + tools.date() + ")" + ": Incomplete after 4 reminders: " + element.number + "ID: " + element.id);
				}

			}
			
		})
	})

}

//send text message reminder to all incomplete trimester survey participants
sched.prototype.remindAllTrimester = function(element){
	User.find().exec().then(function(users){

		users.forEach(function(element, index, array){
			if (element.sent == true && element.completed == false){
				console.log("user "+ element.number + " has not completed the survey");

				if (element.reminder1 == false){
					tools.sendMessage(element.number, messages.reminder1);
					element.reminder1 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder2 == false){
					tools.sendMessage(element.number, messages.reminder2);
					element.reminder2 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder3 == false){
					tools.sendMessage(element.number, messages.reminder3);
					element.reminder3 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else if (element.reminder4 == false){
					tools.sendMessage(element.number, messages.reminder4);
					element.reminder4 = 1;

					element.save(function(err){
						if (err) { console.log("failed to update")} else {
							console.log("updated");
						}})
				} else {
					// even after 4 reminders, this person has not completed; his/her number is sent to the admin number
					tools.sendMessage(messages.adminNumber, "WARNING (" + tools.date() + ")" + ": Incomplete after 4 reminders: " + element.number + "ID: " + element.id);
					tools.sendMessage(messages.adminNumber2, "WARNING (" + tools.date() + ")" + ": Incomplete after 4 reminders: " + element.number + "ID: " + element.id);
				}

			}
			
		})
	})

}

//reset records for a new day!
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

module.exports = new sched;