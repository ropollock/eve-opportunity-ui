function marketBrowserController($scope, $log, marketBrowserService, apiService, crestAPIService, $q, marketChartsService) {
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

  vm.priceHistory = {
    config: marketChartsService.createDefaultPriceHistoryConfig(),
    data: {
      averageSeries: [],
      sma5DaySeries: [],
      sma20DaySeries: []
    }
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

  function analysis() {
    if(!isQueryReady(vm.form)) {
      // Fire invalid query event and no op
      $scope.$broadcast(EVENT_INVALID_QUERY);
      return;
    }

    // Fire query analysis event
    $scope.$broadcast(EVENT_QUERY_ANALYSIS);
    // Deconstruct the item and trade hub from the form
    let {selectedItem, selectedTradeHub} = vm.form;

    // Request an OHLC resource for the selected item and trade hub
    apiService.getOHLC(selectedItem.id, selectedTradeHub.name)
      .success((response) => {
        if(response.days) {
          // Reset series
          vm.ohlc.config.series = [];
          vm.priceHistory.config.series = [];
          // Add candlestick chart for OHLC
          vm.ohlc.config.series.push(marketChartsService.createOHLCSeries(response.days));
          // Add average volume chart
          vm.ohlc.config.series.push(marketChartsService.createOHLCVolumeSeries(response.days));
          // Add average line for price History
          vm.priceHistory.config.series.push(marketChartsService.createAverageSeries(response.days));
          // Add upper std dev for price history
          vm.priceHistory.config.series.push(marketChartsService.createUpperBollingerBandSeries(response.days));
          // Add lower std dev for price history
          vm.priceHistory.config.series.push(marketChartsService.createLowerBollingerBandSeries(response.days));
          // Add 5 day SMA line for price history
          //vm.priceHistory.config.series.push(marketChartsService.create5DaySMASeries(response.days));
          // Add 5 day upper std dev for price history
          //vm.priceHistory.config.series.push(
          //  marketChartsService.createUpperMovingBollingerBandSeries(response.days, 5));
          // Add 5 day lower std dev for price history
          //vm.priceHistory.config.series.push(
          //  marketChartsService.createLowerMovingBollingerBandSeries(response.days, 5));
          // Add 20 day SMA line for price history
          //vm.priceHistory.config.series.push(marketChartsService.create20DaySMASeries(response.days));

          // Fire analysis successful event
          $scope.$broadcast(EVENT_ANALYSIS_SUCCESSFUL);
        }
        else {
          $log.error('Unable to build OHLC chart from OHLC response.');
          throw new Error('Unable to build OHLC chart from OHLC response. Response:' + response);
        }
      })
      .error((error) => {
        // Fire analysis failed event
        $scope.$broadcast(EVENT_ANALYSIS_FAILED, {error: error, item: selectedItem.id, tradeHub: selectedItem.id});
      })
      .finally(() => {
        // Fire analysis complete event
        $scope.$broadcast(EVENT_ANALYSIS_COMPLETE);
      });
  }
}

export default {
  name: 'marketBrowserController',
  fn: marketBrowserController
};
