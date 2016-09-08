var express = require('express'),
    router = express.Router(),
    misc = require('../misc.js').misc,
    db = require('../db.js'),
    messages = require('../messages.js'),
    study = require('../study.js'),
    timer = require('node-schedule'),
    twilio = require('../twilio.js'),
    sched = require("../scheduling.js");

var User = require('../schemas/userSchema.js');


// When the server receives a text message to ./receive,
// this is the logic that parses it
router.post('/', function(req, res, next) {
    // who is our sender? number
	var sender = Number(req.body.From);
    // what's the body of the message?
    var text = req.body.Body;

    console.log("MESSAGE RECEIVED: " + text);

    // what's the command? should be the first word of the message
    var firstWord = misc.getWord(text,0).toLowerCase();
    console.log(firstWord);
    // depending on command:
    switch (firstWord){
        //USER REGISTRATION
        case "register":
            var email = misc.getWord(text, 1);
            console.log("\n\nREGISTRATION ATTEMPT:")
            console.log("User registering with email address: " + email);
            var randomID = Math.floor(Math.random()*100000);
            var REGISTERED = 0;

            // did the user enter an email?
            if (email){
                db.returnUserBasedOnTel(sender).then(function(doc){
                    if (doc != null){ //user already exists
                        console.log("\nFAILED: user already registered\n\n")
                        twilio.sendMessage(sender, "You have already registered! To delete your existing records, reply with 'admindelete'");
                    } else {
                        console.log("USER DOES NOT YET EXIST");
                        //check email validity
                        if (misc.validateEmail(email) && email != "youremail@example.com" ){
                            //user does not exist
                            console.log("VALIDATION SUCCESS\n\n")
                            console.log("USER CREATED: " + email + ", ID: " + randomID);


                            db.addNewUser(sender, email, randomID, false);

                            twilio.sendMessage(sender, messages.welcome1);
                            twilio.sendMessage(sender, messages.welcome2 + randomID);
                            twilio.sendMessage(messages.adminNumber, "USER REGISTERED. ID: " + randomID);
                        } else {
                            console.log("FAILED: invalid email\n\n");
                            twilio.sendMessage(sender, "To register, please enter a valid email address");
                        }
                    }
                })
            } else {
                twilio.sendMessage(sender, "To sign up, please text 'register youremail@example.com', except using your own email address");
            }
            break;

        // deletes the sender
        case "admindelete":
            db.removeUserBasedOnTel(sender);
            twilio.sendMessage(sender, messages.delete);
            break;

        // sends back the user his/her ID
        case "id":
            db.findUserTel(sender).then(function(doc){
                twilio.sendMessage(sender, "Dear Educator, here is your anonymous ID: " + doc.id);
            })
            break;

        // ADMIN-ONLY
            // TODO
            // sends survey via EMAIL to everyone
        case "adminsendemail":
            if (sender == messages.adminNumber || sender == messages.adminNumber2){
                console.log("COMMAND: Survey Via Email and text");
                study.emailCustomizedSurveyLinkToAllUsers();
            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }

            break;

        // ADMIN-ONLY
        // TODO
        // sends survey to everyone
        case "adminsend":
            if (sender == messages.adminNumber || sender == messages.adminNumber2){
                console.log("sending survey via only text");
                study.textCustomizedSurveyLinkToAllUsers();
            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }

            break;

        // ADMIN-ONLY
            // TODO
            // sends reminder to everyone
        case "adminremind":
            if (sender == messages.adminNumber || sender == messages.adminNumber2){
                console.log("reminding everyone");
                twilio.sendMessage(messages.adminNumber, "Reminders have been sent")
                study.textReminderToAllUsersToCompleteSurvey();
            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }
            break;

        // ADMIN-ONLY
            // resets the records for today
        case "adminreset":
            if (sender == messages.adminNumber || sender == messages.adminNumber2){

                // twilio.sendMessage(messages.adminNumber2, "RESET SUCCESSFUL: all records have been wiped");
                study.resetTodayRecords();
                console.log("all profiles have been reset");
                twilio.sendMessage(messages.adminNumber, "RESET SUCCESSFUL: all records have been wiped");
            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }

            break;

        case "adminstatus":
            db.allUsers().then(function(doc){
                var totalUsers = 0;
                var completedUsers = 0;
                var totalSent = 0;

                doc.forEach(function(user){
                    totalUsers++;

                    if (user.completed == true){
                        completedUsers++;
                    }

                    if (user.sent ==true){
                        totalSent++;
                    }

                })

                twilio.sendMessage(sender, "Completion Progress: " + completedUsers + "/" + totalUsers + "\nSent: " + totalSent + "/" +  totalUsers);
            })
            break;

        case "admininstructions":
            twilio.sendMessage(sender, messages.adminInstructions);
            break;
        
        case "adminstartschedule":
            if (sender == messages.adminNumber || sender == messages.adminNumber2) {
                if (!messages.schedule) { // if schedule is off
                    messages.schedule = true;
                    sched.startSurveySchedule();
                    twilio.sendMessage(sender, "Scheduled sending starting now!");

                } else { // schedule is already on
                    twilio.sendMessage(sender, "Scheduled sending is already in progress!");
                    console.log("schedule is already in progress");
                }
            }
            break;

        case "adminstopschedule":
            if (sender == messages.adminNumber || sender == messages.adminNumber2) {
                if (messages.schedule) {
                    messages.schedule = false;
                    twilio.sendMessage(sender, "Scheduled sending stopped!");
                } else {
                    twilio.sendMessage(sender, "Scheduled sending is currently not in progress");
                }
            }
            break;

        case "adminmessage":
            if (sender == messages.adminNumber || sender == messages.adminNumber2) {
                var customMessage = text.substring(text.indexOf(" ") + 1, text.length);
                if (customMessage.length < 160) {
                    console.log("Sending message to everyone!");
                    study.sendMessageToEveryone(customMessage);
                    twilio.sendMessage(sender, "Message sent: " + customMessage);
                } else {
                    console.log("Message too long!");
                    twilio.sendMessage(sender, "Message too long!");
                }
            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }
            break;
        
        case "help":
            var customMessage = text.substring(text.indexOf(" ") + 1, text.length);
                // find user ID
                User.findOne({'number': sender}).then(function(userInfo){
                    var userID = userInfo.id;
                    // send help message to admins based on user ID
                    twilio.sendMessage(messages.adminNumber, userID + ": " + customMessage);
                    twilio.sendMessage(messages.adminNumber2, userID + ": " + customMessage);
                    twilio.sendMessage(sender, "Thank you, your message has been received. We will get back to you ASAP!");
                });
            break;

        // admindirect <userID> <message>
        case "admindirect":
            if (sender == messages.adminNumber || sender == messages.adminNumber2) {
                var userID = misc.getWord(text, 1);
                // did the admin specify a userID?
                if (!isNaN(userID)){
                    User.findOne({'id': userID}).then(function(userInfo){
                        var userTel = userInfo.number;
                        var customMessage = text.substring(text.indexOf(" ") + 1, text.length);
                        twilio.sendMessage(userTel, customMessage);
                    })
                }

            } else {
                twilio.sendMessage(sender, "ACCESS DENIED");
            }
            break;


        default:
            
            console.log("default");
            //DEBUG
            twilio.sendMessage(sender, messages.instructions);
            break;
    }



});



module.exports = router;
