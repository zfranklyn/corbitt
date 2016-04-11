//Functions for main database interaction

// Users Module
var User = require('./schemas/user.js')
var tools = require('./tools.js').tools;
	
var db = function(){};

// ADD USER
// This interacts with MongoDB to add a new user
db.prototype.addUser = function(tel){


  console.log("adding new user, ID: " + tel)
  

  var user = new User({  		
                id: Math.floor(Math.random()*10000),
                number: Number(tel),
								date: tools.date(),
								sent: 0,
								completed: 0,
								reminder1: 0,
								reminder2: 0,
								reminder3: 0,
								reminder4: 0,
								history: [],
								totalReminders: 0
                   })

  console.log("user created");

  user.save(function(err,user){
    if (!err) {
      console.log("saved");
    } else {
    	console.log(err);
      console.log("not saved");
    }
  });

}

// REMOVE USER
db.prototype.removeUser = function(tel){
	console.log("REMOVING:" + tel);
  User.remove({ 'number': tel}, function(err){
  	if (!err){
  		console.log("user removed");
  	} else {
  		console.log("failed to remove")
  	}
  })
}

// FIND USER in database, retrieve all information
db.prototype.findUser = function(tel){
	var num = Number(tel);
	console.log("Searching for user: " + num);
	// console.log("searching for ID: " + num);
	return User.findOne({'number': num});
}

// Send survey
db.prototype.sendSurvey = function(text, surveyLink, tel, id){
	tools.sendMessage(tel, text + surveyLink + "&tel=" + id);
}

db.prototype.allUsers = function(){
	return User.find()
				.exec()
}

module.exports = new db;