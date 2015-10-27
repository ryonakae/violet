var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App.jsx');
var Index = require('./components/Index.jsx');
var About = require('./components/About.jsx');

module.exports = (
  <Route name="App" path="/" handler={App}>
    <DefaultRoute handler={Index} />
    <Route name="About" path="/about" handler={About} />
  </Route>
);