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


app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

server.listen(3000, function() {
	console.log(ball);
});