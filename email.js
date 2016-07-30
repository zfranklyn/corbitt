// all functions pertaining to emailing

var email = function(){};

//mailer
var nodemailer = require('nodemailer');
var config = require('config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(config.get('email'));

// var mailOptions = {
//     from: '"Yale Center for Emotional Intelligence" <yceilab@gmail.com>', // sender address
//     to: element.email, // list of receivers
//     subject: 'YCEI: Corbett Prep Baseline Survey', // Subject line
//     text: messages.trimesterText + messages.surveyLinkTrimester + "&tel=" + element.id + "\n\n The YCEI Contentment Team", // plaintext body
//     html: '' // html body
// };

email.prototype.sendEmail = function(originEmail,
                                     destinationEmail,
                                     emailSubject,
                                     emailText,
                                     emailHTML,
                                     errorCallback,
                                     successCallback){
    // mailOptions object, used in transporter parameter
    var mailOptions = {
        from: originEmail, // sender address
        to: destinationEmail, // list of receivers
        subject: emailSubject, // Subject line
        text: emailText, // plaintext body
        html: emailHTML // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            errorCallback();
        } else {
            successCallback();
        }
    });

}

module.exports = new email;