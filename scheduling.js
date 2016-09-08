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

    var surveySchedule = later.parse.text("every 5 seconds");
    var reminderSchedule = later.parse.text("every 10 seconds");
    var resetSchedule = later.parse.text("every minute");

    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting survey");
            study.textCustomizedSurveyLinkToAllUsers();
        }
    }, surveySchedule);

    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminders");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, reminderSchedule);

    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: resetting");
            study.resetTodayRecords();
        }
    }, resetSchedule);
}


module.exports = new scheduling;