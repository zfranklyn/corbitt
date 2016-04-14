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
        case "admin":
            switch (tools.getWord(text, 1).toLowerCase()) {
                case "test":
                    tools.sendMessage(sender, "server functioning, all is well");
                    break;

                case "status":
                    tools.sendMessage(sender, "57" + "/" + "100" + " users have completed the survey")
                    break;
                default:
                    tools.sendMessage(sender, "commands: 'status', 'all', ");
                    break;
            }
            break;

        case "register":
            var email = tools.getWord(text, 1);
            console.log(email);
            var randomID = Math.floor(Math.random()*10000);
            var REGISTERED = 0;
            if (email){
                db.findUserTel(sender).then(function(doc){
                    if (doc != null){
                        //user already exists
                        console.log("user already registered")
                        tools.sendMessage(sender, "You have already registered!");
                    } else {
                        //user does not exist
                        console.log("registering now")
                        db.addUser(sender, email, randomID);
                        tools.sendMessage(sender, messages.welcome + randomID);
                    }
                })
            } else {
                tools.sendMessage(sender, "To sign up, please text 'register user@example.com");
            }
            
            break;

        case "admindelete":
            db.removeUser(sender);
            tools.sendMessage(sender, messages.delete);
            break;

        case "sendsurvey":
            console.log("sending to everyone");
            tools.sendMessage(messages.adminNumber, "Surveys have been sent")
            sched.sendAll();
            break;

        case "sendtrimester":
            console.log("sending trimester survey to email");
            sched.sendAllTrimester();
            break;

        case "remindsurvey":
            console.log("reminding everyone");
            tools.sendMessage(messages.adminNumber, "Reminders have been sent")
            sched.remindAll();
            break;

        case "remindtrimester":
            console.log("reminding everyone");
            tools.sendMessage(messages.adminNumber, "Reminders have been sent")
            sched.remindAllTrimester();
            break;            

        case "reset":
            console.log("all profiles have been reset");
            tools.sendMessage(messages.adminNumber, "New day! all records have been reset")
            sched.resetAll();
            break;

        case "starttest":
            SCHEDULE = true;
            console.log("starting scheduled sending");
            tools.sendMessage(messages.adminNumber, "Starting scheduled sending. TEST RUN.");

            var sendSurvey = timer.scheduleJob('0 * * * * *', function(){
                if (SCHEDULE == true){
                    tools.sendMessage(messages.adminNumber, "Surveys have been sent");
                    sched.sendAll();    
                }
                
            })     

            var sendReminder = timer.scheduleJob('10,20,30 * * * * *', function(){
                if (SCHEDULE == true){
                    tools.sendMessage(messages.adminNumber, "Reminder has been sent");
                    sched.remindAll();
                }
            })

            var resetting = timer.scheduleJob('50 * * * * *', function(){
                if (SCHEDULE == true){
                    tools.sendMessage(messages.adminNumber, "New day! all records have been reset");
                    sched.resetAll();
                }
            })

            break;

        case "endtest":
            SCHEDULE = false;
            console.log("ending test");
            tools.sendMessage(messages.adminNumber, "Scheduled sending has been stopped")
            break;

        default: 
            tools.sendMessage(sender, messages.instructions)
            break;
    }



});



module.exports = router;