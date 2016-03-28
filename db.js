// DATABASE CODE
var mongoose = require('mongoose');

// connects to MLab database
mongoose.connect('mongodb://zfranklyn:legend123@ds025449.mlab.com:25449/ycei')

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("connected to MongoDB database!")
})

module.exports = db;