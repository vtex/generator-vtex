import { actions } from 'sdk';
import Banner from './Banner';

let component = {
  name: 'Banner@<%= vendor %>.<%= name %>',
  constructor: Banner
};

actions.ComponentActions.register(component);
