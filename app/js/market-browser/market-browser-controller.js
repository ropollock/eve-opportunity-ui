
function marketBrowserController($log, cacheService, CREST_CACHE_KEYS) {
  'ngInject'

  const vm = this;

  vm.form = {
    loading: true,
    marketTypes: [],
    itemSearchText: '',
    selectedItem: null,
    queryItems: null,
    regions: [],
    regionSearchText: '',
    selectedRegion: null,
    queryRegions: null,
    analysis: null
  };

  vm.analysis = {
    loading: false
  };

  vm.init = {
    marketTypePageCount: 1,
    initCalls: 0,
    initCallCount: 2,
    marketTypePromises: []
  };

  activate();

  function activate() {
    $log.info('Activating MarketBrowserController');
    /*initMarketTypes();
    initRegions();*/
  }

  function checkMarketBrowserLoaded() {
    if(vm.init.initCalls >= vm.init.initCallCount) {
      $log.info('Market types loaded');
      vm.form.loading = false;

/*      if($scope.form.regions.length > 0) {
        cacheRegions();
      }*/


      if(vm.form.marketTypes.length > 0) {
        cacheMarketTypes();
      }
    }
  }

  function cacheMarketTypes() {
    cacheService.cache(CREST_CACHE_KEYS.MARKET_TYPES.key, vm.form.marketTypes, CREST_CACHE_KEYS.MARKET_TYPES.duration,
      CREST_CACHE_KEYS.MARKET_TYPES.durationUnit);
  }

  /*function initMarketTypes() {
    var cachedMarketTypes = CacheService.get(CREST_CACHE_KEYS.MARKET_TYPES.key);
    if(cachedMarketTypes !== null) {
      $scope.init.initCalls += 1;
      $scope.form.marketTypes = cachedMarketTypes;
      checkMarketBrowserLoaded();
    }
    else {
      CrestAPIService.market.types.getAll(1)
        .success(success)
        .error(error);
    }

    function success(response, status, headers, config) {
      $scope.init.marketTypePageCount = response.pageCount;
      $scope.init.initCallCount += $scope.init.marketTypePageCount-1;
      $scope.init.initCalls += 1;
      $scope.init.initLoadPercentage = ($scope.init.initCalls / $scope.init.initCallCount) * 100;

      var itemsToAdd = [];

      response.items.forEach(function(item, arr) {
        itemsToAdd.push(item.type);
      });

      $scope.form.marketTypes = $scope.form.marketTypes.concat(itemsToAdd);

      if(response.pageCount > 1) {
        loadAdditionalMarketTypePages();
      }
      else {
        checkMarketBrowserLoaded();
      }
    }

    function error(response, status, headers, config) {
      $log.error('initMarketTypes CREST error: ' + JSON.stringify(response));
    }
  }

  function loadAdditionalMarketTypePages() {

    for(var i = 2; i <= $scope.init.marketTypePageCount; i++) {
      $scope.init.marketTypePromises.push(CrestAPIService.market.types.getAll(i)
        .success(success)
        .error(error));
    }

    function success(response, status, headers, config) {
      $scope.init.initCalls += 1;
      $scope.init.initLoadPercentage = ($scope.init.initCalls / $scope.init.initCallCount) * 100;

      var itemsToAdd = [];

      response.items.forEach(function(item, arr) {
        itemsToAdd.push(item.type);
      });

      $scope.form.marketTypes = $scope.form.marketTypes.concat(itemsToAdd);
    }

    function error(response, status, headers, config) {
      $log.error('CREST error: ' + JSON.stringify(response));
    }

    $q.all($scope.init.marketTypePromises).then(function() {
      checkMarketBrowserLoaded();
    });
  }*/
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
