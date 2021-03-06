/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    // ログインしてたらdashboardにリダイレクト
    if(req.session.authenticated){
      res.redirect('/dashboard');
    }
    // ログインしてなかったら普通にindex表示
    else {
      var data = [{authenticated: false}];

      res.view('./index', {
        initialData: JSON.stringify(data)
      });
    }
  }
};

