var express = require('express'),
    router = express.Router(),
    tools = require('../tools.js').tools,
    database = require('../db.js'),
    db = require('../dbinteraction.js'),
    messages = require('../messages.js'),
    sched = require('../scheduling.js'),
    timer = require('node-schedule');

// var j = timer.scheduleJob('0 * * * * *', function(){
//     console.log("testing cron");
// })

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
            var REGISTERED = 0;
            db.findUser(sender).then(function(doc){
                if (doc != null){
                    //user already exists
                    console.log("user already registered")
                    tools.sendMessage(sender, "You have already registered!");
                } else {
                    //user does not exist
                    console.log("registering now")
                    db.addUser(sender);
                    tools.sendMessage(sender, messages.welcome);
                }
            })
            break;

        case "delete":
            db.removeUser(sender);
            tools.sendMessage(sender, messages.delete);
            break;

        case "listall":
            var userArray = []
            db.allUsers().then(function(users){
                console.log(users)
            })

            // console.log(userArray.length);
            break;

        case "send":
            console.log("sending to everyone");
            tools.sendMessage(messages.adminNumber, "Surveys have been sent")
            sched.sendAll();
            break;

        case "remind":
            console.log("reminding everyone");
            tools.sendMessage(messages.adminNumber, "Reminders have been sent")
            sched.remindAll();
            break;

        case "reset":
            console.log("all profiles have been reset");
            tools.sendMessage(messages.adminNumber, "New day! all records have been reset")
            sched.resetAll();
            break;

        default: 
            tools.sendMessage(sender, messages.instructions)
            break;
    }



});



module.exports = router;
