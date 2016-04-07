'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var vtexsay = require('vtexsay');
var fs = require('fs');

var updateWebpackConfig = require('../utils/updateWebpackConfig');
var galleryAppGenetaror = require('../app/');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates'));
  },

  initializing: function () {
    this.manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    this.pkg = require('../package.json');
  },

  prompting: {
    method1: function() {
      var done = this.async();
      var self = this;

      this.log(vtexsay(
        'Welcome to the tremendous ' + chalk.red('VTEX') + ' generator!'
      ));

      var prompts = [{
        message: 'What type of component do you want to generate?',
        choices: ['Component', 'Page'],
        name: 'componentType',
        type: 'list'
      }, {
        message: 'What\'s the component name? (eg: ProductPage)',
        type: 'input',
        name: 'componentName',
        validate: function(input) {
          var done = this.async();
          if (!new RegExp(/^[A-z\-\_]+$/).test(input)) {
            done("The component name should only contain letters, '-' or '_'.");
          } else {
            done(true);
          }
        }
      }];

      self.prompt(prompts, function(props) {
        self.componentType = props.componentType;
        self.componentName = props.componentName;

        if (self.componentType === 'Page') {
          self.prompt([{
            message: 'What\'s the route\'s name? (eg: product)',
            type: 'input',
            name: 'routeName',
            validate: function(input) {
              if (!new RegExp(/^[a-z]+$/).test(input)) {
                return "The route name should only contain lowercase letters.";
              };
              return true;
            }
          }, {
            message: 'What\'s the route\'s path? (eg: /:product/p)',
            type: 'input',
            name: 'routePath'
          }], function(routeProps) {
            self.routeName = routeProps.routeName;
            self.routePath = routeProps.routePath;

            done();
          });
        } else {
          done();
        }
      }.bind(this));
    }
  },

  _copyComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.js'),
      this.destinationPath('src/components/' + this.componentName + '/' + this.componentName + '.js'),
      {
        componentName: this.componentName
      }
    );

    this.fs.copyTpl(
      this.templatePath('components/index.js'),
      this.destinationPath('src/components/' + this.componentName + '/index.js'),
      {
        componentName: this.componentName,
        vendor: this.manifest.vendor,
        name: this.manifest.name
      }
    );
  },

  _copyPageRoute: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/routes/path.json'),
      this.destinationPath('storefront/routes/' + this.routeName + '.json'),
      {
        routePath: this.routePath
      }
    );
  },

  _copyRootComponent: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/settings/routes/route/Root@vtex.storefront-sdk/content.json'),
      this.destinationPath('storefront/settings/routes/' + this.routeName + '/Root@vtex.storefront-sdk/content.json'),
      {
        componentName: this.componentName + "@" + this.manifest.vendor + "." + this.manifest.name,
      }
    );
  },

  _copyComponentDefinition: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.json'),
      this.destinationPath('storefront/components/' + this.componentName + '.json'),
      {
        componentName: this.componentName,
        page: (this.componentType === 'Page'),
        routeName: this.routeName,
        routePath: this.routePath
      }
    );
  },

  _updateWebpackConfig: function(config) {
    var context = {};
    if (config.isEditor) {
      Object.getOwnPropertyNames(this).forEach(function(prop) {
        context[prop] = this[prop];
      }, this);

      context.isEditor = true;
    } else {
      context = this;
    }

    var source = fs.readFileSync('webpack.config.js', 'utf8');
    var newSource = updateWebpackConfig(source, context);
    this.write('webpack.config.js', newSource);
  },

  writing: {
    method1: function() {
      switch (this.componentType) {
        case 'Component':
          this._copyComponent();
          this._copyComponentDefinition();
          break;
        case 'Page':
          this._copyComponent();
          this._copyPageRoute();
          this._copyRootComponent();
          this._copyComponentDefinition();
          this._updateWebpackConfig(this);
          break;
      }
    }
  }
});
