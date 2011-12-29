// # Middleware Stacks
//
//  stacks are layers of middleware, bundled together by type of http request.
//

var express = require('express');

var LOG_FORMAT = ':method :url :status :res[content-length] - :response-time ms';

module.exports = function(app) {  
  return {

// ## standard
//
//  non-streaming requests made by an authenticated user.
//
    standard: [
      express.logger(LOG_FORMAT),
      express.cookieParser(),
      express.session({secret: 'this is fake'}),
      getCurrentUser(),
      authenticate(),
      express.bodyParser()
    ],

// ## public
//
//  non-streaming requests that do not require authentication. User will still 
//  be detected.
//
    public: [
      express.logger(LOG_FORMAT),
      express.cookieParser(),
      express.session({secret: 'this is fake'}),
      getCurrentUser(),
      express.bodyParser()
    ],

// ## streaming
//
//  streaming requests made by an authenticated user.
//
    streaming: [
      express.logger(LOG_FORMAT)
    ]

  };


// # Middleware Plugins
// 
// 

// ## getCurrentUser
//
//  you guessed it.
//
  function getCurrentUser() { 
    return function(req,res,next){
      if(!req.session.user_id) return next();
      rr.Users.findOne(
        {_id: req.session.user_id}, //#TODO: '_id' is Mongo-specific, should probably be pulled from somewhere
        function(err,user){
          // TODO: handle this error
          if(err) app.handleError(err);
          req.user = user;
          next();
        }
      );
    }
  }

// ## authenticate
//
//  authenticate!
//
  function authenticate() { 
    return function(req,res,next){
      if(!req.user){
        res.render("login.jade", {
          title: 'RaaRaa -- Party People', 
          errors: req.flash('error') 
        });
        return;
      }
      next();
    );
  }

};