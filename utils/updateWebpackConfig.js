var program = require('ast-query');

function updateHotEntryPoints(ast, context) {
  var value = ast.var('hotEntryPoints');

  if (value && value.nodes && value.nodes[0] && value.nodes[0].init && value.nodes[0].init.properties.length > 0) {
    var properties = value.nodes[0].init.properties;
    properties.push({
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
            value: 'webpack-dev-server/client?http://127.0.0.1:3000'
          },
          {
            type: 'Literal',
            value: 'webpack/hot/only-dev-server'
          },
          {
            type: 'Literal',
            value: '.src/' + context.componentName + '/index.js'
          },
        ]
      }
    });
  }

  return ast;
}

function updateColdEntryPoints(ast, context) {
  var value = ast.var('coldEntryPoints');

  if (value && value.nodes && value.nodes[0] && value.nodes[0].init && value.nodes[0].init.properties.length > 0) {
    var properties = value.nodes[0].init.properties;
    console.log(properties);
    properties.push({
      type: 'Property',
      key: {
        type: 'Literal',
        value: context.componentName
      },
      value: {
        type: 'Literal',
        value: '.src/' + context.componentName + '/index.js'
      }
    });
    console.log(properties);
  }

  return ast;
}

function update(source, context) {
  var ast = program(source, { format: { indent: { style: '  ' } } });
  ast = updateHotEntryPoints(ast, context);
  ast = updateColdEntryPoints(ast, context);

  return ast.toString();
}

module.exports = update;
