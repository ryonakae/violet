var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var io = require('socket.io-client');
var url = 'http://localhost:3000';
var options = {
  'force new connection': true,
  port: 3000
};
var socket = io.connect(url, options);

module.exports = React.createClass({
  testEvent: function(){
    console.log('testEventがemitしたはず');
    socket.emit('testEvent', 'クライアントから送った情報ぞいや');
  },
  componentDidMount: function(){
    console.log('Indexがマウントされたぞ');
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
        <div onClick={this.testEvent} style={{'cursor':'pointer'}}>emit testEvent</div>
      </div>
    );
  }
});