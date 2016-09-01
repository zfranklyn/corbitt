// stores other important data, such as refresh tokens.

var mongoose = require('mongoose');

var otherDataSchema = mongoose.Schema({
    refreshToken: String
})

var otherData = mongoose.model('otherData', otherDataSchema);

module.exports = otherData;