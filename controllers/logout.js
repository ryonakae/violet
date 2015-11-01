module.exports = function(app){
  return {
    logout: function(req, res){
      req.session.destroy();
      res.redirect('/');
      console.log('ログアウトした');
    }
  }
};