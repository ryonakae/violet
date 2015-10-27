var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
  render: function(){
    console.log('props: '+this.props);

    return (
      <div>
        <h2>Index</h2>
        <Link to={'/about'}>About</Link>
      </div>
    );
  }
});