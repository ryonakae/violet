'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
  render: function(){
    return (
      <div className="index">
        <div>
          <h2>login</h2>
          <Link to={'/auth/tumblr'}>login with tumblr</Link>
        </div>

        <div>
          <h2>login</h2>
          <Link to={'/logout'}>logout</Link>
        </div>
      </div>
    );
  }
});