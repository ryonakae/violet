(function(){
  $('#button').on('click', function(){
    io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
      console.log(body);
    });
  });
})();