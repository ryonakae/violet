var socketIO = require('./dependencies/socket.io.js');
var io = require('./dependencies/sails.io.js')(socketIO);

require('jquery');
require('velocity');

$('#button').on('click', function(){
  io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
    console.log(body);
  });

  $(this).velocity({
    opacity: 0
  },{
    duration: 500
  });
});