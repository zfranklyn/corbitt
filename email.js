// all functions pertaining to emailing
var email = function(){};

//mailer
var nodemailer = require('nodemailer');
var config = require('config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(config.get('email'));

email.prototype.sendEmail = function(originEmail, destinationEmail, emailSubject, emailText){
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
        } else { //success callback
            console.log("EMAIL SUCCESS: " + destinationEmail);
        }
    });

};

module.exports = new email;