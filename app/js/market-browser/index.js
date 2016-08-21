import angular from 'angular';
import 'angular-messages';

const bulk = require('bulk-require');
const marketBrowserModule = angular.module('eve.market', ['ngMaterial', 'ngMessages']);

const controllers = bulk(__dirname, ['./**/*-controller.js', './**/!(*index|*.spec).js']);
const services = bulk(__dirname, ['./**/*-service.js', './**/!(*index|*.spec).js']);
const directives = bulk(__dirname, ['./**/*-directive.js', './**/!(*index|*.spec).js']);

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

declareDirectives(directives);
declareServices(services);
declareControllers(controllers);

export default marketBrowserModule;
