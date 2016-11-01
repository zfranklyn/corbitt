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

    twilio.sendMessage(messages.adminNumber, "Scheduled sending schedule online!");

    var biweeklySurveyScheduleEven = later.parse.text('at 8:00 pm on Tuesday,Thursday');
    var biweeklySurveyScheduleOdd = later.parse.text('at 8:00 pm on Monday,Wednesday');
    var fridaySurveySchedule = later.parse.text('at 8:00 pm on Friday');
    var resetScheduleEven= later.parse.text('at 7:00 pm on Tuesday,Thursday,Friday'); // reset an hour before next one sends out
    var resetScheduleOdd = later.parse.text('at 7:00 pm on Monday,Wednesday,Friday');
    //
    // reminder1
    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminder 1");
            twilio.sendMessage(messages.adminNumber, "Reminder 1 sending");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, later.parse.text('at 9:30pm'));

    // reminder2
    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminder 2");
            twilio.sendMessage(messages.adminNumber, "Reminder 2 sending");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, later.parse.text('at 11:00pm'));

    // reminder3
    later.setInterval(function(){
        if (messages.schedule ){
            console.log("SCHEDULE: texting reminder 3");
            twilio.sendMessage(messages.adminNumber, "Reminder 3 sending");
            study.textReminderToAllUsersToCompleteSurvey();
        }
    }, later.parse.text('at 00:00'));


    // biweekly sending schedule
    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Biweekly Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled bi-weekly survey sending");
            study.textCustomizedSurveyLinkToAllUsers("biweekly");
        }
    }, biweeklySurveyScheduleOdd);

    // friday sending schedule
    later.setInterval(function(){
        if (messages.schedule ) {
            console.log("messages.schedule: ", messages.schedule );
            console.log("SCHEDULE: Texting Friday Survey");
            twilio.sendMessage(messages.adminNumber, "Scheduled Friday survey sending");
            study.textCustomizedSurveyLinkToAllUsers("friday");
        }
    }, fridaySurveySchedule);

    // reset schedule
    later.setInterval(function(){
        if (messages.schedule ){
            twilio.sendMessage(messages.adminNumber, "Scheduled reset initiated");
            console.log("SCHEDULE: resetting");
            study.resetTodayRecords();
        }
    }, resetScheduleOdd);
}

messages.schedule = true;
scheduling.prototype.startSurveySchedule();

module.exports = new scheduling;