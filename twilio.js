// All functions related to the Twilio API

// define new class, "twilio"
var twilio = function(){};

var config = require('config');
var twilioAPI = require('twilio');
var client = new twilioAPI.RestClient('AC170fc2dada99b57a4adea1c50f16ae9c', 'db2ba24aec016a23261268708c688b86');

// sends text message
twilio.prototype.sendMessage = function(recipient, content){
    client.sms.messages.create({
        to:recipient,
        from: config.get("twilioNumber"),
        body:content,
    }, function(error, message) {
        // The HTTP request to Twilio will run asynchronously. This callback
        // function will be called when a response is received from Twilio
        // The "error" variable will contain error information, if any.
        // If the request was successful, this value will be "falsy"
        if (!error) {
            // The second argument to the callback will contain the information
            // sent back by Twilio for the request. In this case, it is the
            // information about the text messsage you just sent:

            console.log('Message sent to: ' + recipient);
            console.log("Message Content: " + content);
        } else {
            console.log('FAILED: Message to: ' + recipient);
            console.log("FAILED: Message Content: " + content);
            console.log("FAILURE TYPE: " + error)
        }
    });
}

module.exports = new twilio;