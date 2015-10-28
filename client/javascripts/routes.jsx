var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App.jsx');
var Index = require('./components/Index.jsx');
var About = require('./components/About.jsx');
var Auth = require('./components/Auth.jsx');
var Login = require('./components/Login.jsx');
var Logout = require('./components/Logout.jsx');

module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Index} />
    <Route path="/about" handler={About} />
    <Route path="/auth" handler={Auth} />
    <Route path="/login" handler={Login} />
    <Route path="/logout" handler={Logout} />
  </Route>
);