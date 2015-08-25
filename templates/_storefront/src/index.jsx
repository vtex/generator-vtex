import HomePage from 'pages/HomePage';
import { dispatcher } from 'sdk';

let component = {
  name: 'HomePage@<%= vendor %>.<%= name %>',
  constructor: HomePage
};

dispatcher.actions.ComponentActions.register(component);
