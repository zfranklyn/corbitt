'use strict'
const email = require('./email.js');
const User = require('./schemas/userSchema.js');
const db = require('./db.js')

//DATABASE
var mongoose = require('mongoose');
var config = require('config');

const delinquent = [5418,6899,6745,2541,2006,3379,5445,1309,4492,9810,2023,6239,8554246,854602,5282595,418107,9352739,2534335,7690,4173,5996,7373,6990,9808,1119,612,5572078,6680672,7497683,750725,3044386,38947,2473184,9208436];

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

    		if (delinquent.includes(user.id)){
				setTimeout(()=>{console.log(`pausing for user ${user.id}`)
					console.log(`sending to user ${user.id}`)

		    		const message = "Dear Corbett Prep Team,\n\n" +
						"Just a gentle reminder to complete the Spring Semester Survey!" +
						" We'd highly recommend taking this survey on your computer. Your uniquely generated anonymous link can be found here:\n" +
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
				    					// user.history.push({
				    					// 	"date": "22/2/2017",
				    					// 	"completed": false,
				    					// 	"surveyType": "semester_t2",
				    					// })

				    					// user.save();

				    				})

	    		}, userNum*2500);    			
    		}

    		
    		

		    
    	}

    });



});




