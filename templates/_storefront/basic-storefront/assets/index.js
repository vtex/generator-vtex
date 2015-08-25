var HomePage = React.createClass({
  render: function() {
    return React.createElement("h1", {}, "Olá, mundo!");
  }
})

var component = {
  name: 'HomePage@<%= vendor %>.<%= name %>',
  constructor: HomePage
};

storefront.sdk.dispatcher.actions.ComponentActions.register(component);
