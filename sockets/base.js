module.exports = function(io,ball,paddleOne,paddleTwo) {

function base (io, ball, paddleOne, paddleTwo) {
  'use strict';
  //connections
  var users = [];
  var userlist = {};
  var paddleSpeed =5;
  var parent = this;
  parent.p1moveup = false;
  parent.p1movedown = false;
  parent.p2moveup = false;
  parent.p2movedown = false;

  io.on('connection', function (socket) {
    console.log("User " + socket.id + " connected.");
    users.push({id:socket.id.substring(2), nickname:"anonymous"});
   
    //broadcast userlist
    io.sockets.emit('broadcast', {
        payload: users,
        source: "userlist"
      });

    socket.on('message', function (from, msg) {
      console.log('id: ', socket.id,'nick:', 
                  from, 'msg:', JSON.stringify(msg));
      users.forEach(function(e,i) {
        if(e.id == socket.id.substring(2)) { users[i].nickname=from}
      });
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });

       //broadcast userlist
      io.sockets.emit('broadcast', {
          payload: users,
          source: "userlist"
        });
    });






     socket.on('move', function (from, msg) {
      //set movement bool flags to be processed before broadcast

      if(from == paddleOne.name) {
        if (msg == " UP") { parent.p1moveup=true;}
        if (msg == " up") { parent.p1moveup=false;}
        if (msg == " DOWN") { parent.p1movedown=true;}
        if (msg == " down") { parent.p1movedown=false;}
      }
      if(from == paddleTwo.name) {

        if(msg == " UP") { parent.p2moveup=true;}
        if (msg == " up") { parent.p2moveup=false;}
        if (msg == " DOWN") { parent.p2movedown=true;}
        if (msg == " down") { parent.p2movedown=false;}
      }
    });

    socket.on('start', function(from,msg) {
      console.log("start request from", from, 'msg', JSON.stringify(msg));
      if(!timer) { start(); }  
     });

    socket.on('reset', function (from, msg) {
      console.log('reset message from', 
                  from, 'msg', JSON.stringify(msg));
      ball.reset();
      paddleOne.score =0;
      paddleTwo.score = 0;

    });

    socket.on('stop', function (from, msg) {
      console.log('stop message from', 
                  from, 'msg', JSON.stringify(msg));
      if(timer) {clearInterval(timer);timer=false}

    });

    socket.on('disconnect', function() {
      console.log("User " + socket.id + " disconnected.");
      users.forEach(function(e,i) {
        if(e.id == socket.id.substring(2)) { users.splice(i,1)}
      });
      console.log("Active users: ");
      console.log(users);
      //broadcast userlist
      io.sockets.emit('broadcast', {
          payload: users,
          source: "userlist"
        });
    })

  });


  //gamevars

  var timer;


  var start = function () {
    //this is our "render" function which spits broadcasts the data model out 50 fps
     timer = setInterval(function() {
        //move ball
        ball.move();
        //move paddles

        if(parent.p1moveup) { paddleOne.moveup(paddleSpeed)}
        if(parent.p1movedown) { paddleOne.movedown(paddleSpeed)}
        if(parent.p2moveup) { paddleTwo.moveup(paddleSpeed)}
        if(parent.p2movedown) { paddleTwo.movedown(paddleSpeed)}

        //broadcast data model to clients
        io.sockets.volatile.emit('broadcast', {
            payload: { x: ball.x, y:ball.y, pos1y:paddleOne.posy, pos2y:paddleTwo.posy, p1score:paddleOne.score, p2score:paddleTwo.score },
            source: "ball"
          });
      } , 20);
    }

  this.getUsers = function() {
    return users;
  }
};

return new base(io,ball,paddleOne,paddleTwo);
}