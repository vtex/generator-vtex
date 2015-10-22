import { actions } from 'sdk';
import HomePage from './HomePage';

let component = {
  name: 'HomePage@<%= vendor %>.<%= name %>',
  constructor: HomePage
};

actions.ComponentActions.register(component);
