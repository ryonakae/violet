var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;


module.exports = React.createClass({
  render: function(){
    return (
      <div className='app'>
        <RouteHandler {...this.props} />
      </div>
    );
  }
});