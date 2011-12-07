exports.name = "Main";
exports.routes = [
  [ '/', function(req, res) {
    req.rr.renderView("jade", "index", { title: 'RaaRaa -- Party People' });
  }],
];