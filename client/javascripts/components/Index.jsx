var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var io = require('socket.io-client');
var url = 'http://192.168.1.6:3000';
var options = {
  'force new connection': true,
  port: 3000
};
var socket = io.connect(url, options);

module.exports = React.createClass({
  clickEvent: function(){
    socket.emit('clickEvent', 'クライアントから送ったイベント');
  },
  componentDidMount: function(){
    console.log('Indexがマウントされた');
    socket.on('testEvent', function(msg){
      alert(msg);
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
        <div onClick={this.clickEvent} style={{'cursor':'pointer'}}>emit clickEvent</div>
      </div>
    );
  }
});