'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
  render: function(){
    return (
      <div className="notfound">
        <p>not found</p>
        <Link to={'/'}>back to top</Link>
      </div>
    );
  }
});