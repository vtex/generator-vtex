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
    this.meta = JSON.parse(fs.readFileSync('meta.json', 'utf8'));
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
        choices: ['Component', 'Page', 'Editor', 'Utils'],
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
  },

  _copyPageComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.js'),
      this.destinationPath('src/pages/' + this.componentName + '/' + this.componentName + '.js'),
      {
        componentName: this.componentName
      }
    );

    this.fs.copyTpl(
      this.templatePath('components/index.js'),
      this.destinationPath('src/pages/' + this.componentName + '/index.js'),
      {
        componentName: this.componentName,
        vendor: this.meta.vendor,
        name: this.meta.name
      }
    );
  },

  _copyEditorComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.js'),
      this.destinationPath('src/editors/' + this.componentName + '.js'),
      {
        componentName: this.componentName
      }
    );
  },

  _copyUtilsComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.js'),
      this.destinationPath('src/utils/' + this.componentName + '.js'),
      {
        componentName: this.componentName
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

  _updateWebpackConfig: function() {
    var source = fs.readFileSync('webpack.config.js', 'utf8');
    var newSource = updateWebpackConfig(source, this);
    this.write('webpack.config.js', newSource);
  },

  writing: {
    method1: function() {
      switch (this.componentType) {
        case 'Component':
          this._copyComponent();
          break;
        case 'Page':
          this._copyPageComponent();
          this._copyComponentDefinition();
          this._updateWebpackConfig();
          break;
        case 'Editor':
          this._copyEditorComponent();
          break;
        case 'Utils':
          this._copyUtilsComponent();
          break;
      }
    }
  }
});
