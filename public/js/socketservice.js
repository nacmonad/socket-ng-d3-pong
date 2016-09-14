'use strict';

app.factory('chatSocket', function (socketFactory) {
      var socket = socketFactory();
      socket.forward('broadcast');
      return socket;
  })
.value('messageFormatter', function(date, nick, message) {
    return date.toLocaleTimeString() + ' - ' + 
           nick + ' - ' + 
           message + '\n';
  })