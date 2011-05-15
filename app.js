c = require('connect');

c(
  c.static(__dirname+'/client')
).listen(9002);