// Defines our user schema, exports a User model object

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	id:Number,
	number: String,
	email: String,
	date: String,
	sent: Boolean,
	completed: Boolean,
	reminder1: Boolean,
	reminder2: Boolean,
	reminder3: Boolean,
	reminder4: Boolean,
	history: [],
})

var User = mongoose.model('database', userSchema);

module.exports = User;