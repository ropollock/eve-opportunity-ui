import angular from 'angular';
import 'angular-moment';
import './cache-service';

const bulk = require('bulk-require');
const cacheModule = angular.module('eve.cache', ['angularMoment']);

const services = bulk(__dirname, ['./**/*-service.js', './**/!(*index|*.spec).js']);

function declareServices(serviceMap) {
  Object.keys(serviceMap).forEach((key) => {
    let item = serviceMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      cacheModule.service(item.name, item.fn);
    } else {
      declareServices(item);
    }
  });
}

declareServices(services);

cacheModule.constant('CACHE_CONSTANTS', {
  PREFIX: 'eveOp',
  EXPIRES_VARIABLE: 'Expires'
});

export default cacheModule;
