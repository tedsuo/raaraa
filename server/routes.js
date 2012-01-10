
// ### requires
var middleware = require('./middleware'),
rr = require("../raaraa");

// ## _exports:_ setup(app)
//
//  the routes module returns a setup function, which initializes the router.
//
//  - **app**  express server

exports.setup = function(app) {

// setup the middleware stacks
  var stacks = middleware.getStacks(app);

// # ROUTES
//
// RESTful HTTP API for RaaRaa
 

// ## _GET_ / 
//
// load the main application.
//
  app.get('/', stacks.buffered_private, function(req,res){

    res.render("index.jade", {
      title: 'RaaRaa -- Party People',
      user: req.user,
      compiled_scripts_src: false,
      socket_host: app.host,
      socket_port: app.port,
      script_paths: [
        'raaraa/raaraa-browser.js',
        'raaraa/lib/modelbase.js',

        // models
        'raaraa/models/app.js',
        'raaraa/models/user.js',
        'raaraa/models/party.js',

        'raaraa/lib/viewbase.js',
        
        // views
        'raaraa/views/app.js',
        'raaraa/views/user.js',
        'raaraa/views/party.js',
        
      ]
    });

  });

// ## _POST_ /signup
//
//  - **username**
//  - **password**
//  - **verify**
//
  app.post("/signup", stacks.buffered_public, function(req, res) {
    rr.Users.signup(
      { 
        username: req.body.username,
        password: req.body.password,
        verify: req.body.verify
      }
      , function(err, user) {
        if (err) {
          req.flash('error',err.toString());
          console.error(err.toString());
        } else {
          // TODO - in here we need to set a unique session ID 
          // cookie that the client can use to retrieve the 
          // logged-in user via socket.io
          // Make methods rr.setUser(session_id, user) and 
          // rr.getUser(session_id)
          req.session.user_id = user.id;
          rr.setUser(user.id.toString(), user);
        }
        res.redirect("/");
      }
    );
  });

// ## _POST_ /login
//
//  - **username**
//  - **password**
//
  app.post("/login", stacks.buffered_public, function(req, res) {
    rr.Users.login(
      { 
        username: req.body.username,
        password: req.body.password
      }, 
      function(err, user) {
        if (err) {
          req.flash('error', err.toString());
          console.error(err.toString());
        } else {
          req.session.user_id = user.id;
          rr.setUser(user.id.toString(), user);
          console.info('setting user session '+req.session.user_id);
        }
        res.redirect("/");
      }
    );
  });

// ## _GET_ /logout
  app.get("/logout", stacks.buffered_private, function(req, res) {
    req.session.user_id = null;
    res.redirect("/");
  });

// ## _POST_ /img
// upload a photo!
  app.post('/img', stacks.streaming_private, function(req,res){
    
  });
};