function cacheService(moment, CACHE_CONSTANTS) {
  'ngInject';

  const service = {};

  service.get = get;
  service.cache = cache;

  return service;

  function get(key) {
    var cacheKey = CACHE_CONSTANTS.PREFIX + key;
    var cacheObj = localStorage.getItem(cacheKey);

    if(cacheObj) {
      cacheObj = JSON.parse(cacheObj);
      if (checkExpired(cacheObj)) {
        deleteCache(cacheKey);
        return null;
      }
      else {
        return cacheObj.data;
      }
    }
    else {
      return null;
    }
  }

  function cache(key, data, duration, durationUnit) {
    var obj = {
      data: data
    };

    obj[CACHE_CONSTANTS.PREFIX + CACHE_CONSTANTS.EXPIRES_VARIABLE] = moment().add(duration, durationUnit).unix();
    localStorage.setItem(CACHE_CONSTANTS.PREFIX + key, JSON.stringify(obj));
  }

  function checkExpired(cacheObj) {
    if(cacheObj[CACHE_CONSTANTS.PREFIX + CACHE_CONSTANTS.EXPIRES_VARIABLE]) {
      var expires = cacheObj[CACHE_CONSTANTS.PREFIX + CACHE_CONSTANTS.EXPIRES_VARIABLE];

      return expires <= moment().unix();
    }
    else {
      throw new Error('No expires property found in cache object');
    }
  }

  function deleteCache(key) {
    localStorage.removeItem(key);
  }
}

export default {
  name: 'cacheService',
  fn: cacheService
};
