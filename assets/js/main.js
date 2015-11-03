(function(){
  io.socket.on('fromServer', function(msg){
    alert(msg);
  })

  $('#button').on('click', function(){

    io.socket.get('/dashboard/hello', function serverRespondedWith(body, jwr){
      console.dir(body);
    });
  });
})();