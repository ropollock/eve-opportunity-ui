import angular from 'angular';

const bulk = require('bulk-require');
const apiModule = angular.module('eve.api', []);

const services = bulk(__dirname, ['./**/*-service.js']);

function declareServices(serviceMap) {
  Object.keys(serviceMap).forEach((key) => {
    let item = serviceMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      apiModule.service(item.name, item.fn);
    } else {
      declareServices(item);
    }
  });
}

declareServices(services);

apiModule.constant('API_CACHE_KEYS', {
  TRADE_HUBS: {key: 'TradeHubs', duration: 1, durationUnit: 'days'}
});

export default apiModule;
