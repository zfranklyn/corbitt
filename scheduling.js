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

    var biweeklySurveySchedule = later.parse.text('at 8:00 pm on Monday,Wednesday');
    var fridaySurveySchedule = later.parse.text('at 8:00 pm on Friday');
    var reminderSchedule = later.parse.text('at 9:00 pm,10:00 pm,11:00 pm,and 11:59pm on Monday,Tuesday,Wednesday,Thursday');
    var resetSchedule = later.parse.text('at 7:00 pm on Monday,Wednesday,Friday'); // reset an hour before next one sends out
    var testSchedule = later.parse.text('at 11:00 am,12:00 pm,1:00pm,2:00pm,3:00pm,4:00pm on Sunday');

    later.setInterval(function(){
        console.log("sending test schedule")
        twilio.sendMessage(messages.adminNumber, "test schedule");
    })

    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Biweekly Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled bi-weekly survey sending");
            study.textCustomizedSurveyLinkToAllUsers("biweekly");
        }
    }, biweeklySurveySchedule);

    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Friday Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled Friday survey sending");
            study.textCustomizedSurveyLinkToAllUsers("friday");
        }
    }, fridaySurveySchedule);

    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminders");
            twilio.sendMessage(messages.adminNumber, "Scheduled reminders sending");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, reminderSchedule);

    later.setInterval(function(){
        if (messages.schedule ){
            twilio.sendMessage(messages.adminNumber, "Scheduled reset initiated");
            console.log("SCHEDULE: resetting");
            study.resetTodayRecords();
        }
    }, resetSchedule);
}

module.exports = new scheduling;