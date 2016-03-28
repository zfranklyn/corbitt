// Defines our user schema, exports a User model object

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	number: String,
	date: String,
	sent: Boolean,
	completed: Boolean,
	reminder1: Boolean,
	reminder2: Boolean,
	reminder3: Boolean,
	reminder4: Boolean,
	messages: [String],
	totalReminders: Number
})

var User = mongoose.model('database', userSchema);

module.exports = User;