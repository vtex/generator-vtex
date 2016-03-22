'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var vtexsay = require('vtexsay');
var mkdirp = require('mkdirp');

var galleryAppGenetaror = require('../app/');

module.exports = galleryAppGenetaror.extend({
  constructor: function() {
    galleryAppGenetaror.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates'));

    this.option('simple');
    this.simple = this.options.simple;
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: {
    method1: function() {
      this._ask();
    },
    method2: function() {
      if (!this.simple) {
        var done = this.async();
        var self = this;

        var prompts = [{
          type: 'confirm',
          name: 'webpack',
          message: 'Would you like to use the standard dev structure (ES6/7 + LESS + Webpack + eslint)?',
          default: true
        }];

        this.prompt(prompts, function (props) {
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
        });
      }
    }
  },

  _createDirectoryCallback: function(err) {
    if (err) {
      this.log(err);
    }
  },

  _createStorefrontDirectories: function() {
    mkdirp('storefront/assets', this._createDirectoryCallback.bind(this));
    mkdirp('storefront/resources', this._createDirectoryCallback.bind(this));
    mkdirp('storefront/settings/components', this._createDirectoryCallback.bind(this));
    mkdirp('storefront/settings/routes', this._createDirectoryCallback.bind(this));
    mkdirp('storefront/routes', this._createDirectoryCallback.bind(this));
    mkdirp('storefront/components', this._createDirectoryCallback.bind(this));
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
    var options = {
      name: this.name,
      vendor: this.vendor,
      componentName: "HomePage@" + this.vendor + "." + this.name
    };

    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/components/HomePage.json'),
      this.destinationPath('storefront/components/HomePage.json'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/routes/home.json'),
      this.destinationPath('storefront/routes/home.json'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/dev-storefront/components/Root.json'),
      this.destinationPath('storefront/settings/routes/home/Root@vtex.storefront-sdk/content.json'),
      {
        componentName: options.componentName
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
    mkdirp('src/assets', this._createDirectoryCallback.bind(this));
    mkdirp('src/components', this._createDirectoryCallback.bind(this));
    mkdirp('src/editors', this._createDirectoryCallback.bind(this));
    mkdirp('src/utils', this._createDirectoryCallback.bind(this));
  },

  _copySourceExampleFiles: function() {
    var options = {
      name: this.name,
      vendor: this.vendor
    };

    this.fs.copyTpl(
      this.templatePath('_storefront/src/components/HelloWorld/HelloWorld.js'),
      this.destinationPath('src/components/HelloWorld/HelloWorld.js'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/pages/HomePage/HomePage.js'),
      this.destinationPath('src/components/HomePage/HomePage.js'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/pages/HomePage/HomePage.less'),
      this.destinationPath('src/components/HomePage/HomePage.less'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/pages/HomePage/index.js'),
      this.destinationPath('src/components/HomePage/index.js'),
      options
    );

   this.fs.copyTpl(
      this.templatePath('_storefront/src/pages/HomePage/index.js'),
      this.destinationPath('src/components/HomePage/index.js'),
      options
    );

    this.fs.copyTpl(
      this.templatePath('_storefront/src/editors/index.js'),
      this.destinationPath('src/editors/index.js'),
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
        this._copyEsLintRC();
      } else {
        this._copyStorefrontBasic();
      }
    }
  },

  install: function () {
    if (this.webpack && this.installNodeDependencies) {
      this.installDependencies({ bower: false });
    }
  }
});
