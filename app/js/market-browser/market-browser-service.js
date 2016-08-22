function marketBrowserService(cacheService, CREST_CACHE_KEYS, API_CACHE_KEYS) {
  'ngInject';

  const service = {};

  service.cacheMarketTypes = cacheMarketTypes;
  service.getCachedMarketTypes = getCachedMarketTypes;
  service.getCachedTradeHubs = getCachedTradeHubs;
  service.cacheTradeHubs = cacheTradeHubs;

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
}

export default {
  name: 'marketBrowserService',
  fn: marketBrowserService
};
