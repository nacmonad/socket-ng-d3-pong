var express = require('express'),
    io = require('socket.io'),
    http = require('http'),
    app = express(),
    path = require('path'),
    server = http.createServer(app),
    io = io.listen(server);


//socket routines

var paddleOne = require('./game/paddle')("PlayerOne");
var paddleTwo = require('./game/paddle')("PlayerTwo");
var ball = require('./game/ball')(paddleOne,paddleTwo);

var base = require('./sockets/base')(io, ball,paddleOne,paddleTwo);


app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));


server.listen(app.get('port'),app.get('ip'), function() {
	console.log('Server instantiated at ' + Date.now());
    console.log('Listening @' + app.get('ip') + ' on port '+ app.get('port'));
});