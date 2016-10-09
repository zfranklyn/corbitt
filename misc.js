// General functions

// Dependencies
var misc = function(){};

// returns today's date (e.g., "22/3/1995")
misc.prototype.date = function(){
  var currentdate = new Date(); 
  var date =  currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear();
  return date;
}

// returns time right now
misc.prototype.timeRightNow = function(){
    var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    var time = h + ':' + m;

    return time;
}

// returns yesterday's date
misc.prototype.yesterday = function(){
  var date = new Date(); 
  date = new Date(date.setDate(date.getDate() - 1));
  date =  date.getDate() + "/"
                  + (date.getMonth()+1)  + "/" 
                  + date.getFullYear();

  return date;
}


// returns the nth word in a string, separated by spaces
// getWord(string, whichWord?)
misc.prototype.getWord = function getWord(str, num) {
    var array = str.split(" ");
    return array[num];
};

// basic email format validation
misc.prototype.validateEmail = function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);  
}

module.exports = new misc;