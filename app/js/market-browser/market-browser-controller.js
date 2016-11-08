
function marketBrowserController($scope, $log, $timeout, marketBrowserService, apiService, crestAPIService, $q, marketChartsService) {
  'ngInject'

  const vm = this;
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
    analysis: analysis
  };

  vm.analysis = {
    show: false
  };

  vm.ohlc = {
    config: marketChartsService.createDefaultOHLCConfig()
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
      vm.analysis.show = false;
    });
  }

  function onAnalysisComplete() {
    $scope.$on(EVENT_ANALYSIS_COMPLETE, () => {
      vm.form.loading = false;
    });
  }

  function onAnalysisSuccessful() {
    $scope.$on(EVENT_ANALYSIS_SUCCESSFUL, () => {
      vm.analysis.show = true;
    });
  }

  function onAnalysisFailed() {
    $scope.$on(EVENT_ANALYSIS_FAILED, (err) => {
      $log.error(err);
      // @TODO show error state
      $log.error('Unable to query OHLC for : ' + error.item + ' : ' + error.tradeHub + ' ' + JSON.stringify(error.error));
    })
  }

  function onInvalidQuery() {
    $scope.$on(EVENT_INVALID_QUERY, () => {
      vm.analysis.show = false;
    });
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
    let cachedTradeHubs = marketBrowserService.getCachedTradeHubs();
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
    let cachedMarketTypes = marketBrowserService.getCachedMarketTypes();
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
      let itemsToAdd = [];

      response.items.forEach(function(item) {
        itemsToAdd.push(item.type);
      });

      vm.form.marketTypes = vm.form.marketTypes.concat(itemsToAdd);
    }

    function error(response) {
      $log.error('CREST error: ' + JSON.stringify(response));
    }

    // Await outstanding market type queries
    $q.all(vm.init.marketTypePromises).then(function() {
      checkMarketBrowserLoaded();
    });
  }

  function isQueryReady(form) {
    let {selectedItem, selectedTradeHub} = form;
    return (selectedItem && selectedTradeHub);
  }

  function analysis() {
    if(!isQueryReady(vm.form)) {
      $scope.$broadcast(EVENT_INVALID_QUERY);
      return;
    }

    $scope.$broadcast(EVENT_QUERY_ANALYSIS);
    let {selectedItem, selectedTradeHub} = vm.form;

    // Request an OHLC resource for the selected item and trade hub
    apiService.getOHLC(selectedItem.id, selectedTradeHub.name)
      .success((response) => {
        $log.debug(response);
        if(response.days) {
          // Use the OHLC resource data to create a highstock candlestick chart
          vm.ohlc.config.series = [];
          vm.ohlc.config.series.push({
            type: 'candlestick',
            name: 'OHLC',
            tooltip: {
              valueDecimals: 1,
              valueSuffix: ' ISK',
            },
            data: response.days.map((day) => {
              return marketChartsService.createOHLCInterval({
                open: day.open,
                close: day.close,
                high: day.max,
                low: day.min,
                time: day.time * 1000
              })
            }),
            dataGrouping: {
              units: [
                ['day', 1]
              ]
            }
          });

          vm.ohlc.config.series.push({
            type: 'column',
            name: 'Average Volume',
            yAxis: 1,
            tooltip: {
              valueDecimals: 1
            },
            dataGrouping: {
              units: [
                ['day', 1]
              ]
            },
            data: response.days.map((day) => {
              return [day.time * 1000, day.avgVolume];
            })
          });

          $log.debug(vm.ohlc.config);
          $scope.$broadcast(EVENT_ANALYSIS_SUCCESSFUL);
        }
        else {
          // @TODO log error
          throw new Error('Unable to build ohlc chart from ohlc response. Response:' + response);
        }
      })
      .error((error) => {
        $scope.$broadcast(EVENT_ANALYSIS_FAILED, {error: error, item: selectedItem.id, tradeHub: selectedItem.id});
      })
      .finally(() => {
        $scope.$broadcast(EVENT_ANALYSIS_COMPLETE);
      });
  }
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
