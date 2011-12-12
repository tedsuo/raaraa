var db = require("../db"),
    crypto = require("crypto");

function hash(password) {
    return crypto.createHash("sha1").update("t4stybab1es!"+password)
        .digest('hex');
}

var UserCollection = function() {
    this.collectionName = "users";
    this.collection = db.collection(this.collectionName);
    this.columns = ['username', 'password', 'display_name'];
};

UserCollection.prototype = {
    createUser: function(doc, callback) {
        var hashedPass = hash(doc.password);
        this.collection.insert({ username: doc.username,
                                 password: hashedPass })
            .done(function(users) {
                callback(null, users[0]);
            })
            .fail(function(err) {
                callback(err, null);
            });
    },

    findUser: function(query, callback) {
        var hashedPass = hash(query.password);
        var newQuery = {};
        Object.keys(query).forEach(function(key) {
            newQuery[key] = query[key];
        });
        newQuery.password = hashedPass;
        this.collection.findOne(newQuery)
            .done(function(user) {
                callback(null, user);
            })
            .fail(function(err) {
                callback(err, null);
            });
    },

    
};

module.exports = new UserCollection();
