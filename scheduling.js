// Scheduled Sending
var scheduling = function (){};

var later = require('later');
var misc = require('./misc.js');
var db = require('./db.js');
var messages = require('./messages.js');
var twilio = require('./twilio.js');
// var emailing = require('./email.js');
var study = require('./study.js');

scheduling.prototype.startSurveySchedule = function(){
    // UTC time 8PM is 4PM EST

    var biweeklySurveyScheduleEven = later.parse.text('at 8:00 pm on Tuesday,Thursday');
    var biweeklySurveyScheduleOdd = later.parse.text('at 8:00 pm on Monday,Wednesday');
    var fridaySurveySchedule = later.parse.text('at 8:00 pm on Friday');
    var reminderSchedule = later.parse.text('at 9:30 pm,11:00 pm,12:30 am,and 2:00am');
    var resetScheduleEven= later.parse.text('at 7:00 pm on Tuesday,Thursday,Friday'); // reset an hour before next one sends out
    var resetScheduleOdd = later.parse.text('at 7:00 pm on Monday,Wednesday,Friday');

    // biweekly sending schedule
    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Biweekly Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled bi-weekly survey sending");
            study.textCustomizedSurveyLinkToAllUsers("biweekly");
        }
    }, biweeklySurveyScheduleEven);

    // friday sending schedule
    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Friday Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled Friday survey sending");
            study.textCustomizedSurveyLinkToAllUsers("friday");
        }
    }, fridaySurveySchedule);

    // reminder sending schedule
    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminders");
            twilio.sendMessage(messages.adminNumber, "Scheduled reminders sending");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, reminderSchedule);

    // reset schedule
    later.setInterval(function(){
        if (messages.schedule ){
            twilio.sendMessage(messages.adminNumber, "Scheduled reset initiated");
            console.log("SCHEDULE: resetting");
            study.resetTodayRecords();
        }
    }, resetScheduleEven);
}

module.exports = new scheduling;