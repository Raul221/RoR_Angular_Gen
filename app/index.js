'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var AngularWithRequireGenerator = module.exports = function AngularWithRequireGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  
  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AngularWithRequireGenerator, yeoman.generators.Base);

AngularWithRequireGenerator.prototype.askForCSSFramework = function askForCSSFramework() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'list',
    name: 'cssFramework',
    message: 'What CSS framework would you like to include?',
    choices: [{
      name: 'SASS Bootstrap',
      value: 'SASSBootstrap'
    }, {
      name: 'Native Bootstrap',
      value: 'NativeBootstrap'
    }, {
      name: 'SASS Compass framework',
      value: 'CompassFramework'
    }]
  }];

  this.prompt(prompts, function (props) {
    this.cssFramework = props.cssFramework;
    cb();
  }.bind(this));
};

AngularWithRequireGenerator.prototype.askForJSFile = function askForJSFile() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'jsFile',
    message: 'What utils would you like to include?',
    choices: [{
      name: 'Underscore.js',
      value: 'includeUnderscore',
      checked: true
    }, {
      name: 'Angular UI-Bootstrap',
      value: 'includeUIBootstrap',
      checked: true
    }, {
      name: 'Jasmine Testing framework',
      value: 'includeJasmine',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    function includeJS(js) { return props.jsFile.indexOf(js) !== -1; }

    // JS
    this.includeUnderscore = includeJS('includeUnderscore');
    this.includeUIBootstrap = includeJS('includeUIBootstrap');
    this.includeJasmine = includeJS('includeJasmine');

    if (this.includeJasmine) { this.testFramework = 'jasmine'; }
    
    cb();
  }.bind(this));
};

AngularWithRequireGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AngularWithRequireGenerator.prototype.packageJSON= function packageJSON() {
  this.template('_package.json', 'package.json');
};

AngularWithRequireGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

AngularWithRequireGenerator.prototype.jshint = function jshint() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

AngularWithRequireGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
  this.template('index.html', 'app/index.html');
  this.template('partials/home.html', 'app/partials/home.html');
};

AngularWithRequireGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var cssFile = 'style.' + (this.cssFramework !== 'NativeBootstrap' ? 's' : '') + 'css',
      header = '',
      content = this.readFileAsString(path.join(this.sourceRoot(), 'main.scss'));

  if (this.cssFramework === 'SASSBootstrap' || this.cssFramework === 'NativeBootstrap') {
      content += this.readFileAsString(path.join(this.sourceRoot(), 'bootstrap.css'));
  }

  switch(this.cssFramework) {
    case 'CompassFramework':
      header += "@import 'compass';\n" + 
        "@import 'compass/reset';\n";
      break;
    case 'SASSBootstrap':
      header += "$icon-font-path: '../bower_components/sass-bootstrap/fonts/';\n" +
          "@import '../bower_components/sass-bootstrap/lib/bootstrap';\n";
      break;
  }
  if (this.cssFramework !== 'NativeBootstrap') {
      header += "@import 'custom_mixins.scss';\n";
      this.copy('_custom_mixins.scss', 'app/styles/_custom_mixins.scss');
  }
  this.write('app/styles/' + cssFile, header + content);
};

AngularWithRequireGenerator.prototype.jsFile = function jsFile() {
  var prefix = 'app/scripts';
  this.mkdir(prefix);
  this.copy('scripts/main.js', prefix + '/main.js');
  this.copy('scripts/controllers.js', prefix + '/controllers/controllers.js');
  this.copy('scripts/directives.js', prefix + '/directives/directives.js');
  this.copy('scripts/filters.js', prefix + '/filters/filters.js');
  this.copy('scripts/services.js', prefix + '/services/services.js');
};

AngularWithRequireGenerator.prototype.app = function app() {
  this.mkdir('app/images');
  this.mkdir('app/partials');
  this.mkdir('app/scripts/vendor');
  this.mkdir('config');
  this.mkdir('test');
};

AngularWithRequireGenerator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function() {
      var projectDir = process.cwd() + '/app';
      fs.exists(projectDir + '/scripts/vendor/require.js', function(exists) {
        if (!exists) {
          fs.createReadStream(projectDir + '/bower_components/requirejs/require.js')
          .pipe(fs.createWriteStream(projectDir + '/scripts/vendor/require.js'));
        }
      });
    }
  });
};

