// Scheduled Sending
var scheduling = function (){};

var later = require('later');
var User = require('./schemas/userSchema.js');
var misc = require('./misc.js').misc;
var db = require('./db.js');
var messages = require('./messages.js');
var twilio = require('./twilio.js');
var emailing = require('./email.js');
var study = require('./study.js');

scheduling.prototype.startSurveySchedule = function(){

    var surveySchedule = later.parse.text("every 10 seconds");
    var reminderSchedule = later.parse.text("every 15 seconds");

    later.setInterval(study.textCustomizedSurveyLinkToAllUsers, surveySchedule);
    later.setInterval(study.textReminderToAllUsersToCompleteSurvey, reminderSchedule);
}


module.exports = new scheduling;