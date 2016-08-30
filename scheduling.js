// Scheduled Sending
var scheduling = function (){};

var User = require('./schemas/userSchema.js');
var misc = require('./misc.js').misc;
var db = require('./db.js');
var messages = require('./messages.js');
var twilio = require('./twilio.js');
var emailing = require('./email.js');


scheduling.prototype.sendAllEmail = function(){

    User.find({}, function(err, allUsers) {

        allUsers.forEach(function(user){

            var num = user.number;
            var id = user.id;
            var email = user.email;
            var customSurveyURL = messages.textSurveyURLBase + messages.surveyParam + id;
            var emailText = messages.email.SurveyText1 + customSurveyURL + messages.email.SurveyText2;

            if (user.sent == false){ //user has already been sent survey
                //do nothing

            } else { //user has not yet been sent survey; send it!
                console.log("user num: " + num);
                twilio.sendMessage(num, "Hello, today's YCEI survey can be found here: " + customSurveyURL);
                emailing.sendEmail(messages.email.originEmail, email, messages.emailSubject, emailText);

                user.sent = true;
                user.save();

            }

        })

    });



};



module.exports = new scheduling;