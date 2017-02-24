'use strict'
const email = require('./email.js');
const User = require('./schemas/userSchema.js');
const db = require('./db.js')

//DATABASE
var mongoose = require('mongoose');
var config = require('config');

// connects to MLab database
mongoose.connect(config.get("productionDB"));

// productionDB

var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(){
    console.log("Connected to database")

    User.find()
    .then((allUsers, err) => {

    	if (err) {
    		return console.log(err);
    	}

    	for (let userNum = 0; userNum < allUsers.length; userNum++) {

    		let user = allUsers[userNum];
    		setTimeout(()=>{console.log(`pausing for user ${user.id}`)
				console.log(`sending to user ${user.id}`)

	    		const message = "Dear Corbett Prep Team,\n\n" +
					"We hope that the semester is going well! Last semester we sent everyone a comprehensive survey — " +
					"we'd just like to follow that up this semester with one more full length survey. \n\n" +
					"Your full input in this survey will be extremely valuable, and will allow us to directly evaluate the impact of the new curriculum. However, we do apologize in advance for the length of this survey (~20 minutes)!\n\n" +
					"We'd highly recommend taking this survey on your computer. Your uniquely generated anonymous link can be found here:\n" +
					`https://yalesurvey.qualtrics.com/SE/?SID=SV_6Yvu5cup7EGUscd&id=${user.id} \n\n` +
					"Thanks again for your time and input! As always, your input is completely anonymous. Feel free to send us any comments or questions!" +
					"\n\n" +
					
					"\n\n" +
					"Sincerely,\n" +
					"The YCEI Team";

			    email.sendEmail("yceilab@gmail.com", 
			    				user.email,
			    				"YCEI: Spring Semester Survey",
			    				message,
			    				() => {
			    					// user.sent = true;
			    					// user.save();
			    					user.history.push({
			    						"date": "22/2/2017",
			    						"completed": false,
			    						"surveyType": "semester_t2",
			    					})

			    					user.save();

			    				})

    		}, userNum*2500);
    		

		    
    	}

    });



});




