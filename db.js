//Functions for main database interaction
var db = function (){};

// Users Module
var User = require('./schemas/userSchema.js');
var misc = require('./misc.js').misc;

// ADD USER
// This interacts with MongoDB to add a new user
// parameters: telephone, email, and randomly generated ID
db.prototype.addNewUser = function (tel, email, id, sent) {

    console.log("ADDING NEW USER:\n");
    console.log("\tTELEPHONE: " + tel + "\n");
    console.log("\tRANDOM ID: " + id + "\n\n");

    var user = new User({
        id: id,
        number: Number(tel),
        email: email,
        date: misc.date(), //created on today's date
        sent: sent,
        completed: 0,
        reminderNumber: 0,
        history: [],
        totalReminders: 0
    });

    user.save(function (err, user) {
        if (!err) {
            console.log("USER " + id + " has been saved into the database");
        } else {
            console.log(err);
            console.log("ERROR: USER " + id + " has not been saved into the database");
        }
    });

}

// REMOVE USER based on telephone number
db.prototype.removeUserBasedOnTel = function (tel) {
    console.log("REMOVING USER (" + tel + ")\n");
    User.remove({'number': tel}, function (err) {
        if (!err) {
            console.log("SUCCESSFUL REMOVAL: USER (" + tel + ") removed");
        } else {
            console.log("UNSUCCESSFUL REMOVAL: USER (" + tel + ") has not been removed");
        }
    })
}

// RETURN USER in database based on ID
// returns the user object
db.prototype.returnUserBasedOnID = function (id) {
    console.log("Searching for user based on ID: " + id + "\n");
    return User.findOne({'id': id});
}

// RETURN USER in database based on telephone
db.prototype.returnUserBasedOnTel = function (tel) {
    var num = Number(tel);
    console.log("Searching for user based on telephone: " + num + "\n");
    return User.findOne({'number': num});
}

// RETURN ALL USERS
db.prototype.allUsers = function() {
    return User.find();
}

//reset records for a new day! should be called at the last possible minute before the next survey day
db.prototype.resetAllRecordsFromToday = function () {
    User.find().exec().then(function (users) {
        users.forEach(function (element, index, array) {
            console.log("Resetting all records from today");

            // historic record
            element.history.push({
                "complete": element.completed,
                "date": element.date,
                "time": element.completionTime,
                "numberOfReminders": element.numberOfReminders
            })

            console.log("HISTORY: " + element.history);

            //reset data from yesterday
            element.numberOfRemindersToday = 0;
            element.sent = false;
            element.completed = false;
            element.completionTime = "";
            element.date = misc.date(); // new day today

            element.save();

        })
    })
}

module.exports = new db;