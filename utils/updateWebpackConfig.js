var program = require('ast-query');
var chalk = require('chalk');
var find = require('lodash.find');

function updateEntryPoints(ast, context) {
  var value = ast.var('config');

  if (value && value.nodes && value.nodes[0] && value.nodes[0].init && value.nodes[0].init.properties.length > 0) {
    var properties = value.nodes[0].init.properties;
    var entry = find(properties, function(prop) {
      if (prop.key && prop.key.name === 'entry') {
        return prop;
      }
    })
    if (entry && entry.value.properties.length > 0) {
      entry.value.properties.push({
        type: 'Property',
        key: {
          type: 'Literal',
          value: context.componentName
        },
        value: {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'Literal',
              value: './src/components/' + context.componentName + '/index.js'
            },
          ]
        }
      });
      return ast;
    }
  }

  context.log(chalk.yellow('\nCould not find variable "config" in "webpack.config.js"!\n'));
  return ast;
}

function update(source, context) {
  var ast = program(source, { format: { indent: { style: '  ' } } });
  ast = updateEntryPoints(ast, context);

  return ast.toString();
}

module.exports = update;
