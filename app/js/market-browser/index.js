import angular from 'angular';
import 'angular-material';
import 'angular-messages';
import './../cache';
import './../crest';
import './../api';
import 'highcharts-ng';

const bulk = require('bulk-require');
const marketBrowserModule = angular.module('eve.market', [
  'ngMaterial',
  'ngMessages',
  'eve.cache',
  'eve.crest',
  'eve.api',
  'highcharts-ng'
]);

const controllers = bulk(__dirname, ['./**/*-controller.js']);
const services = bulk(__dirname, ['./**/*-service.js']);
const directives = bulk(__dirname, ['./**/*-directive.js']);
const components = bulk(__dirname, ['./**/*-component.js']);

function declareControllers(controllerMap) {
  Object.keys(controllerMap).forEach((key) => {
    let item = controllerMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      marketBrowserModule.controller(item.name, item.fn);
    } else {
      declareControllers(item);
    }
  });
}

function declareServices(serviceMap) {
  Object.keys(serviceMap).forEach((key) => {
    let item = serviceMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      marketBrowserModule.service(item.name, item.fn);
    } else {
      declareServices(item);
    }
  });
}


function declareDirectives(directiveMap) {
  Object.keys(directiveMap).forEach((key) => {
    let item = directiveMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      marketBrowserModule.directive(item.name, item.fn);
    } else {
      declareDirectives(item);
    }
  });
}

function declareComponents(componentsMap) {
  Object.keys(componentsMap).forEach((key) => {
    let item = componentsMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      marketBrowserModule.component(item.name, item.fn());
    } else {
      declareComponents(item);
    }
  });
}

declareDirectives(directives);
declareComponents(components);
declareServices(services);
declareControllers(controllers);

export default marketBrowserModule;
