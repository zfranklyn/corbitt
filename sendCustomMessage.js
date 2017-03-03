const completed = [3069502,9180,6179,2240,144,1952,7616,9584,6083159,2597843,6884,6432,4855446,7148,5227,5387,8630,2725967,8768,2780,2635,1216474,5356,9363,7052,199,2027,3835,8635,3512004,4035,624,4307625,196,2811,5601,7707,6438,6382,2071,8743,73754,9466,1516,8362];

const delinquent = [5418,6899,6745,2541,2006,3379,5445,1309,4492,9810,2023,6239,8554246,854602,5282595,418107,9352739,2534335,7690,4173,5996,7373,6990,9808,1119,612,5572078,6680672,7497683,750725,3044386,38947,2473184,9208436];

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
    		if (delinquent.includes(user.id)){
    			twilio.sendMessage(user.number, "Hi Team - just gentle reminder to complete the Semester Survey from last week (resent to your inbox)");
    		}
    	})

    });



});




