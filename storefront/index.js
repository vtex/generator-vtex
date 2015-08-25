'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var vtexsay = require('vtexsay');

var galleryAppGenetaror = require('../app/');

module.exports = galleryAppGenetaror.extend({
  constructor: function() {
    galleryAppGenetaror.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates'));
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: {
    method1: function() {
      this._ask();
    },
    method2: function() {
      var done = this.async();

      var prompts = [{
        type: 'confirm',
        name: 'webpack',
        message: 'Would you like to use standard structure (React + Webpack)?',
        default: true
      }];

      this.prompt(prompts, function (props) {
        this.webpack = props.webpack;

        done();
      }.bind(this));
    }
  },

  _copyStorefrontBasic: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/storefront/*'),
      this.destinationPath('storefront/'),
      {
        name: this.name,
        vendor: this.vendor
      }
    );
    var directories = ['assets', 'models', 'components']
    var self = this;
    directories.forEach(function(directory) {
      self.mkdir('./storefront/' + directory);
    });
  },

  _copyPackageJSON: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/_package.json'),
      this.destinationPath('package.json'),
      {
        name: this.name,
        vendor: this.vendor,
        webpack: this.webpack
      }
    );
  },

  _copyEsLintRC: function() {
    this.fs.copy(
      this.templatePath('_storefront/.eslintrc'),
      this.destinationPath('.eslintrc')
    );
  },

  _copySourceStructure: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/src/**/*'),
      this.destinationPath('src'),
      {
        name: this.name,
        vendor: this.vendor
      }
    );
    var directories = ['components', 'pages', 'styles', 'utils'];
    var self = this;
    directories.forEach(function(directory) {
      self.mkdir('src/' + directory);
    });
  },

  _copyWebpackConfig: function() {
    this.fs.copy(
      this.templatePath('_storefront/webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
  },

  writing: {
    method1: function() {
      this._copyBasic();
    },
    method2: function () {
      this._copyStorefrontBasic();
      if (this.webpack) {
        this._copySourceStructure();
        this.vtexignore.ignore.push('package.json');
        this._copyPackageJSON();
        this._copyWebpackConfig();
      }
    }
  },

  install: function () {
  }
});
