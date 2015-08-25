'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var vtexsay = require('vtexsay');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates'));

    this.vtexignore = {
      'ignore': ['.git']
    };
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  _ask: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(vtexsay(
      'Welcome to the tremendous ' + chalk.red('VTEX') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      pattern: /^[a-z\-\_]+$/,
      message: 'What\'s your VTEX app name?'
    }, {
      type: 'input',
      name: 'title',
      pattern: /^[a-zA-Z\s\-\,\.]{0,30}$/,
      message: 'What\'s your VTEX app friendly name?'
    }, {
      type: 'input',
      name: 'vendor',
      message: 'What\'s your VTEX account (vendor)?'
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.title = props.title;
      this.vendor = props.vendor;
      this.meta = {};

      done();
    }.bind(this));
  },

  prompting: function () {
    this._ask();
  },

  _copyBasic: function() {
    this.fs.copyTpl(
      this.templatePath('_meta.json'),
      this.destinationPath('meta.json'),
      {
        name: this.name,
        title: this.title,
        vendor: this.vendor,
        meta: this.meta
      }
    );
    this.fs.copyTpl(
      this.templatePath('_vtexignore'),
      this.destinationPath('.vtexignore')
    );
  },

  writing: function() {
    this._copyBasic();
  },

  install: function () {
    /*this.installDependencies({
      skipInstall: this.options['skip-install']
    });*/
  }
});
