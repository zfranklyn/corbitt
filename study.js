var study = function(){};

// all study specific actions
// twilio & email base functions are in twilio.js and email.js
// more complex functions are defined here

var email = require('./email.js');
var twilio = require('./twilio.js');
var db = require('./db.js');
var messages = require('./messages.js');
var User = require('./schemas/userSchema.js');
var misc = require('./misc.js');

var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var config = require('config');



// TEXT survey link to all users
// ONLY IF user has not yet received the survey
study.prototype.textCustomizedSurveyLinkToAllUsers= function(surveyType){
    User.find().exec().then(function(users){
        users.forEach(function(user){
            var userTel = user.number;
            var userID = user.id;

            if (user.sent == false && userID != 6239){

                console.log("SENDING SURVEY TO: "+ user.number);

                var messageContent;

                // send biweekly or friday survey depending on parameter
                if (surveyType === "friday"){
                    messageContent = messages.send + " \n "  + messages.surveyFriday + "&id=" + userID;
                } else if (surveyType === "peace") {
                    messageContent = messages.send + " \n "  + messages.peaceLink + "&id=" + userID;
                } else {
                    messageContent = messages.send + messages.surveyBiWeekly + "&id=" + userID;
                }

                twilio.sendMessage(userTel, messageContent);

                // redefine the user's "today's stats"
                user.date = misc.date();
                user.sent = true;
                user.save();

            } else {
                console.log("USER " + userID + " has already been sent the survey");
            }

        })
    })
}

// TEXT REMINDER
//Remind all users who have received, but not yet completed the survey
study.prototype.textReminderToAllUsersToCompleteSurvey = function(){
    User.find().exec().then(function(users){
        users.forEach(function(user, index, array){

            if (user.sent){
                // if user has received email but not yet completed
                if (user.completed == false){

                    // remind user, wording varies depending on reminder number
                    if (user.numberOfRemindersToday < 3) {
                        // send corresponding reminder text
                        twilio.sendMessage(user.number, messages["reminder" + user.numberOfRemindersToday])
                        console.log("USER "+ user.number + " has been sent reminder no. " + user.numberOfRemindersToday);
                        user.numberOfRemindersToday++;
                    } else if (user.numberOfRemindersToday < 4) { // don't do anything after 5
                        var delinquentMessage = "WARNING (" + misc.date() + ")" + ": Incomplete after 4 reminders: " +
                            user.number + "ID: " + user.id;
                        // even after 4 reminders, this person has not completed; his/her number is sent to the admin number

                        user.numberOfRemindersToday++;

                        console.log(delinquentMessage);
                    }

                    // save reminder status
                    user.save(function(err){
                        if (err) {
                            console.log("failed to update")
                        } else {
                            console.log("updated");
                        }})

                } else {
                    console.log("USER " + user.id + " has already completed the survey today");
                }


            } else { //user has not yet been sent survey
                console.log("USER " + user.id + " not yet sent survey");
            }


        })


    })

}

// EMAIL send survey link to all users
// study.prototype.emailCustomizedSurveyLinkToAllUsers = function(){
//     User.find().exec().then(function(users){
//         users.forEach(function(user){
//
//             //if we have not yet sent it to you...
//             if (user.sent == false){
//                 // setup e-mail data with unicode symbols
//                 var mailOptions = {
//                     from:       messages.email.originEmail, // sender address
//                     to:         user.email, // list of receivers
//                     subject:    messages.email.emailSubject, // Subject line
//                     text:       messages.email.SurveyText1+
//                                 messages.surveyLink +
//                                 messages.surveyParam +
//                                 user.id +
//                                 messages.email.SurveyText2,
//                     html: "",
//                     headers: {
//                         'userId': "yceilab@gmail.com",
//                         'access_type':"offline"
//
//                     }
//                 };
//
//                 console.log(mailOptions);
//
//                 transporter.sendMail(mailOptions, function(error, info){
//
//                     if(error){
//                         // DEBUG: if email failed, send text message
//                         console.log("EMAIL FAILED: USER " + user.id, error);
//                         if (config.get('dev')){
//                             twilio.sendMessage(messages.adminNumber, "FAILED: EMAIL TO USER " + user.id);
//                         }
//                     } else {
//                         console.log('EMAIL SUCCESS: ' + user.id + info.response);
//
//                         if (config.get('dev')) {
//                             twilio.sendMessage(messages.adminNumber, "SUCCESS: EMAIL TO USER " + user.id);
//                         }
//
//                         // email sent, now send SMS reminder and save sent state
//                         console.log("Sending SMS reminder that email has been sent");
//                         twilio.sendMessage(user.number, messages.textMessage_SurveySentToEmail);
//
//                         // save updated "sent" state
//                         user.date = misc.date();
//                         user.sent = true;
//                         user.save(function(err){
//                             if (err) {
//                                 console.log("failed to update")
//                             } else {
//                                 console.log("updated");
//                             }
//                         })
//
//                     }
//
//
//
//                 });
//
//
//             }
//         })
//     })
// }

// RESET all records for today
study.prototype.resetTodayRecords = function(){
    User.find().exec().then(function(users){
        users.forEach(function(user){

            // record today's records in user history
            var todayHistoryObject = {
                date:user.date,
                completed:user.completed,
                completionTime:user.completionTime,
                numberOfRemindersToday: user.numberOfRemindersToday
            };

            user.history.push(todayHistoryObject);

            //reset today's records
            user.date = misc.date();
            user.sent = false;
            user.completed = false;
            user.numberOfRemindersToday = 0;

            user.save();

            console.log("RESET SUCCESSFUL: USER " + user.id);


        })
    })
}

study.prototype.sendMessageToEveryone = function(message){
    User.find().exec().then(function(users){
        users.forEach(function(user){
            var userTel = user.number;

            twilio.sendMessage(userTel, message);

        })
    })
}

module.exports = new study;