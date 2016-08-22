function marketBrowserService(cacheService, CREST_CACHE_KEYS, API_CACHE_KEYS) {
  'ngInject';

  const service = {};

  service.cacheMarketTypes = cacheMarketTypes;
  service.getCachedMarketTypes = getCachedMarketTypes;
  service.getCachedTradeHubs = getCachedTradeHubs;
  service.cacheTradeHubs = cacheTradeHubs;
  service.queryItems = queryItems;
  service.queryTradeHubs = queryTradeHubs;

  return service;

  function cacheMarketTypes(marketTypes) {
    return cacheService.cache(CREST_CACHE_KEYS.MARKET_TYPES.key, marketTypes, CREST_CACHE_KEYS.MARKET_TYPES.duration,
      CREST_CACHE_KEYS.MARKET_TYPES.durationUnit);
  }

  function cacheTradeHubs(tradeHubs) {
    cacheService.cache(API_CACHE_KEYS.TRADE_HUBS.key, tradeHubs, API_CACHE_KEYS.TRADE_HUBS.duration,
      API_CACHE_KEYS.TRADE_HUBS.durationUnit);
  }

  function getCachedMarketTypes() {
    return cacheService.get(CREST_CACHE_KEYS.MARKET_TYPES.key);
  }

  function getCachedTradeHubs() {
    return cacheService.get(CREST_CACHE_KEYS.REGIONS.key);
  }

  function queryItems(query, items) {
    var results =  query ? items.filter( marketTypeFilter(query) ) : items;

    // Sort results by string length
    results.sort(function(a, b){
      return a.name.length - b.name.length;
    });

    return results;

    // Filter results by query string
    function marketTypeFilter(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (angular.lowercase(item.name).indexOf(lowercaseQuery) === 0);
      };
    }
  }

  function queryTradeHubs(query, tradeHubs) {
    var results =  query ? tradeHubs.filter( tradeHubFilter(query) ) : tradeHubs;

    // Sort results by string length
    results.sort(function(a, b){
      return a.name.length - b.name.length;
    });

    return results;

    // Filter results by query string
    function tradeHubFilter(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (angular.lowercase(item.name).indexOf(lowercaseQuery) === 0);
      };
    }
  }
}

export default {
  name: 'marketBrowserService',
  fn: marketBrowserService
};
