function User(rr) {
  
};

User.prototype = {
  init: function() {
  }
};

function UserCollection(rr) {
  this.init(rr);
};

UserCollection.prototype = {
  init: function(rr) {
  }
};

exports.collectionClass = UserCollection;
exports.documentClass = User;
exports.name = "User";