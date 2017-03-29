// const delinquent = [199,1119,2023,1309,3044386,6899,9352739,7148,4855446,7707,5445,7616,8743,9810,6438,7373,2725967,196];
// const delinquent = [38947];

'use strict'
const email = require('./email.js');
const User = require('./schemas/userSchema.js');
const db = require('./db.js')
const twilio = require('./twilio.js');
// const misc = require('./misc.js');

//DATABASE
var mongoose = require('mongoose');
var config = require('config');

// connects to MLab database
mongoose.connect(config.get("productionDB"));

// productionDB

var connection = mongoose.connection;

console.log("starting up");

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function(){
    console.log("Connected to database")

    User.find()
    .then((allUsers, err) => {

    	allUsers.map(user=>{
            console.log(user.id);
    		if (delinquent.includes(user.id)){
                console.log(`Sending message to user missing T2: ${user.id}`);
                twilio.sendMessage(user.number, `Hi Team, here's just a quick 3-min followup from the survey two weeks ago. Sorry for the inconvenience, and thanks for your time =)`);
                twilio.sendMessage(user.number, `https://yalesurvey.qualtrics.com/jfe/form/SV_5bbbHzlh6wYDUgZ?id=${user.id}`);    			
    		}
    	})

    });



});




