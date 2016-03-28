// General functions and variables

// Dependencies
var twilio = require('twilio');
var client = new twilio.RestClient('AC170fc2dada99b57a4adea1c50f16ae9c', 'db2ba24aec016a23261268708c688b86');

// DATABASE CODE

var tools = function(){};

// Gives current date
tools.prototype.date = function(){

  var currentdate = new Date(); 
  var date =  currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear();

  return date;
}

tools.prototype.yesterday = function(){
  var date = new Date(); 
  date = new Date(date.setDate(date.getDate() - 1));
  date =  date.getDate() + "/"
                  + (date.getMonth()+1)  + "/" 
                  + date.getFullYear();

  return date;
}

// sends text message
tools.prototype.sendMessage = function(recipient, content){

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
     
            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Message failed to send!');
            console.log(error);
        }
    });

}

tools.prototype.getWord = function getWord(str, num) {
    var array = str.split(" ");
    return array[num];
};

exports.tools = new tools;