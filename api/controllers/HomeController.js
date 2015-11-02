/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    res.view({
      title: 'Violet for Tumblr',
      user: req.user
    });
    console.log('req.user: ', req.user);
    console.log('req.session: ', req.session);
  }
};

