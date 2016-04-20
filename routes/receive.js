var express = require('express'),
    router = express.Router(),
    tools = require('../tools.js').tools,
    database = require('../db.js'),
    db = require('../dbinteraction.js'),
    messages = require('../messages.js'),
    sched = require('../scheduling.js'),
    timer = require('node-schedule');

var SCHEDULE = false;

/* GET users listing. */
router.post('/', function(req, res, next) {
	var sender = Number(req.body.From);
    var text = req.body.Body;

    console.log("MESSAGE RECEIVED: " + text);

    var firstWord = tools.getWord(text,0).toLowerCase();

    switch (firstWord){
        case "register":
            var email = tools.getWord(text, 1);
            console.log("\n\nREGISTRATION ATTEMPT:")
            console.log("User registering with email address: " + email);
            var randomID = Math.floor(Math.random()*10000);
            var REGISTERED = 0;
            if (email){
                db.findUserTel(sender).then(function(doc){
                    if (doc != null){
                        //user already exists
                        console.log("\nFAILED: user already registered\n\n")
                        tools.sendMessage(sender, "You have already registered!");
                    } else {
                        console.log("USER DOES NOT YET EXIST");
                        //check email validity
                        if (tools.validateEmail(email) && email != "youremail@example.com" ){
                            //user does not exist
                            console.log("VALIDATION SUCCESS\N\N")
                            console.log("USER CREATED: " + email + ", ID: " + randomID);
                            db.addUser(sender, email, randomID, true);
                            tools.sendMessage(sender, messages.welcome1);
                            tools.sendMessage(sender, messages.welcome2 + randomID);
                            tools.sendMessage(messages.adminNumber, "USER REGISTERED. ID: " + randomID);
                            sched.sendSingleTrimester(email, sender, randomID);
                        } else {
                            console.log("FAILED: invalid email\n\n");
                            tools.sendMessage(sender, "To register, please enter a valid email address");
                        }

                        
                    }
                })
            } else {
                tools.sendMessage(sender, "To sign up, please text 'register youremail@example.com', but except using your own email address");
            }
            
            break;

        case "admindelete":
            db.removeUser(sender);
            tools.sendMessage(sender, messages.delete);
            break;

        // case "sendsurvey":
        //     console.log("sending to everyone");
        //     tools.sendMessage(messages.adminNumber, "Surveys have been sent")
        //     sched.sendAll();
        //     break;

        case "adminsend":
            console.log("sending trimester survey to email");
            sched.sendAllTrimester();
            break;

        // case "remindsurvey":
        //     console.log("reminding everyone");
        //     tools.sendMessage(messages.adminNumber, "Reminders have been sent")
        //     sched.remindAll();
        //     break;

        case "adminremind":
            console.log("reminding everyone");
            tools.sendMessage(messages.adminNumber, "Reminders have been sent")
            tools.sendMessage(messages.adminNumber2, "Reminders have been sent")
            sched.remindAllTrimester();
            break;            

        case "adminreset":
            console.log("all profiles have been reset");
            tools.sendMessage(messages.adminNumber, "RESET SUCCESSFUL: all records have been wiped");
            tools.sendMessage(messages.adminNumber2, "RESET SUCCESSFUL: all records have been wiped");
            sched.resetAll();
            break;

        // case "starttest":
        //     SCHEDULE = true;
        //     console.log("starting scheduled sending");
        //     tools.sendMessage(messages.adminNumber, "Starting scheduled sending. TEST RUN.");

        //     var sendSurvey = timer.scheduleJob('0 * * * * *', function(){
        //         if (SCHEDULE == true){
        //             tools.sendMessage(messages.adminNumber, "Surveys have been sent");
        //             sched.sendAll();    
        //         }
                
        //     })     

        //     var sendReminder = timer.scheduleJob('10,20,30 * * * * *', function(){
        //         if (SCHEDULE == true){
        //             tools.sendMessage(messages.adminNumber, "Reminder has been sent");
        //             sched.remindAll();
        //         }
        //     })

        //     var resetting = timer.scheduleJob('50 * * * * *', function(){
        //         if (SCHEDULE == true){
        //             tools.sendMessage(messages.adminNumber, "New day! all records have been reset");
        //             sched.resetAll();
        //         }
        //     })

        //     break;

        // case "endtest":
        //     SCHEDULE = false;
        //     console.log("ending test");
        //     tools.sendMessage(messages.adminNumber, "Scheduled sending has been stopped")
        //     break;

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

                tools.sendMessage(sender, "Completion Progress: " + completedUsers + "/" + totalUsers + "\nSent: " + totalSent + "/" +  totalUsers);
            })
            break;

        case "deleteallusers":
            if (sender == messages.adminNumber || sender == messages.adminNumber2){
                db.deleteAllUsers();
                tools.sendMessage(sender, "All users deleted.");
            } else {
                tools.sendMessage(sender, "PERMISSION DENIED");
            }
            break;            

        case "admininstructions":
            tools.sendMessage(sender, messages.adminInstructions);
            break;

        default: 
            tools.sendMessage(sender, messages.instructions);
            break;
    }



});



module.exports = router;
