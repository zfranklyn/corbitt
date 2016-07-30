// Defines our user schema, exports a User model object

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: Number,
    number: String,
    email: String,
    date: String,
    sent: Boolean,
    completed: Boolean,
    completionTime: String,
    numberOfRemindersToday: Number,
    history: [],
    totalHistoricNumberOfDelinquencies: Number
})

var User = mongoose.model('database', userSchema);

module.exports = User;