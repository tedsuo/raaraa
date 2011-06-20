var express = require('express');

var app = express.createServer(express.logger(), express.bodyParser());

app.get('/', function(req, res){
	res.end();
	//res.render('index.jade', { title: 'My Site' });
});

app.configure(function(
	app.use(express.static(__dirname + '/public/old'));
	app.use(express.cookieParser());
	app.use(express.session());
));

app.listen(9002);

console.log('RaaRaa listening on port 9002');
