import angular from 'angular';

const bulk = require('bulk-require');
const crestModule = angular.module('eve.crest', []);

const services = bulk(__dirname, ['./**/*-service.js']);

function declareServices(serviceMap) {
  Object.keys(serviceMap).forEach((key) => {
    let item = serviceMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      crestModule.service(item.name, item.fn);
    } else {
      declareServices(item);
    }
  });
}

declareServices(services);

crestModule.constant('CREST_CACHE_KEYS', {
  REGIONS: {key: 'Regions', duration: 1, durationUnit: 'days'},
  MARKET_TYPES: {key: 'MarketTypes', duration: 1, durationUnit: 'days'}
});

export default crestModule;
