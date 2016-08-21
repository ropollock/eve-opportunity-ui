import angular from 'angular';

const crestModule = angular.module('eve.crest', []);

crestModule.constant('CACHE_CONSTANTS', {
  PREFIX: 'eveOp',
  EXPIRES_VARIABLE: 'Expires'
});

crestModule.constant('CREST_CACHE_KEYS', {
  REGIONS: {key: 'Regions', duration: 1, durationUnit: 'days'},
  MARKET_TYPES: {key: 'MarketTypes', duration: 1, durationUnit: 'days'}
});

export default crestModule;
