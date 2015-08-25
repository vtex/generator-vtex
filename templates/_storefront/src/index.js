import Home from 'pages/Home';
import { dispatcher } from 'sdk';

let component = {
  name: 'HomePage@<%= vendor %>.<%= name %>',
  constructor: Home
};

dispatcher.actions.ComponentActions.register(component);
