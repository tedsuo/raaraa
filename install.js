#! node
var fs = require('fs');

var CONFIG_PATH = __dirname+'/config.js';
var CONFIG_EXAMPLE_PATH = __dirname+'/config-sample.js';

fs.stat(CONFIG_PATH, function(err,stats) {
  if(stats && stats.isFile()) return;
  console.log('copying '+CONFIG_EXAMPLE_PATH+' to '+CONFIG_PATH);
  var example = new fs.ReadStream(CONFIG_EXAMPLE_PATH);
  var config = new fs.WriteStream(CONFIG_PATH);
  example.pipe(config);
});