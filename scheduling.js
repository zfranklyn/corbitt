// Scheduled Sending
var scheduling = function (){};

var later = require('later');
var User = require('./schemas/userSchema.js');
var misc = require('./misc.js').misc;
var db = require('./db.js');
var messages = require('./messages.js');
var twilio = require('./twilio.js');
// var emailing = require('./email.js');
var study = require('./study.js');

scheduling.prototype.startSurveySchedule = function(){
    // UTC time 8PM is 4PM EST

    // every Tuesday and Thursday at 4PM EST
    var biweeklySurveySchedule = later.parse.text('at 8:00 pm on Tuesday,Thursday');
    var fridaySurveySchedule = later.parse.text('at 8:00 pm on Friday');
    var reminderSchedule = later.parse.text('at 9:00 pm,10:00 pm,11:00 pm,and 11:59pm on Tuesday,Thursday');
    var resetSchedule = later.parse.text('at 11:00 am on Wednesday,Friday, and Saturday');

    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Biweekly Survey");
            twilio.sendMessage(messages.adminNumber, "Texting biweekly survey");
            study.textCustomizedSurveyLinkToAllUsers("biweekly");
        }
    }, biweeklySurveySchedule);

    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Friday Survey");
            twilio.sendMessage(messages.adminNumber, "Texting Friday survey");
            study.textCustomizedSurveyLinkToAllUsers("friday");
        }
    }, fridaySurveySchedule);

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

messages.schedule = true;
scheduling.prototype.startSurveySchedule();
// console.log(later.parse.text("at 8:00 pm on every Saturday,Tuesday, and Thursday"));

module.exports = new scheduling;