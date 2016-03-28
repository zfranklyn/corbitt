// Users Module
var User = require('./schemas/user.js')
var tools = require('./tools.js').tools;
	
var db = function(){};

// ADD USER
// This interacts with MongoDB to add a new user
db.prototype.addUser = function(tel){


  console.log("adding new user, ID: " + tel)
  

  var user = new User({  		number: Number(tel),
								date: tools.date(),
								sent: 0,
								completed: 0,
								reminder1: 0,
								reminder2: 0,
								reminder3: 0,
								reminder4: 0,
								messages: [],
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

// EDIT USER
// CAN EDIT: id, tel, and reminders for a specific date
db.prototype.editUser = function(parameter, newParam, date){
  // if (parameter == "id"){

  // } else if (parameter == "tel"){

  // } else if (parameter == "r1"){

  // } else if (parameter == "r2"){

  // } else if (parameter == "r3"){

  // } else if (parameter == "r4"){

  // } else {
  //  res.send({  success: 0
  //      })
  // }

  // res.send({ success:1,
  //      parameter:parameter,
  //      new: newParam
  //    })  
  console.log("edit user")

}

// FIND USER in database, retrieve all information
db.prototype.findUser = function(id){
	var num = Number(id);
	console.log("Searching for user: " + num);
	// console.log("searching for ID: " + num);
	return User.findOne({'number': num});

}

// Check if this user finished
db.prototype.checkComplete = function(id){

}

// Send survey, or else remind
db.prototype.sendSurvey = function(text, surveyLink, id){
	tools.sendMessage(id, text + surveyLink + "&tel=" + id);
}

db.prototype.allUsers = function(){
	return User.find()
				.exec()
}

module.exports = new db;