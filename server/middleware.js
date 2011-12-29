var express = require('express');

var LOG_FORMAT = ':method :url :status :res[content-length] - :response-time ms'

// middleware stacks
module.exports = function(app) {
  
  return {
    standard: [
      express.logger(LOG_FORMAT),
      express.cookieParser(),
      express.session({secret: 'this is fake'}),
      getCurrentUser(),
      express.bodyParser()
    ],

    streaming: [
      express.logger(LOG_FORMAT)
    ]
  };

  function getCurrentUser() { 
    return function(req,res,next){
      if(!req.session.user_id) return next();
      rr.Users.findOne(
        {_id: req.session.user_id}, //#TODO: '_id' is Mongo-specific, should probably be pulled from somewhere
        function(err,user){
          //#TODO: handle this error
          if(err) app.handleError(err);
          req.user = user;
          next();
        }
      );
    }
  };
};