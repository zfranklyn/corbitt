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

    // User.find()
    // .then((allUsers, err) => {

    // 	if (err) {
    // 		return console.log(err);
    // 	}

    // 	for (let userNum = 0; userNum < allUsers.length; userNum++) {

    // 		let user = allUsers[userNum];
    		
    // 			user.sent = true;
    // 			user.completed = true;
    // 			user.save();
    // 			console.log(`Saving for User ${user.id}`);
		    
    // 	}

    // });



});




