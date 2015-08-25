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
      var self = this;

      var prompts = [{
        type: 'confirm',
        name: 'webpack',
        message: 'Would you like to use standard structure (React + Webpack)?',
        default: true
      }];

      this.prompt(prompts, function (props) {
        self.meta = { storefront: true };
        self.webpack = props.webpack;

        if (self.webpack) {
          self.prompt({
            type: 'confirm',
            name: 'installNodeDependencies',
            message: 'Install node dependencies?',
            default: true
          }, function(answer) {
            self.installNodeDependencies = answer.installNodeDependencies;
            done();
          })
        } else {
          self.installNodeDependencies = false;
          done();
        }

      }.bind(this));
    }
  },

  _createStorefrontDirectories: function() {
    this.mkdir('storefront');

    this.mkdir('storefront/assets');
    this.mkdir('storefront/resources');
    this.mkdir('storefront/components');
  },

  _copyStorefrontBasic: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/basic-storefront/**/*'),
      this.destinationPath('storefront/'),
      {
        name: this.name,
        vendor: this.vendor
      }
    );
  },

  _copyStorefrontDev: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/*'),
      this.destinationPath('storefront/'),
      {
        name: this.name,
        vendor: this.vendor
      }
    );
  },

  _copyGitignore: function() {
    this.fs.copyTpl(
      this.templatePath('_storefront/_gitignore'),
      this.destinationPath('.gitignore'),
      {
        name: this.name,
        vendor: this.vendor
      }
    );
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
      this.templatePath('_storefront/eslintrc'),
      this.destinationPath('.eslintrc')
    );
  },

  _copyWebpackConfig: function() {
    this.fs.copy(
      this.templatePath('_storefront/webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
  },

  _createSourceDirectories: function() {
    this.mkdir('src/');

    this.mkdir('src/editors');
    this.mkdir('src/assets');
    this.mkdir('src/components');
    this.mkdir('src/pages');
    this.mkdir('src/styles');
    this.mkdir('src/utils');
  },

  _copySourceExampleFiles: function() {
    var options = {
      name: this.name,
      vendor: this.vendor
    };

    this.fs.copyTpl(
      this.templatePath('_storefront/src/pages/HomePage.jsx'),
      this.destinationPath('src/pages/HomePage.jsx'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/styles/style.less'),
      this.destinationPath('src/styles/style.less'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/index.jsx'),
      this.destinationPath('src/' + this.name + '.jsx'),
      options
    );
  },

  writing: {
    method1: function() {
      this._copyBasic();
    },
    method2: function () {
      this._createStorefrontDirectories();
      this._copyGitignore();

      if (this.webpack) {
        this._createSourceDirectories();
        this._copyStorefrontDev();
        this._copySourceExampleFiles();
        this._copyPackageJSON();
        this._copyWebpackConfig();
      } else {
        this._copyStorefrontBasic();
      }
    }
  },

  install: function () {
    if (this.webpack) {
      this.installDependencies({ skipInstall: !this.installNodeDependencies });
    }
  }
});
