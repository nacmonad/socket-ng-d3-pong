var express = require ('express');
var app = express();
var path = require('path');

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
	console.log("sending from " + path)
});

app.listen(8080);	