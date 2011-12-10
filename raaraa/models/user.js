var mongoose = require("mongoose"),
    crypto = require("crypto");

function hash(password) {
	return crypto.createHash("sha1").update(password).digest('hex');
}

module.exports = mongoose.model('User', new mongoose.Schema({
    displayName: String,
}));