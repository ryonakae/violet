var React = require('react');
var Router = require('react-router');
var routes = require('../../routes.jsx');

var initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json') || 'null');

Router.run(routes, Router.HistoryLocation, function(Handler, state) {
  React.render(<Handler params={{data: initialData}}/>, document.getElementById('app'))
});