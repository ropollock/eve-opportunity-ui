
function marketBrowserController($log, marketBrowserService, apiService, crestAPIService, $q) {
  'ngInject'

  const vm = this;

  vm.form = {
    loading: true,
    marketTypes: [],
    itemSearchText: '',
    selectedItem: null,
    queryItems: query => {return marketBrowserService.queryItems(query, vm.form.marketTypes) },
    tradeHubs: [],
    tradeHubSearchText: '',
    selectedTradeHub: null,
    queryTradeHubs: query => {return marketBrowserService.queryTradeHubs(query, vm.form.tradeHubs)},
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
    initMarketTypes();
    initTradeHubs();
  }

  function checkMarketBrowserLoaded() {
    if(vm.init.initCalls >= vm.init.initCallCount) {
      $log.info('Market types loaded');
      vm.form.loading = false;

      if(vm.form.tradeHubs.length > 0) {
        marketBrowserService.cacheTradeHubs(vm.form.tradeHubs);
      }

      if(vm.form.marketTypes.length > 0) {
        marketBrowserService.cacheMarketTypes(vm.form.marketTypes);
      }
    }
  }

  function initTradeHubs() {
    var cachedTradeHubs = marketBrowserService.getCachedTradeHubs();
    if(cachedTradeHubs !== null) {
      vm.init.initCalls += 1;
      vm.form.tradeHubs = cachedTradeHubs;
      checkMarketBrowserLoaded();
    }
    else {
      apiService.getTradeHubs()
        .success(success)
        .error(error);
    }

    function success(response) {
      vm.init.initCalls += 1;
      vm.form.tradeHubs = vm.form.tradeHubs.concat(response.items);

      checkMarketBrowserLoaded();
    }

    function error(response) {
      $log.error('initTradeHubs api error: ' + JSON.stringify(response));
    }
  }

  function initMarketTypes() {
    var cachedMarketTypes = marketBrowserService.getCachedMarketTypes();
    if(cachedMarketTypes !== null) {
      vm.init.initCalls += 1;
      vm.form.marketTypes = cachedMarketTypes;
      checkMarketBrowserLoaded();
    }
    else {
      crestAPIService.getAllMarketTypes(1)
        .success(success)
        .error(error);
    }

    function success(response) {
      vm.init.marketTypePageCount = response.pageCount;
      vm.init.initCallCount += vm.init.marketTypePageCount-1;
      vm.init.initCalls += 1;

      var itemsToAdd = [];

      response.items.forEach(function(item) {
        itemsToAdd.push(item.type);
      });

      vm.form.marketTypes = vm.form.marketTypes.concat(itemsToAdd);

      if(response.pageCount > 1) {
        loadAdditionalMarketTypePages();
      }
      else {
        checkMarketBrowserLoaded();
      }
    }

    function error(response) {
      $log.error('initMarketTypes CREST error: ' + JSON.stringify(response));
    }
  }

  function loadAdditionalMarketTypePages() {
    for(var i = 2; i <= vm.init.marketTypePageCount; i++) {
      vm.init.marketTypePromises.push(crestAPIService.getAllMarketTypes(i)
        .success(success)
        .error(error));
    }

    function success(response) {
      vm.init.initCalls += 1;
      var itemsToAdd = [];

      response.items.forEach(function(item) {
        itemsToAdd.push(item.type);
      });

      vm.form.marketTypes = vm.form.marketTypes.concat(itemsToAdd);
    }

    function error(response) {
      $log.error('CREST error: ' + JSON.stringify(response));
    }

    $q.all(vm.init.marketTypePromises).then(function() {
      checkMarketBrowserLoaded();
    });
  }
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
