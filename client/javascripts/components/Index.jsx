var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: false
    };
  },
  componentWillMount: function(){
    this.setState({
      loggedIn: false
    });
  },
  render: function(){
    return (
      <div>
        <h2>Index</h2>
        <ul>
          <li><Link to={'/about'}>About</Link></li>
          <li><a href="/auth">Login with Tumblr</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
    );
  }
});