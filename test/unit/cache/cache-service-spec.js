describe('Unit: cacheService', function() {
  let cache, CACHE_CONSTANTS, moment;

  beforeEach(function() {
    localStorage.clear();
    angular.mock.module('app');
    angular.mock.inject(($injector) => {
      moment = $injector.get('moment');
      CACHE_CONSTANTS = $injector.get('CACHE_CONSTANTS');
      cache = $injector.get('cacheService');
    });
  });

  it('should have moment', function () {
    expect(moment).toBeDefined();
  });

  it('should have a cache constants object', function() {
    expect(CACHE_CONSTANTS).toBeDefined();
  });

  it('cache constants should have a cache prefix', function() {
    expect(CACHE_CONSTANTS.PREFIX).toBeDefined();
  });

  it('cache constants should have an expires variable name', function() {
    expect(CACHE_CONSTANTS.EXPIRES_VARIABLE).toBeDefined();
  });

  it('should cache data to local storage', function() {
    let dataCache = {name:'test name'};
    let key = 'test';
    let duration = 1;
    let unit = 'minute';
    let expires = moment().add(duration, unit).unix();
    cache.cache(key, dataCache, duration, unit);
    const result = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.PREFIX + key));
    expect(result).toBeDefined();
    expect(result.data.name).toEqual(dataCache.name);
    let expiresVar = CACHE_CONSTANTS.PREFIX + CACHE_CONSTANTS.EXPIRES_VARIABLE;
    expect(result[expiresVar]).toBeDefined();
    expect(result[expiresVar]).toEqual(expires);
  });

  it('should get non expired data from local storage', function() {
    let dataCache = {name:'test name'};
    let key = 'test';
    let duration = 1;
    let unit = 'minute';
    cache.cache(key, dataCache, duration, unit);
    const result = cache.get(key);
    expect(result).toBeDefined();
    expect(result.name).toEqual(dataCache.name);
    const cached = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.PREFIX + key));
    expect(cached).toBeDefined();
  });

  it('should not get expired data from local storage', function() {
    let dataCache = {name:'test name'};
    let key = 'test';
    let duration = 0;
    let unit = 'minute';
    cache.cache(key, dataCache, duration, unit);
    const result = cache.get(key);
    expect(result).toBe(null);
    const cached = JSON.parse(localStorage.getItem(CACHE_CONSTANTS.PREFIX + key));
    expect(cached).toBe(null);
  });

  it('should get no data for missing key in local storage', function() {
    expect(cache.get('missing')).toBe(null);
  });

});
