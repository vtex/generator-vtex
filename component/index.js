'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var galleryAppGenetaror = require('../app/');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates'));
  },

  initializing: function () {
    this.meta = JSON.parse(this.readFileAsString('meta.json'));
    this.pkg = require('../package.json');
  },

  prompting: {
    method1: function() {
      var done = this.async();
      var self = this;

      var prompts = [{
        message: 'What type of component do you want to generate?',
        choices: ['Component', 'Page', 'Editor', 'Utils'],
        name: 'componentType',
        type: 'list'
      }, {
        message: 'What\'s the component name?',
        type: 'input',
        name: 'componentName',
        pattern: /^[a-z\-\_]+$/
      }];

      self.prompt(prompts, function (props) {
        self.componentType = props.componentType;
        self.componentName = props.componentName;

        done();
      }.bind(this));
    }
  },

  _copyComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.jsx'),
      this.destinationPath('src/components/' + this.componentName + '.jsx'),
      {
        componentName: this.componentName
      }
    );
  },

  _copyPageComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.jsx'),
      this.destinationPath('src/pages/' + this.componentName + '.jsx'),
      {
        componentName: this.componentName
      }
    );
  },

  _copyEditorComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.jsx'),
      this.destinationPath('src/editors/' + this.componentName + '.jsx'),
      {
        componentName: this.componentName
      }
    );
  },

  _copyUtilsComponent: function() {
    this.fs.copyTpl(
      this.templatePath('components/Component.jsx'),
      this.destinationPath('src/utils/' + this.componentName + '.jsx'),
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
        appName: this.meta.name,
      }
    );
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
