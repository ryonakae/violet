'use strict';

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

// components
var App = require('./components/App');
var Index = require('./components/Index');
var NotFound = require('./components/NotFound');

// routes
var routes = (
  <Route name="App" path="/" handler={App}>
    <DefaultRoute handler={Index} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

// render
Router.run(routes, Router.HistoryLocation, function(Handler){
  React.render(
    React.createElement(Handler, {}),
    document.getElementById('app')
  );
});