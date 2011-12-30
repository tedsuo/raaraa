// # Middleware
//
//  Middleware consists of two pieces: stacks and plugins.  Stacks are layers of
//  middleware plugins, bundled together by type of http request.
//

// ### requires
var express = require('express'),
    createSessionMiddleware = require('connect-cookie-session'),
    config = require('../config')[process.NODE_ENV || 'development'];
// ### constants
var LOG_FORMAT = ':method :url :status :res[content-length] - :response-time ms';


// ## _exports:_ getStacks(app)
//
//  - **app:**  express server
//
module.exports.getStacks = function(app) {  
  return {

// # Middleware Stacks
//

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

// ## logger
//
var logger = express.logger(LOG_FORMAT);

// ## cookie_parser 
//
var cookie_parser = express.cookieParser();

// ## session
//
var session = createSessionMiddleware({secret: config.session_secret });

// ## body_parser
//
var body_parser = express.bodyParser();

// ## get\_current\_user
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
var authenticate = function(req,res,next){
  // TODO: 
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