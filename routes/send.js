var express = require('express');
var router = express.Router();

var twilio = require('twilio');
var client = new twilio.RestClient('AC170fc2dada99b57a4adea1c50f16ae9c', 'db2ba24aec016a23261268708c688b86');

function sendMessage(recipient, content){
    //PARAM VALIDATION:
        //recipient should be a NUMBER
        //content should be a STRING
    console.log(recipient + content)
    // TODO

    client.sms.messages.create({
        to:recipient,
        from:'12258009253',
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
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
        }
    });
}

/* GET users listing. */
router.post('/', function(req, res, next) {

    var number = req.body.message_recipient;
    var content = req.body.message_content;
    sendMessage(number, content)

    console.log("MESSAGE SENT: " + content + ", TO " + number)

});

module.exports = router;
