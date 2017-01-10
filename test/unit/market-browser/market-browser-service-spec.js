describe('Unit: marketBrowserService', function() {
  let marketBrowserService, CREST_CACHE_KEYS, CACHE_CONSTANTS, cache, API_CACHE_KEYS;

  beforeEach(function() {
    localStorage.clear();
    angular.mock.module('app');
    angular.mock.inject(($injector) => {
      CREST_CACHE_KEYS = $injector.get('CREST_CACHE_KEYS');
      CACHE_CONSTANTS = $injector.get('CACHE_CONSTANTS');
      API_CACHE_KEYS = $injector.get('API_CACHE_KEYS');
      cache = $injector.get('cacheService');
      marketBrowserService = $injector.get('marketBrowserService');
    });
  });

  it('should have a cache service', function () {
    expect(cache).toBeDefined();
  });

  it('should have CREST_CACHE_KEYS constants', function () {
    expect(CREST_CACHE_KEYS).toBeDefined();
  });

  it('CREST_CACHE_KEYS should have MARKET_TYPES key', function () {
    expect(CREST_CACHE_KEYS.MARKET_TYPES.key).toBeDefined();
  });

  it('should have API_CACHE_KEYS conatnts', function () {
    expect(API_CACHE_KEYS).toBeDefined();
  });

  it('API_CACHE_KEYS should have TRADE_HUBS key', function () {
    expect(API_CACHE_KEYS.TRADE_HUBS.key).toBeDefined();
  });

  it('should have CACHE_CONSTANTS', function () {
    expect(CACHE_CONSTANTS).toBeDefined();
  });

  it('should cache market types', function() {
    let dataCache = {name: 'test data'};
    marketBrowserService.cacheMarketTypes(dataCache);
    const result = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.PREFIX + CREST_CACHE_KEYS.MARKET_TYPES.key));
    expect(result).toBeDefined();
    expect(result.data.name).toEqual(dataCache.name);
  });

  it('should get market types from cache service', function () {
    let dataCache = {name: 'test data'};
    marketBrowserService.cacheMarketTypes(dataCache);
    const result = marketBrowserService.getCachedMarketTypes();
    expect(result).toBeDefined();
    expect(result.name).toEqual(dataCache.name);
  });

  it('should cache trade hubs', function() {
    let dataCache = {name: 'test data'};
    marketBrowserService.cacheTradeHubs(dataCache);
    const result = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.PREFIX + API_CACHE_KEYS.TRADE_HUBS.key));
    expect(result).toBeDefined();
    expect(result.data.name).toEqual(dataCache.name);
  });

  it('should get trade hubs from cache service', function () {
    let dataCache = {name: 'test data'};
    marketBrowserService.cacheTradeHubs(dataCache);
    const result = marketBrowserService.getCachedTradeHubs();
    expect(result).toBeDefined();
    expect(result.name).toEqual(dataCache.name);
  });

  it('queryTradeHubs should match a partial trade hub query', function () {
    const tradeHubs = [{name: 'Jita'}, {name: 'Amarr'}, {name: 'Rens'}, {name: 'Hek'}];
    let query = 'Ji';
    const jitaResult = marketBrowserService.queryTradeHubs(query, tradeHubs);
    expect(jitaResult.length).toEqual(1);
    expect(jitaResult[0].name).toEqual('Jita');
  });

  it('queryTradeHubs should match an exact trade hub query', function () {
    const tradeHubs = [{name: 'Jita'}, {name: 'Amarr'}, {name: 'Rens'}, {name: 'Hek'}];
    let exactQuery = 'Jita';
    const exactJitaResult = marketBrowserService.queryTradeHubs(exactQuery, tradeHubs);
    expect(exactJitaResult.length).toEqual(1);
    expect(exactJitaResult[0].name).toEqual('Jita');
  });

  it('queryTradeHubs should match a lowercase trade hub query', function () {
    const tradeHubs = [{name: 'Jita'}, {name: 'Amarr'}, {name: 'Rens'}, {name: 'Hek'}];
    let lowerCaseQuery = 'jita';
    const lowercaseJitaResult = marketBrowserService.queryTradeHubs(lowerCaseQuery, tradeHubs);
    expect(lowercaseJitaResult.length).toEqual(1);
    expect(lowercaseJitaResult[0].name).toEqual('Jita');
  });

  it('queryItems should match a partial item query', function () {
    const items = [{name: 'Stilleto'}, {name: 'Svipul'}, {name: 'Hecate'}, {name: 'Osprey'}];
    let query = 'Stil';
    const stilletoResult = marketBrowserService.queryItems(query, items);
    expect(stilletoResult.length).toEqual(1);
    expect(stilletoResult[0].name).toEqual('Stilleto');
  });

  it('queryItems should match an exact item query', function () {
    const items = [{name: 'Stilleto'}, {name: 'Svipul'}, {name: 'Hecate'}, {name: 'Osprey'}];
    let exactQuery = 'Stilleto';
    const exactStilletoResult = marketBrowserService.queryItems(exactQuery, items);
    expect(exactStilletoResult.length).toEqual(1);
    expect(exactStilletoResult[0].name).toEqual('Stilleto');
  });

  it('queryItems should match a lowercase item query', function () {
    const items = [{name: 'Stilleto'}, {name: 'Svipul'}, {name: 'Hecate'}, {name: 'Osprey'}];
    let lowerCaseQuery = 'stilleto';
    const lowercaseStilletoResult = marketBrowserService.queryItems(lowerCaseQuery, items);
    expect(lowercaseStilletoResult.length).toEqual(1);
    expect(lowercaseStilletoResult[0].name).toEqual('Stilleto');
  });

});
