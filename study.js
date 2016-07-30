var study = function(){};

// all study specific actions
// twilio & email base functions are in twilio.js and email.js
// more complex functions are defined here

var email = require('./email.js');
var twilio = require('./twilio.js');
var db = require('./db.js');
var messages = require('./messages.js');
var User = require('./schemas/userSchema.js');


// TEXT survey link to all users
// ONLY IF user has not yet received the survey
study.prototype.textCustomizedSurveyLinkToAllUsers= function(){
    User.find().exec().then(function(users){
        users.forEach(function(element, index, array){
            if (element.sent == false){
                var userTel = element.number;
                var userID = element.id;
                console.log("SENDING SURVEY TO: "+ element.number);

                // send text message to user with the survey link
                // TODO:
                    // change tel parameter to id

                var messageContent = messages.send + messages.surveyLink + "&tel=" + userID;
                twilio.sendMessage(userTel, messageContent);

                // redefine the user's "today's stats"
                element.date = tools.date();
                element.sent = true;
                element.save(function(err){
                    if (err) { console.log("failed to update")} else {
                        console.log("updated");
                    }
                })
            }

        })
    })
}

// TEXT REMINDER
//Remind all users who have received, but not yet completed the survey
study.prototype.textReminderToAllUsersToCompleteSurvey = function(){
    User.find().exec().then(function(users){
        users.forEach(function(element, index, array){
            // if user has received email but not yet completed
            if (element.sent == true && element.completed == false){

                // remind user, wording varies depending on reminder number
                if (element.numberOfRemindersToday < 5) {
                    // send corresponding reminder text
                    twilio.sendMessage(element.tel, messages["reminder" + element.numberOfRemindersToday])
                    console.log("USER "+ element.number + " has been sent reminder no. " + element.numberOfRemindersToday);
                    element.numberOfRemindersToday++;
                } else {
                    var delinquentMessage = "WARNING (" + tools.date() + ")" + ": Incomplete after 4 reminders: " +
                        element.number + "ID: " + element.id;
                    // even after 4 reminders, this person has not completed; his/her number is sent to the admin number
                    tools.sendMessage(messages.adminNumber,
                        delinquentMessage);

                    tools.sendMessage(messages.adminNumber2,
                        delinquentMessage);

                    console.log(delinquentMessage);
                }

                // save reminder status
                element.save(function(err){
                    if (err) {
                        console.log("failed to update")
                    } else {
                        console.log("updated");
                    }})

            }

        })


    })

}

// EMAIL send survey link to all users
study.prototype.emailCustomizedSurveyLinkToAllUsers = function(){
    User.find().exec().then(function(users){
        users.forEach(function(element, index, array){

            //if we have not yet sent it to you...
            if (element.sent == false){
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from:       messages.email.originEmail, // sender address
                    to:         element.email, // list of receivers
                    subject:    messages.email.emailSubject, // Subject line
                    text:       messages.email.SurveyText1+
                                messages.surveyLink +
                                messages.surveyParam +
                                element.id +
                                messages.email.SurveyText2,
                    html: ""
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    
                    if(error){
                        // DEBUG: if email failed, send text message
                        console.log("EMAIL FAILED: USER " + element.id, error);
                        if (config.get('dev')){
                            tools.sendMessage(messages.adminNumber, "FAILED: EMAIL TO USER " + element.id);
                        }
                    } else {
                        console.log('EMAIL SUCCESS: ' + element.id + info.response);
                        console.log('EMAIL SUCCESS: ' + element.id + info.response);

                        if (config.get('dev')) {
                            tools.sendMessage(messages.adminNumber, "SUCCESS: EMAIL TO USER " + element.id);
                        }

                        // email sent, now send SMS reminder and save sent state
                        console.log("Sending SMS reminder that email has been sent");
                        tools.sendMessage(element.number, messages.textMessage_SurveySentToEmail);

                        // save updated "sent" state
                        element.date = tools.date();
                        element.sent = true;
                        element.save(function(err){
                            if (err) {
                                console.log("failed to update")
                            } else {
                                console.log("updated");
                            }
                        })

                    }



                });


            }
        })
    })
}



module.exports = new study;