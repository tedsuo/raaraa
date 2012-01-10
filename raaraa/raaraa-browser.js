if (!RaaRaa) var RaaRaa = {};

(function() {
  RaaRaa.views = {};
  RaaRaa.collections = {};

  // initialize
  RaaRaa.init = function(options) {
    var app_model = new RaaRaa.App();

    var socket
      = io.connect("http://" + options.socket.host + ":" + options.socket.port);

    socket.on("get session", function() {
      console.debug("responding to session handshake");
      socket.emit("set session", options.user_id);
    });

    socket.on('current user', function(user_json) {
      console.debug("got current user");
      var model = new RaaRaa.Users();
      model.set(user_json);

      app_model.set({ current_user: model });

      RaaRaa.user_badge = new RaaRaa.views.UserBadgeView({
        model: model,
      });

      RaaRaa.user_badge.render();

      socket.disconnect();
    });

    socket.on('error', function(msg) {
      console.error(msg);
/*      var model = new RaaRaa.Error(msg);
      var err = new RaaRaa.views.Error({
        model: model,
        id: 'error',
        template: 'error'
      });*/
    });

    socket.on('close', function() {
      console.debug("closing socket");
      socket.socket.disconnect();
    });

    RaaRaa.socket = socket;

    var main_page_view = new RaaRaa.views.MainPage({
      model: app_model
    });
  };

  RaaRaa.template = function(name) {
    return $("#"+name+"-template").html().trim();
  };

  var _compiled_templates = {};

  var renderTemplate = function(name) {
    var templ = RaaRaa.template(name);
    var fn = _compiled_templates[name]
      = _compiled_templates[name] || jade.compile(templ);
    return fn;
  };

  // compile and render a template
  RaaRaa.render = function(name, obj) {
    var el = document.createElement('div');
    
    var fn = renderTemplate(name);

    return fn(obj);
  };

})();
