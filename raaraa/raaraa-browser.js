if (!RaaRaa) var RaaRaa = {};

(function() {
  RaaRaa.views = {};
  RaaRaa.collections = {};

  // initialize
  RaaRaa.init = function(options) {
    var socket
      = io.connect("http://" + options.socket.host + ":" + options.socket.port);

    socket.on("get session", function() {
      socket.emit("set session", options.user_id);
    });

    socket.on('current user', function(user_json) {
      var model = new RaaRaa.Users();
      RaaRaa.current_user = model;
      model.set(user_json);
      var badge = new RaaRaa.views.UserBadgeView({
        model: model,
        id: 'header-account',
        template: 'user-badge'
      });
    });

    socket.on('error', function(msg) {
      var model = new RaaRaa.Error(msg);
      var err = new RaaRaa.views.Error({
        model: model,
        id: 'error',
        template: 'error'
      });
    });

    socket.on('close', function() {
      socket.end();
    });

    RaaRaa.socket = socket;
  };

  // get a jade template by name
  RaaRaa.template = _.memoize(function(name) {
    return document.getElementById(name + '-template')
      .innerHTML.trim();
  });

  // cache compiled templates
  var _compiled_templates = {};

  // compile and render a template
  RaaRaa.render = function(name, obj) {
    var el = document.createElement('div')
        , fn;

    if (_compiled_templates[name]) {
      fn = _compiled_templates[name];
    } else {
      var templ = RaaRaa.template(name);
      fn = jade.compile(templ);
      _compiled_templates[name] = fn;
    }
    
    el.innerHTML = fn(obj);
    return el.children[0];
  };

})();
