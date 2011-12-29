
// # Middleware Stacks
//
//  stacks are layers of middleware, bundled together by type of http request.
//

var express = require('express');

// ### var LOG_FORMAT
var LOG_FORMAT = ':method :url :status :res[content-length] - :response-time ms';


// ## exports.getStacks(app)
//
//  the routes module returns a setup function, which initializes the router.
//
//  - **app**  express server
//
module.exports.getStacks = function(app) {  
  return {

// ## buffered_private
//
//  non-streaming requests made by an authenticated user.
//
    buffered_private: [
      logger,
      cookie_parser,
      session,
      get_current_user,
      authenticate,
      body_parser
    ],

// ## buffered_public
//
//  non-streaming requests that do not require authentication. User will still 
//  be detected.
//
    buffered_public: [
      logger,
      cookie_parser,
      session,
      get_current_user,
      body_parser
    ],

// ## streaming_private
//
//  streaming requests made by an authenticated user.
//
    streaming_private: [
      cookie_parser,
      session,
      get_current_user,
      authenticate
    ]

  };
};



// # Middleware Plugins
// 
// 

var logger = express.logger(LOG_FORMAT);
var cookie_parser = express.cookieParser();
var session = express.session({secret: 'this is fake'});
var body_parser = express.bodyParser();

// ## getCurrentUser
//
//  you guessed it.
//
var get_current_user = function(req,res,next){
  if(!req.session.user_id){
    console.info('no user session');
    next();
    return;
  }
  rr.Users.findOne(
    {_id: req.session.user_id}, //#TODO: '_id' is Mongo-specific, should probably be pulled from somewhere
    function(err,user){
      // TODO: handle this error
      if(err){
        app.handleError(err);
      }

      req.user = user;
      next();
    }
  );
};

// ## authenticate
//
//  authenticate!
//
var authenticate = function(req,res,next){
  // ###TODO:  
  //  checking to see if the user object 
  //  exists is not really autentication 
  if(!req.user){
    console.info('user not authenticated, rendering login screen');
    res.render("login.jade", {
      title: 'RaaRaa -- Party People', 
      errors: req.flash('error') 
    });
    return;
  }

  next();
};