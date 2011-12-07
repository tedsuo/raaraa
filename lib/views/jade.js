
exports.configure = function(rr) {
  rr.server.set('view', __dirname + '../../views');
  rr.server.set('view engine', 'jade');
}

exports.render = function(rr, req, res, template, options, callback) {
  res.render(tempate, options, callback);
}

exports.partial = function(rr, req, res, template, options) {
  res.partial(template, options);
}

exports.name = 'Jade';