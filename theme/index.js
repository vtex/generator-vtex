'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var vtexsay = require('vtexsay');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.appname = this.appname;
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(vtexsay(
      'Welcome to the tremendous ' + chalk.red('VTEX Theme') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s your theme name?',
      default: this.appname
    }, {
      type: 'input',
      name: 'owner',
      message: 'What\'s your VTEX account?'
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.owner = props.owner;

      done();
    }.bind(this));
  },

  writing: {
    theme: function () {
      this.fs.copyTpl(
        this.templatePath('_meta.json'),
        this.destinationPath('meta.json'),
        {
          name: this.name,
          owner: this.owner
        }
      );
      this.fs.copy(
        this.templatePath('.vtexignore'),
        this.destinationPath('.vtexignore')
      );
      this.fs.copy(
        this.templatePath('storefront/**/*'),
        this.destinationPath('storefront/')
      );
      var directories = ['assets', 'models', 'pages', 'partials', 'widgets']
      var self = this;
      directories.forEach(function(directory) {
        self.mkdir('storefront/' + directory);
      });
    },
  },

  install: function () {
  }
});
