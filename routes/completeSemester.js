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

            console.log(date + ": USER " + userID + " completed Semester Survey T2");
            console.log(`user number: ${userTel}`);

            // change the user's status to complete
            user.history.filter(h=>(h.surveyType==surveyType))[0].completed = true;
            twilio.sendMessage(userTel, "Thank you for completed the semester survey!");

            user.save(function (error) {
                    if (!error) {
                        console.log("USER " + userID + " has completed survey; db records have been updated");
                    } else {
                        // if for some reason...
                        console.log("USER " + userID + "has completed survey, but records have FAILED to be updated");
                        twilio.sendMessage(messages.adminNumber, "USER " + userID + "completed survey, but db records failed to update");
                    }
                })
            }

    });

    res.sendStatus(200);


});





module.exports = router;
