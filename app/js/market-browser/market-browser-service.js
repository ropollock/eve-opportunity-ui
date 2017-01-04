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

  /**
   * cacheMarketTypes
   *
   * Caches market types in local storage.
   *
   * @param {Object} marketTypes
   */
  function cacheMarketTypes(marketTypes) {
    cacheService.cache(CREST_CACHE_KEYS.MARKET_TYPES.key, marketTypes, CREST_CACHE_KEYS.MARKET_TYPES.duration,
      CREST_CACHE_KEYS.MARKET_TYPES.durationUnit);
  }

  /**
   * cacheTradeHubs
   *
   * Caches trade hubs in local storage.
   *
   * @param tradeHubs
   */
  function cacheTradeHubs(tradeHubs) {
    cacheService.cache(API_CACHE_KEYS.TRADE_HUBS.key, tradeHubs, API_CACHE_KEYS.TRADE_HUBS.duration,
      API_CACHE_KEYS.TRADE_HUBS.durationUnit);
  }

  /**
   * getCachedMarketTypes
   *
   * Retrieves market types from local storage.
   *
   * @returns {Object}
   */
  function getCachedMarketTypes() {
    return cacheService.get(CREST_CACHE_KEYS.MARKET_TYPES.key);
  }

  /**
   * getCachedTradeHubs
   *
   * Retrieves trade hubs from local storage.
   *
   * @returns {Object}
   */
  function getCachedTradeHubs() {
    return cacheService.get(CREST_CACHE_KEYS.REGIONS.key);
  }

  /**
   * queryItems
   *
   * Returns an array of items based on a query string matched against a item name.
   *
   * @param query
   * @param items
   * @return {*}
   */
  function queryItems(query, items) {
    let results =  query ? items.filter( marketTypeFilter(query) ) : items;

    // Sort results by string length
    results.sort(function(a, b){
      return a.name.length - b.name.length;
    });

    return results;

    // Filter results by query string
    function marketTypeFilter(query) {
      let lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (angular.lowercase(item.name).indexOf(lowercaseQuery) === 0);
      };
    }
  }

  /**
   * queryTradeHubs
   *
   * Returns an array of trade hubs based on a query string matched against a trade hub name.
   *
   * @param query
   * @param tradeHubs
   * @return {*}
   */
  function queryTradeHubs(query, tradeHubs) {
    let results =  query ? tradeHubs.filter( tradeHubFilter(query) ) : tradeHubs;

    // Sort results by string length
    results.sort(function(a, b){
      return a.name.length - b.name.length;
    });

    return results;

    // Filter results by query string
    function tradeHubFilter(query) {
      let lowercaseQuery = angular.lowercase(query);

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
