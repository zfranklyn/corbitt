//Functions for main database interaction

// Users Module
var User = require('./schemas/user.js')
var tools = require('./tools.js').tools;
	
var db = function(){};

// ADD USER
// This interacts with MongoDB to add a new user
// parameters: telephone, email, and randomly generated ID
db.prototype.addUser = function(tel, email, id){

  console.log("ADDING NEW USER:\n");
  console.log("\tTELEPHONE: " + tel + "\n");
  console.log("\tRANDOM ID: " + id + "\n\n");
  

  var user = new User({  		
                id: id,
                number: Number(tel),
                email: email,
								date: tools.date(), //created on today's date
								sent: 0,
								completed: 0,
								reminder1: 0,
								reminder2: 0,
								reminder3: 0,
								reminder4: 0,
								history: [],
								totalReminders: 0
                   })

  user.save(function(err,user){
    if (!err) {
      console.log("USER " + id + " has been saved into the database");
    } else {
    	console.log(err);
      console.log("ERROR: USER " + id + " has not been saved into the database");
    }
  });

}

// REMOVE USER based on telephone number
db.prototype.removeUser = function(tel){
	console.log("REMOVING USER (" + tel + ")\n");
  User.remove({ 'number': tel}, function(err){
  	if (!err){
  		console.log("SUCCESSFUL REMOVAL: USER (" + tel + ") removed");
  	} else {
  		console.log("UNSUCCESSFUL REMOVAL: USER (" + tel + ") has not been removed");
  	}
  })
}

// FIND USER in database based on ID
// returns the user object
db.prototype.findUser = function(id){
	console.log("Searching for user based on ID: " + id + "\n");
	return User.findOne({'id': id});
}

// FIND USER in database based on telephone
db.prototype.findUserTel = function(tel){
  var num = Number(tel);
  console.log("Searching for user based on telephone: " + num + "\n");
  return User.findOne({'number': num});
}

// Send survey
db.prototype.sendSurvey = function(text, surveyLink, tel, id){
	tools.sendMessage(tel, text + surveyLink + "&tel=" + id);
}

db.prototype.allUsers = function(){
	return User.find();
}

db.prototype.deleteAllUsers = function(){
  User.remove({});
  console.log("all users removed from collection");
}

module.exports = new db;