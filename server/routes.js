var stacks = require('./middleware'),
    rr = require("../raaraa");

// ROUTES
exports.setup = function(app) {
  app.get('/', stacks.standard, function(req,res){
    res.render("index.jade", { title: 'RaaRaa -- Party People',
                               user: req.session.user });
  });

  app.post("/signup", stacks.standard, function(req, res) {
    rr.Users.signup({ username: req.body.username
                      , password: req.body.password }
                    , function(err, user) {
                      if (err) {
                        req.session.lastError = err;
                      } else {
                        req.session.user = user;
                      }
                      res.redirect("/");
                    });
  });

  app.get('/stream', stacks.standard, function(req,res){
    res.render("stream.jade", { title: 'RaaRaa -- My Stream' });
  });

  app.post('/img', stacks.streaming, function(req,res){
    // upload a photo
  });
};