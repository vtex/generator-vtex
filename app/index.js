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
      message: 'What\'s your VTEX app name?',
      validate: function(input) {
        var done = this.async();
        if (!new RegExp(/^[a-z\-\_]+$/).test(input)) {
          done("The app name should only contain letters, '-' or '_'.");
        } else {
          done(true);
        }
      }
    }, {
      type: 'input',
      name: 'vendor',
      message: 'What\'s your VTEX account (vendor)?'
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.vendor = props.vendor;

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
        vendor: this.vendor
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
