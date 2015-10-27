var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

module.exports = React.createClass({
  render: function(){
    // console.log(this.props.data);

    return (
      <div>
        <h2>Index</h2>
        <h3>{this.props.data.posts[0].title}</h3>
        <div dangerouslySetInnerHTML={{__html: this.props.data.posts[0].body}} />
        <Link to={'/about'}>About</Link>
      </div>
    );
  }
});