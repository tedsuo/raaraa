var mongoose = require("mongoose"),
    crypto = require("crypto");

var Schema = mongoose.Schema;

function hash(password) {
    return crypto.createHash("sha1").update(password).digest('hex');
}

var User = new Schema({
    displayName: String,
});

exports.Schema = User;
exports.name = "User";