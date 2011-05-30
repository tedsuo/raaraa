c = require('connect');

c(
  c.static(__dirname+'/client')
).listen(9002);

console.log('RaaRaa litening on port 9002');