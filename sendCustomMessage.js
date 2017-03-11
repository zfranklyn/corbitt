// const completed = [3069502,9180,6179,2240,144,1952,7616,9584,6083159,2597843,6884,6432,4855446,7148,5227,5387,8630,2725967,8768,2780,2635,1216474,5356,9363,7052,199,2027,3835,8635,3512004,4035,624,4307625,196,2811,5601,7707,6438,6382,2071,8743,73754,9466,1516,8362];

const delinquent = [8768, 4307625, 4173, 5356, 9180, 5387, 854602, 9584, 2635, 5996, 3835, 6239, 3069502, 5601, 8635, 612, 2597843, 6083159, 7690];

'use strict'
const email = require('./email.js');
const User = require('./schemas/userSchema.js');
const db = require('./db.js')
const twilio = require('./twilio.js');

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

    	allUsers.map(user=>{
    		if (!delinquent.includes(user.id)){
    			console.log(`Sending message to: ${user.id}`);
    			twilio.sendMessage(user.number, `Hi Team - yesterday's survey can be found here: https://yalesurvey.qualtrics.com/jfe/form/SV_29bqfzWNJ74FQsl?id=${user.id}`);
    		}
    	})

    });



});




