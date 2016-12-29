function marketBrowserController($scope, $log, marketBrowserService, apiService, crestAPIService, $q) {
  'ngInject'

  const vm = this;
  // Event constants
  const EVENT_QUERY_ANALYSIS = 'eventQueryAnalysis';
  const EVENT_ANALYSIS_COMPLETE = 'eventAnalysisComplete';
  const EVENT_ANALYSIS_SUCCESSFUL = 'eventAnalysisSuccessful';
  const EVENT_ANALYSIS_FAILED = 'eventAnalysisFailed';
  const EVENT_INVALID_QUERY = 'eventInvalidQuery';

  vm.form = {
    loading: true,
    marketTypes: [],
    itemSearchText: '',
    selectedItem: null,
    queryItems: query => {return marketBrowserService.queryItems(query, vm.form.marketTypes)},
    tradeHubs: [],
    tradeHubSearchText: '',
    selectedTradeHub: null,
    queryTradeHubs: query => {return marketBrowserService.queryTradeHubs(query, vm.form.tradeHubs)},
    requestAnalysis: requestAnalysis,
    showAnalysis: false
  };

  vm.ohlc = {
    days: []
  };

  vm.init = {
    marketTypePageCount: 1,
    initCalls: 0,
    initCallCount: 2,
    marketTypePromises: []
  };

  activate();

  function activate() {
    $log.info('Activating MarketBrowserController.');
    initEvents();
    initMarketTypes();
    initTradeHubs();
  }

  function initEvents() {
    onQueryAnalysis();
    onAnalysisComplete();
    onAnalysisSuccessful();
    onAnalysisFailed();
    onInvalidQuery();
  }

  function onQueryAnalysis() {
    $scope.$on(EVENT_QUERY_ANALYSIS, () => {
      vm.form.loading = true;
      vm.form.showAnalysis = false;
    });
  }

  function onAnalysisComplete() {
    $scope.$on(EVENT_ANALYSIS_COMPLETE, () => {
      vm.form.loading = false;
    });
  }

  function onAnalysisSuccessful() {
    $scope.$on(EVENT_ANALYSIS_SUCCESSFUL, () => {
      vm.form.showAnalysis = true;
    });
  }

  function onAnalysisFailed() {
    $scope.$on(EVENT_ANALYSIS_FAILED, (error) => {
      $log.error(error);
      // @TODO show error state
    })
  }

  function onInvalidQuery() {
    $scope.$on(EVENT_INVALID_QUERY, () => {
      vm.form.showAnalysis = false;
    });
  }

  // @TODO make this more pure
  function checkMarketBrowserLoaded() {
    if(vm.init.initCalls >= vm.init.initCallCount) {
      $log.info('Market types have been loaded.');
      vm.form.loading = false;

      if(vm.form.tradeHubs.length > 0) {
        marketBrowserService.cacheTradeHubs(vm.form.tradeHubs);
      }

      if(vm.form.marketTypes.length > 0) {
        marketBrowserService.cacheMarketTypes(vm.form.marketTypes);
      }
    }
  }

  // @TODO make this more pure
  function initTradeHubs() {
    let cachedTradeHubs = marketBrowserService.getCachedTradeHubs();
    if(cachedTradeHubs !== null) {
      vm.init.initCalls += 1;
      vm.form.tradeHubs = cachedTradeHubs;
      checkMarketBrowserLoaded();
    }
    else {
      apiService.getTradeHubs()
        .success((response) => {
          vm.init.initCalls += 1;
          vm.form.tradeHubs = vm.form.tradeHubs.concat(response.items);
          checkMarketBrowserLoaded();
        })
        .error((response) => {
          $log.error('initTradeHubs api error: ' + JSON.stringify(response));
        });
    }
  }
  // @TODO make this more pure
  function initMarketTypes() {
    let cachedMarketTypes = marketBrowserService.getCachedMarketTypes();
    if(cachedMarketTypes !== null) {
      vm.init.initCalls += 1;
      vm.form.marketTypes = cachedMarketTypes;
      checkMarketBrowserLoaded();
    }
    else {
      crestAPIService.getAllMarketTypes(1)
        .success((response) => {
          vm.init.marketTypePageCount = response.pageCount;
          vm.init.initCallCount += vm.init.marketTypePageCount-1;
          vm.init.initCalls += 1;

          let itemsToAdd = [];

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
        })
        .error((response) => {
          $log.error('initMarketTypes CREST error: ' + JSON.stringify(response));
        });
    }
  }

  function loadAdditionalMarketTypePages() {
    for(let i = 2; i <= vm.init.marketTypePageCount; i++) {
      vm.init.marketTypePromises.push(crestAPIService.getAllMarketTypes(i)
        .success((response) => {
          vm.init.initCalls += 1;
          let itemsToAdd = [];

          response.items.forEach(function(item) {
            itemsToAdd.push(item.type);
          });

          vm.form.marketTypes = vm.form.marketTypes.concat(itemsToAdd);
        })
        .error((response) => {
          $log.error('CREST error: ' + JSON.stringify(response));
        }));
    }

    // Await outstanding market type queries
    $q.all(vm.init.marketTypePromises).then(function() {
      checkMarketBrowserLoaded();
    });
  }

  /**
   * isQueryReady
   *
   * Checks that an item and a trade hub are selected in the form.
   *
   * @param form
   * @returns boolean
   */
  function isQueryReady(form) {
    let {selectedItem, selectedTradeHub} = form;
    return (selectedItem && selectedTradeHub);
  }

  function requestAnalysis(form) {
    if(!isQueryReady(form)) {
      // Fire invalid query event and no op
      $scope.$broadcast(EVENT_INVALID_QUERY);
      return;
    }

    // Pull out the item ID and trade hub name from the form.
    let {id: itemId} = form.selectedItem;
    let {name: tradeHubName} = form.selectedTradeHub;

    // Fire query analysis event
    $scope.$broadcast(EVENT_QUERY_ANALYSIS);

    requestOHLC(itemId, tradeHubName)
      .success((response) => {
        // Update OHLC days data
        vm.ohlc.days = response.days;
        // Fire analysis successful event
        $scope.$broadcast(EVENT_ANALYSIS_SUCCESSFUL);
      })
      .error((error) => {
        $log.error('Error requesting OHLC data from API.', error);
        // Fire analysis failed event
        $scope.$broadcast(EVENT_ANALYSIS_FAILED, {error: error, item: itemId, tradeHub: tradeHubName});
      })
      .finally(() => {
        // Fire analysis complete event
        $scope.$broadcast(EVENT_ANALYSIS_COMPLETE);
      });
  }

  /**
   * requestOHLC
   *
   * Takes an itemId and tradeHubName then returns an api request promise for OHLC data.
   * OHLC data events are emitted upon success or failure of the request.
   *
   * @return promise
   * @param {String} itemId
   * @param {String} tradeHubName
   */
  function requestOHLC(itemId, tradeHubName) {
      // Request an OHLC resource for the selected item and trade hub
    return apiService.getOHLC(itemId, tradeHubName)
      .success((response) => {
        if(response.days) {
          return {item: itemId, tradeHub: tradeHubName, response: response};
        }
        else {
          return $q.reject(new Error('Unable to build OHLC chart from OHLC response. Response:'
            + JSON.stringify(response)));
        }
      });
  }
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
