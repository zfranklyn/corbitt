// When user completes a server,
// Qualtrics sends a GET request to ./complete
// including a parameter of ID number

var express = require('express');
var router = express.Router();
var db = require('../db.js');
var twilio = require('../twilio.js');
var messages = require('../messages');
var misc = require('../misc.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    var date = misc.date();
    var userID = Number(req.query.id);
    var surveyType = req.query.survey;

    // find the user that completed the survey
    db.returnUserBasedOnID(userID).then(function (user) {
            var userTel = user.number;

            // sanity check: user should not have completed this survey twice today
            // sometimes Qualtrics sends multiple GET requests; this is to ensure
            // the user doesn't get spam SMS
            if (!user.completed) {
                console.log(date + ": USER " + userID + " completed today's survey");
                console.log("user number:");
                console.log(userTel);
                twilio.sendMessage(userTel, messages.completedSurveyReply);

                // redefine current user object:
                user.completed = true;
                user.save(function (error) {

                    if (!error) {
                        console.log("USER " + userID + " has completed survey; db records have been updated");
                    } else {
                        // if for some reason...
                        console.log("USER " + userID + "has completed survey, but records have FAILED to be updated");
                        twilio.sendMessage(messages.adminNumber, "USER " + userID + "completed survey, but db records failed to update");
                    }
                })
            } else {
                console.log("USER " + userTel + " has already completed this survey.")
            }

    });

    res.sendStatus(200);


});





module.exports = router;
