var middleware = require('./middleware'),
    rr = require("../raaraa");

// ROUTES
exports.setup = function(app) {
  var stacks = middleware(app);
  app.get('/', stacks.standard, function(req,res){
    if(!req.user){
      res.render("login.jade", {
        title: 'RaaRaa -- Party People', 
        errors: req.flash('error') 
      });
      return;
    }
    res.render("index.jade", {
      title: 'RaaRaa -- Party People',
      user: req.user 
    });
  });

  app.post("/signup", stacks.standard, function(req, res) {
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

  app.post("/login", stacks.standard, function(req, res) {
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

  app.get("/logout", stacks.standard, function(req, res) {
    req.session.user_id = null;
    res.redirect("/");
  });

  app.get('/stream', stacks.standard, function(req,res){
    res.render("stream.jade", { title: 'RaaRaa -- My Stream' });
  });

  app.post('/img', stacks.streaming, function(req,res){
    // upload a photo
  });
};