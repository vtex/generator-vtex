import { actions } from 'sdk';
import <%= componentName %> from './<%= componentName %>';

let component = {
  name: '<%= componentName %>@<%= vendor %>.<%= name %>',
  constructor: <%= componentName %>
};

actions.ComponentActions.register(component);
