import { actions } from 'sdk';
import <%= componentName %> from './<%= componentName %>';

let component = {
  name: '<%= componentName %>@<%= vendor %>.<%= name %>',
  constructor: <%= componentName %>
};

actions.ComponentActions.register(component);

// Enable react hot loading with external React
// see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react
if (module.hot) {
  window.RootInstanceProvider = require('react-hot-loader/Injection').RootInstanceProvider;
}
