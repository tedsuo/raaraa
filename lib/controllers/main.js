exports.name = "Main";
exports.routes = [
  [ '/', function(req, res) {
      req.rr.renderView("Jade", req, res, "index", { title: 'RaaRaa -- Party People' });
  }],
];