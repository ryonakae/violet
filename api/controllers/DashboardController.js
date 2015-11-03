/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    res.view({
      title: 'Violet for Tumblr',
      user: req.user
    });
    console.log('req.user: ', req.user);
  }
};

