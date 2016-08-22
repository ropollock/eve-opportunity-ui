import angular from 'angular';
let lodash = require('lodash');

// angular modules
import constants from './constants';
import onConfig  from './on_config';
import onRun     from './on_run';
import 'angular-ui-router';
import './market-browser';
import './templates';

// create and bootstrap application
const requires = [
  'ui.router',
  'eve.market',
  'templates'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);
angular.module('app').constant('_', lodash);
angular.module('app').config(onConfig);
angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
  strictDi: true
});
