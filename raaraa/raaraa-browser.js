if (!RaaRaa) var RaaRaa = {};

(function() {
  RaaRaa.views = {};
  RaaRaa.collections = {};

  // initialize
  RaaRaa.init = function(options) {
    var socket
      = io.connect(options.socket.host + ":" + options.socket.port);
    socket.on('connect', function() {
      socket.emit("set session"
                  , $.cookie("sessionID"));
    });
    socket.on('current user', function(user_json) {
      var model = new RaaRaa.Users();
      RaaRaa.current_user = model;
      model.inflate(user_json);
      var badge = new UserBadgeView({
        model: model,
        id: 'header-account',
        template: 'user-badge'
      });
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
