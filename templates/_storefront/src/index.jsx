import HomePage from 'pages/HomePage';
import { dispatcher } from 'sdk';

let component = {
  name: 'HomePage@<%= vendor %>.<%= name %>',
  constructor: HomePage
};

dispatcher.actions.ComponentActions.register(component);

// Enable react hot loading with external React
// see https://github.com/gaearon/react-hot-loader/tree/master/docs#usage-with-external-react
if (module.hot) {
  window.RootInstanceProvider = require('react-hot-loader/Injection').RootInstanceProvider;
}
