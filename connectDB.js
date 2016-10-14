//DATABASE
//Connects to database
var mongoose = require('mongoose');
var config = require('config');

// connects to MLab database
mongoose.connect(config.get("testDB"));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to database")
});