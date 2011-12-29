

var middleware = require('./middleware'),
    rr = require("../raaraa");

// ## exports.setup
//
//  the routes module returns a setup function, which initializes the router.
//
//  - **app**  express server

exports.setup = function(app) {
//  

// setup the middleware stacks
  var stacks = middleware(app);

//

// # ROUTES
//
// RESTful http endpoints for RaaRaa

//    

// ## / 
 
  app.get('/', stacks.buffered_private, function(req,res){
    
    res.render("index.jade", {
      title: 'RaaRaa -- Party People',
      user: req.user 
    });
  });

// ## /signup
//
//  - **username**
//  - **password**
//  - **verify**
//
  app.post("/signup", stacks.buffered_public, function(req, res) {
    rr.Users.signup(
      { username: req.body.username,
        password: req.body.password,
        verify: req.body.verify
      }
      , function(err, user) {
        if (err) {
          req.flash('error',err.toString());
        } else {
          req.session.user_id = user.id;
        }
        res.redirect("/");
      }
    );
  });

// ## /login
//
//  - **username**
//  - **password**
//
  app.post("/login", stacks.buffered_public, function(req, res) {
    rr.Users.login(
      { username: req.body.username,
        password: req.body.password }
      , function(err, user) {
        if (err) {
          req.flash('error', err.toString());
        } else {
          req.session.user_id = user.id;
        }
        res.redirect("/");
      });
  });

// ## /logout
  app.get("/logout", stacks.standard, function(req, res) {
    req.session.user_id = null;
    res.redirect("/");
  });

  app.post('/img', stacks.streaming, function(req,res){
    // upload a photo
  });
};