'use strict'
const email = require('./email.js');
const User = require('./schemas/userSchema.js');
const db = require('./db.js')

//DATABASE
var mongoose = require('mongoose');
var config = require('config');

// connects to MLab database
mongoose.connect(config.get("productionDB"));

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

	    		const message = "Dear Corbett Prep Educators,\n\n" +
					"The YCEI Team would like to thank you for your participation in this semester's study! " +
					"We hope that you've found the content to be useful, and that the survey system was not too much of a hassle! As always, " +
					"feel free to send us any comments or questions at any time! (you can reach Franklyn @ 6509467649) \n\n" +
					"We'd like to invite you to take one last survey to finish up this semester's study. With your full input "+
					"we'll be able to better evaluate and improve the RULER 2.0 program. " +
					"We recommend taking this one on your computer, as it is longer than the check-in survey.\n\n" +
					"You can find your anonymous, personalized link here: " +
					`https://yalesurvey.qualtrics.com/SE/?SID=SV_880bsLT0v4LUmfr&tel=${user.id} \n\n` +
					
					"\n\n" +
					"With warm regards,\n" +
					"The YCEI Team";

			    email.sendEmail("yceilab@gmail.com", 
			    				user.email,
			    				"YCEI: Thank You & Final Closing Survey",
			    				message,
			    				() => {
			    					user.sent = true;
			    					user.save();
			    				})

    		}, userNum*2000);
    		

		    
    	}

    });



});




