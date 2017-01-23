//mailer
const nodemailer = require('nodemailer');
const config = require('config');
const smtpTransport = require('nodemailer-smtp-transport');

// all functions pertaining to emailing
var email = function(){};



// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: config.get('emailUsername'),
        pass: config.get('emailPassword'),
    }
}));

email.prototype.sendEmail = function(originEmail, destinationEmail, emailSubject, emailText, successCallback){
    // mailOptions object, used in transporter parameter
    var mailOptions = {
        from: originEmail, // sender address
        to: destinationEmail, // list of receivers
        subject: emailSubject, // Subject line
        text: emailText // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){ //error callback
            console.log("EMAIL FAILED: to send to" + " " + destinationEmail);
            console.log(error);
        } else { //success callback
            successCallback();
            console.log("EMAIL SUCCESS: " + destinationEmail);
        }
    });

};

module.exports = new email;