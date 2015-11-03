var socketIO = require('./dependencies/socket.io');
var io = require('./dependencies/sails.io')(socketIO);
var $ = require('./dependencies/jquery.min');

(function(){
  $('#button').on('click', function(){
    io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
      console.log(body);
    });
  });
})();