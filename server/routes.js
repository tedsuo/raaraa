var stacks = require('./middleware');

// ROUTES
exports.setup = function(app) {
  app.get('/', stacks.standard, function(req,res){
    res.render("index.jade", { title: 'RaaRaa -- Party People' });
  });

  app.get('/stream', stacks.standard, function(req,res){
    res.render("stream.jade", { title: 'RaaRaa -- My Stream' });
  });

  app.post('/img', stacks.streaming, function(req,res){
    // upload a photo
  });
};