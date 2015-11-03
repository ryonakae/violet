/**
 * AboutController
 *
 * @description :: Server-side logic for managing abouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    res.view('./index', {
      title: 'About'
    });
  }
};

